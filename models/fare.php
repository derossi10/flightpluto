<?php
require_once("db.php");

class Fare extends Db {

    public function saveFare($flight_id, $flight_class_id, $unit_price) {
        $sql = "CALL sp_Fare_Create(?, ?, ?)";
        return $this->getJSON($sql, [$flight_id, $flight_class_id, $unit_price]);
    }

    public function updateFare($fare_id, $flight_id, $flight_class_id, $unit_price) {
        $sql = "CALL sp_Fare_Update(?, ?, ?, ?)";
        $this->execute($sql, [$fare_id, $flight_id, $flight_class_id, $unit_price]);
        return json_encode(["status" => "success", "message" => "Fare updated successfully"]);
    }

    public function getFares() {
        $sql = "CALL sp_Fare_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getFareDetails($fare_id) {
        $sql = "CALL sp_Fare_SelectByID(?)";
        return $this->getJSON($sql, [$fare_id]);
    }

    public function deleteFare($fare_id) {
        $sql = "CALL sp_Fare_Delete(?)";
        $this->execute($sql, [$fare_id]);
        return json_encode(["status" => "success", "message" => "Fare deleted successfully"]);
    }
}
?>
