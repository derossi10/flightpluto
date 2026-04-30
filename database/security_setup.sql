-- Security System Tables
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    salt VARCHAR(50) NOT NULL,
    mobile VARCHAR(100),
    email VARCHAR(100),
    system_admin BOOLEAN DEFAULT 0,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    added_by INT,
    account_active BOOLEAN DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    reason_inactive VARCHAR(1000),
    deactivated_date DATETIME,
    deactivated_by INT
);

CREATE TABLE IF NOT EXISTS objects (
    object_id INT PRIMARY KEY AUTO_INCREMENT,
    object_name VARCHAR(100) NOT NULL,
    object_code VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_privileges (
    privilege_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    object_id INT NOT NULL,
    valid BOOLEAN DEFAULT 1,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    added_by INT
);

-- Default System Objects
INSERT INTO objects (object_name, object_code) VALUES 
('City Management', 'CITY'),
('Airport Management', 'AIRPORT'),
('Airline Management', 'AIRLINE'),
('Flight Management', 'FLIGHT'),
('User Management', 'USER'),
('Plane Management', 'PLANE')
ON DUPLICATE KEY UPDATE object_name = VALUES(object_name);

-- Stored Procedures for User Management

DELIMITER //

-- Check if user exists
CREATE PROCEDURE sp_User_Check(
    IN p_user_id INT,
    IN p_username VARCHAR(100)
)
BEGIN
    SELECT * FROM users 
    WHERE user_id <> p_user_id 
    AND username = p_username;
END //

-- Save or Update User
CREATE PROCEDURE sp_User_Save(
    IN p_user_id INT,
    IN p_username VARCHAR(100),
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_password VARCHAR(100),
    IN p_salt VARCHAR(50),
    IN p_mobile VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_system_admin BOOLEAN,
    IN p_added_by INT
)
BEGIN
    IF p_user_id = 0 THEN
        -- Create New User
        INSERT INTO users (
            username, first_name, last_name, password, salt, 
            mobile, email, system_admin, added_by, date_added, account_active
        ) VALUES (
            p_username, p_first_name, p_last_name, p_password, p_salt, 
            p_mobile, p_email, p_system_admin, p_added_by, NOW(), 1
        );
    ELSE
        -- Update Existing User (Skip password/salt update here as per lecture)
        UPDATE users SET 
            username = p_username,
            first_name = p_first_name,
            last_name = p_last_name,
            mobile = p_mobile,
            email = p_email,
            system_admin = p_system_admin
        WHERE user_id = p_user_id;
    END IF;
END //

-- Select All Users (with self-join for added_by name)
CREATE PROCEDURE sp_User_SelectAll()
BEGIN
    SELECT 
        u.*, 
        CONCAT(a.first_name, ' ', a.last_name) AS added_by_name 
    FROM users u
    LEFT JOIN users a ON a.user_id = u.added_by
    ORDER BY u.first_name, u.last_name;
END //

-- Select User by ID
CREATE PROCEDURE sp_User_SelectByID(
    IN p_user_id INT
)
BEGIN
    SELECT * FROM users WHERE user_id = p_user_id;
END //

-- Login Procedure
CREATE PROCEDURE sp_User_Login(
    IN p_username VARCHAR(100)
)
BEGIN
    SELECT user_id, username, first_name, last_name, password, salt, system_admin 
    FROM users 
    WHERE username = p_username AND account_active = 1;
END //

-- Privilege Management Procedures

CREATE PROCEDURE sp_Object_SelectAll()
BEGIN
    SELECT * FROM objects ORDER BY object_name;
END //

CREATE PROCEDURE sp_UserPrivilege_Save(
    IN p_user_id INT,
    IN p_object_id INT,
    IN p_valid BOOLEAN,
    IN p_added_by INT
)
BEGIN
    -- Check if privilege already exists
    IF EXISTS (SELECT 1 FROM user_privileges WHERE user_id = p_user_id AND object_id = p_object_id) THEN
        UPDATE user_privileges SET 
            valid = p_valid,
            added_by = p_added_by,
            date_added = NOW()
        WHERE user_id = p_user_id AND object_id = p_object_id;
    ELSE
        INSERT INTO user_privileges (user_id, object_id, valid, added_by, date_added)
        VALUES (p_user_id, p_object_id, p_valid, p_added_by, NOW());
    END IF;
END //

CREATE PROCEDURE sp_UserPrivilege_SelectByUser(
    IN p_user_id INT
)
BEGIN
    SELECT 
        o.object_id, 
        o.object_name, 
        o.object_code, 
        COALESCE(up.valid, 0) AS has_access
    FROM objects o
    LEFT JOIN user_privileges up ON up.object_id = o.object_id AND up.user_id = p_user_id;
END //

DELIMITER ;
