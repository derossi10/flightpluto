<?php
require_once("db.php");

class User extends Db {

    public function checkUser($user_id, $username) {
        $sql = "CALL sp_User_Check(?, ?)";
        $stmt = $this->getData($sql, [$user_id, $username]);
        return $stmt->rowCount() > 0;
    }

    public function saveUser($user_id, $username, $first_name, $last_name, $password, $salt, $mobile, $email, $system_admin, $added_by) {
        if ($this->checkUser($user_id, $username)) {
            return json_encode(["status" => "error", "message" => "User already exists"]);
        }

        $sql = "CALL sp_User_Save(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $this->execute($sql, [$user_id, $username, $first_name, $last_name, $password, $salt, $mobile, $email, $system_admin, $added_by]);
        
        return json_encode([
            "status" => "success", 
            "message" => ($user_id == 0 ? "User created successfully" : "User updated successfully")
        ]);
    }

    public function getUsers() {
        $sql = "CALL sp_User_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getUserDetails($user_id) {
        $sql = "CALL sp_User_SelectByID(?)";
        return $this->getJSON($sql, [$user_id]);
    }

    public function login($username, $password) {
        $sql = "CALL sp_User_Login(?)";
        $stmt = $this->getData($sql, [$username]);
        $user_data = $stmt->fetch();

        if ($user_data) {
            $stored_password = $user_data['password'];
            $salt = $user_data['salt'];
            
            // Verify salted hash
            $check_hash = hash('sha256', $password . $salt);
            
            if ($check_hash === $stored_password) {
                // Set Session
                $_SESSION['user_id'] = $user_data['user_id'];
                $_SESSION['username'] = $user_data['username'];
                $_SESSION['full_name'] = $user_data['first_name'] . ' ' . $user_data['last_name'];
                $_SESSION['is_admin'] = $user_data['system_admin'];
                
                return json_encode(["status" => "success", "message" => "Login successful", "user" => $_SESSION]);
            }
        }
        return json_encode(["status" => "error", "message" => "Invalid username or password"]);
    }

    public function getObjects() {
        $sql = "CALL sp_Object_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getUserPrivileges($user_id) {
        $sql = "CALL sp_UserPrivilege_SelectByUser(?)";
        return $this->getJSON($sql, [$user_id]);
    }

    public function savePrivilege($user_id, $object_id, $valid, $added_by) {
        $sql = "CALL sp_UserPrivilege_Save(?, ?, ?, ?)";
        $this->execute($sql, [$user_id, $object_id, $valid, $added_by]);
        return json_encode(["status" => "success", "message" => "Privilege updated"]);
    }
}
?>
