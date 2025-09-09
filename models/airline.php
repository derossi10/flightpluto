<?php
require_once("db.php");

class Airline extends Db {

    function checkAirline($airlineid, $airlinename) {
        $sql = "CALL `sp_checkairline`({$airlineid},'{$airlinename}')";
        return $this->getData($sql)->rowCount();
    }

    function saveAirline($airlineid, $airlinename, $iata, $icao, $countryid) {
        if ($this->checkAirline($airlineid, $airlinename)) {
            return ["status" => "exists", "message" => "airline already exists"];
        } else {
            $sql = "CALL `sp_saveairline`({$airlineid},'{$airlinename}','{$iata}','{$icao}',{$countryid})";
            $this->getData($sql);
            return ["status" => "success", "message" => "airline saved successfully"];
        }
    }

    function getAirlines() {
        $sql = "CALL `sp_getairlines`()";
        return $this->getJSON($sql);
    }

    function getAirlineDetails($airlineid) {
        $sql = "CALL `sp_getairlinedetails`({$airlineid})";
        return $this->getJSON($sql);
    }

    function deleteAirline($airlineid) {
        $sql = "CALL `sp_deleteairline`({$airlineid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the airline was deleted successfully"];
    }
}
?>
