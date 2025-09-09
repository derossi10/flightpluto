<?php
session_start();

class Db {
    // DB connection details
    private $servername;
    private $databasename;
    private $username;
    private $password;
    private $charset;

    // Connect to the database
    function connect() {
        $this->servername = "localhost";
        $this->databasename = "flightpluto";
        $this->username = "root";
        $this->password = "";
        $this->charset = "utf8mb4";

        try {
            $dsn = "mysql:host=" . $this->servername . ";dbname=" . $this->databasename . ";charset=" . $this->charset;
            $pdo = new PDO($dsn, $this->username, $this->password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    // Run a raw query
    function getData($sql) {
        return $this->connect()->query($sql);
    }

    // Get query result as JSON
    function getJSON($sql) {
        $rst = $this->getData($sql);
        return json_encode($rst->fetchAll(PDO::FETCH_ASSOC));
    }
}
?>
