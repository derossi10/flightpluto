<?php
session_start();

class Db {
    private $host = "localhost";
    private $db_name = "flightpluto";
    private $username = "root";
    private $password = "";
    private $charset = "utf8mb4";
    private $conn = null;

    public function connect() {
        if ($this->conn === null) {
            try {
                $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
                $this->conn = new PDO($dsn, $this->username, $this->password);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                header('Content-Type: application/json');
                echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
                exit;
            }
        }
        return $this->conn;
    }

    public function execute($sql, $params = []) {
        $stmt = $this->connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public function getData($sql, $params = []) {
        return $this->execute($sql, $params);
    }

    public function getJSON($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return json_encode($stmt->fetchAll());
    }
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>
