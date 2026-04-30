<?php
require_once("db.php");

class Passenger extends Db {

    public function savePassenger($first_name, $last_name, $dob, $passport, $email, $phone) {
        $sql = "CALL sp_Passenger_Create(?, ?, ?, ?, ?, ?)";
        return $this->getJSON($sql, [$first_name, $last_name, $dob, $passport, $email, $phone]);
    }

    public function updatePassenger($passenger_id, $first_name, $last_name, $dob, $passport, $email, $phone) {
        $sql = "CALL sp_Passenger_Update(?, ?, ?, ?, ?, ?, ?)";
        $this->execute($sql, [$passenger_id, $first_name, $last_name, $dob, $passport, $email, $phone]);
        return json_encode(["status" => "success", "message" => "Passenger updated successfully"]);
    }

    public function getPassengers() {
        $sql = "CALL sp_Passenger_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getPassengerDetails($passenger_id) {
        $sql = "CALL sp_Passenger_SelectByID(?)";
        return $this->getJSON($sql, [$passenger_id]);
    }

    public function deletePassenger($passenger_id) {
        $sql = "CALL sp_Passenger_Delete(?)";
        $this->execute($sql, [$passenger_id]);
        return json_encode(["status" => "success", "message" => "Passenger deleted successfully"]);
    }
}
?>

