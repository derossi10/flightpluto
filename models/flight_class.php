<?php
require_once("db.php");

class FlightClass extends Db {

    public function saveFlightClass($flight_class_name, $description) {
        $sql = "CALL sp_FlightClass_Create(?, ?)";
        return $this->getJSON($sql, [$flight_class_name, $description]);
    }

    public function updateFlightClass($flight_class_id, $flight_class_name, $description) {
        $sql = "CALL sp_FlightClass_Update(?, ?, ?)";
        $this->execute($sql, [$flight_class_id, $flight_class_name, $description]);
        return json_encode(["status" => "success", "message" => "FlightClass updated successfully"]);
    }

    public function getFlightClasses() {
        $sql = "CALL sp_FlightClass_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getFlightClassDetails($flight_class_id) {
        $sql = "CALL sp_FlightClass_SelectByID(?)";
        return $this->getJSON($sql, [$flight_class_id]);
    }

    public function deleteFlightClass($flight_class_id) {
        $sql = "CALL sp_FlightClass_Delete(?)";
        $this->execute($sql, [$flight_class_id]);
        return json_encode(["status" => "success", "message" => "FlightClass deleted successfully"]);
    }
}
?>
