<?php
require_once("db.php");

class Airline extends Db {

    public function saveAirline($airline_name, $iata, $icao, $country_id) {
        $sql = "CALL sp_Airline_Create(?, ?, ?, ?)";
        return $this->getJSON($sql, [$airline_name, $iata, $icao, $country_id]);
    }

    public function updateAirline($airline_id, $airline_name, $iata, $icao, $country_id) {
        $sql = "CALL sp_Airline_Update(?, ?, ?, ?, ?)";
        $this->execute($sql, [$airline_id, $airline_name, $iata, $icao, $country_id]);
        return json_encode(["status" => "success", "message" => "Airline updated successfully"]);
    }

    public function getAirlines() {
        $sql = "CALL sp_Airline_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getAirlineDetails($airline_id) {
        $sql = "CALL sp_Airline_SelectByID(?)";
        return $this->getJSON($sql, [$airline_id]);
    }

    public function deleteAirline($airline_id) {
        $sql = "CALL sp_Airline_Delete(?)";
        $this->execute($sql, [$airline_id]);
        return json_encode(["status" => "success", "message" => "Airline deleted successfully"]);
    }
}
?>
