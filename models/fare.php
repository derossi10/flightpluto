<?php
require_once("db.php");

class Fare extends Db {

    public function saveFare($flight_id, $flight_class_id, $unit_price) {
        $sql = "CALL sp_fare_create(?, ?, ?)";
        return $this->getJSON($sql, [$flight_id, $flight_class_id, $unit_price]);
    }

    public function updateFare($fare_id, $flight_id, $flight_class_id, $unit_price) {
        $sql = "CALL sp_fare_update(?, ?, ?, ?)";
        $this->execute($sql, [$fare_id, $flight_id, $flight_class_id, $unit_price]);
        return json_encode(["status" => "success", "message" => "Fare updated successfully"]);
    }

    public function getFares() {
        $sql = "CALL sp_fare_select_all()";
        return $this->getJSON($sql);
    }

    public function getFareDetails($fare_id) {
        $sql = "CALL sp_fare_select_by_id(?)";
        return $this->getJSON($sql, [$fare_id]);
    }

    public function deleteFare($fare_id) {
        $sql = "CALL sp_fare_delete(?)";
        $this->execute($sql, [$fare_id]);
        return json_encode(["status" => "success", "message" => "Fare deleted successfully"]);
    }
}
?>
