<?php
require_once("db.php");

class Flight extends Db {

    public function saveFlight($flight_number, $airline_id, $plane_id, $origin_id, $destination_id, $departure, $arrival, $duration) {
        $sql = "CALL sp_Flight_Create(?, ?, ?, ?, ?, ?, ?, ?)";
        return $this->getJSON($sql, [$flight_number, $airline_id, $plane_id, $origin_id, $destination_id, $departure, $arrival, $duration]);
    }

    public function updateFlight($flight_id, $flight_number, $airline_id, $plane_id, $origin_id, $destination_id, $departure, $arrival, $duration) {
        $sql = "CALL sp_Flight_Update(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $this->execute($sql, [$flight_id, $flight_number, $airline_id, $plane_id, $origin_id, $destination_id, $departure, $arrival, $duration]);
        return json_encode(["status" => "success", "message" => "Flight updated successfully"]);
    }

    public function getFlights() {
        $sql = "CALL sp_Flight_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getFlightDetails($flight_id) {
        $sql = "CALL sp_Flight_SelectByID(?)";
        return $this->getJSON($sql, [$flight_id]);
    }

    public function deleteFlight($flight_id) {
        $sql = "CALL sp_Flight_Delete(?)";
        $this->execute($sql, [$flight_id]);
        return json_encode(["status" => "success", "message" => "Flight deleted successfully"]);
    }
}
?>
