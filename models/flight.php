<?php
require_once("db.php");

class Flight extends Db {

    function checkFlight($flightid, $flightnumber) {
        $sql = "CALL `sp_checkflight`({$flightid},'{$flightnumber}')";
        return $this->getData($sql)->rowCount();
    }

    function saveFlight($flightid, $flightnumber, $airlineid, $planeid, $origin, $destination, $departure, $arrival, $duration) {
        if ($this->checkFlight($flightid, $flightnumber)) {
            return ["status" => "exists", "message" => "flight already exists"];
        } else {
            $sql = "CALL `sp_saveflight`({$flightid},'{$flightnumber}',{$airlineid},{$planeid},{$origin},{$destination},'{$departure}','{$arrival}',{$duration})";
            $this->getData($sql);
            return ["status" => "success", "message" => "flight saved successfully"];
        }
    }

    function getFlights() {
        $sql = "CALL `sp_getflights`()";
        return $this->getJSON($sql);
    }

    function getFlightDetails($flightid) {
        $sql = "CALL `sp_getflightdetails`({$flightid})";
        return $this->getJSON($sql);
    }

    function deleteFlight($flightid) {
        $sql = "CALL `sp_deleteflight`({$flightid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the flight was deleted successfully"];
    }
}
?>
