<?php
require_once("db.php");

class Fare extends Db {

    function checkFare($fareid, $flightid, $classid) {
        $sql = "CALL `sp_checkfare`({$fareid},{$flightid},{$classid})";
        return $this->getData($sql)->rowCount();
    }

    function saveFare($fareid, $flightid, $classid, $price) {
        if ($this->checkFare($fareid, $flightid, $classid)) {
            return ["status" => "exists", "message" => "fare already exists"];
        } else {
            $sql = "CALL `sp_savefare`({$fareid},{$flightid},{$classid},{$price})";
            $this->getData($sql);
            return ["status" => "success", "message" => "fare saved successfully"];
        }
    }

    function getFares() {
        $sql = "CALL `sp_getfares`()";
        return $this->getJSON($sql);
    }

    function getFareDetails($fareid) {
        $sql = "CALL `sp_getfaredetails`({$fareid})";
        return $this->getJSON($sql);
    }

    function deleteFare($fareid) {
        $sql = "CALL `sp_deletefare`({$fareid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the fare was deleted successfully"];
    }
}
?>
