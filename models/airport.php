<?php
require_once("db.php");

class Airport extends Db {

    function checkAirport($airportid, $airportname) {
        $sql = "CALL `sp_checkairport`({$airportid},'{$airportname}')";
        return $this->getData($sql)->rowCount();
    }

    function saveAirport($airportid, $airportname, $iata, $cityid) {
        if ($this->checkAirport($airportid, $airportname)) {
            return ["status" => "exists", "message" => "airport already exists"];
        } else {
            $sql = "CALL `sp_saveairport`({$airportid},'{$airportname}','{$iata}',{$cityid})";
            $this->getData($sql);
            return ["status" => "success", "message" => "airport saved successfully"];
        }
    }

    function getAirports() {
        $sql = "CALL `sp_getairports`()";
        return $this->getJSON($sql);
    }

    function getAirportDetails($airportid) {
        $sql = "CALL `sp_getairportdetails`({$airportid})";
        return $this->getJSON($sql);
    }

    function deleteAirport($airportid) {
        $sql = "CALL `sp_deleteairport`({$airportid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the airport was deleted successfully"];
    }
}
?>
