<?php
require_once("db.php");

class Airport extends Db {

    public function saveAirport($airport_name, $iata, $city_id) {
        $sql = "CALL sp_Airport_Create(?, ?, ?)";
        return $this->getJSON($sql, [$airport_name, $iata, $city_id]);
    }

    public function updateAirport($airport_id, $airport_name, $iata, $city_id) {
        $sql = "CALL sp_Airport_Update(?, ?, ?, ?)";
        $this->execute($sql, [$airport_id, $airport_name, $iata, $city_id]);
        return json_encode(["status" => "success", "message" => "Airport updated successfully"]);
    }

    public function getAirports() {
        $sql = "CALL sp_Airport_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getAirportDetails($airport_id) {
        $sql = "CALL sp_Airport_SelectByID(?)";
        return $this->getJSON($sql, [$airport_id]);
    }

    public function deleteAirport($airport_id) {
        $sql = "CALL sp_Airport_Delete(?)";
        $this->execute($sql, [$airport_id]);
        return json_encode(["status" => "success", "message" => "Airport deleted successfully"]);
    }
}
?>
