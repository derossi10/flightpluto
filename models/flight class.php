<?php
require_once("db.php");

class FlightClass extends Db {

    function checkFlightClass($classid, $classname) {
        $sql = "CALL `sp_checkflightclass`({$classid},'{$classname}')";
        return $this->getData($sql)->rowCount();
    }

    function saveFlightClass($classid, $classname, $description) {
        if ($this->checkFlightClass($classid, $classname)) {
            return ["status" => "exists", "message" => "flight class already exists"];
        } else {
            $sql = "CALL `sp_saveflightclass`({$classid},'{$classname}','{$description}')";
            $this->getData($sql);
            return ["status" => "success", "message" => "flight class saved successfully"];
        }
    }

    function getFlightClasses() {
        $sql = "CALL `sp_getflightclasses`()";
        return $this->getJSON($sql);
    }

    function getFlightClassDetails($classid) {
        $sql = "CALL `sp_getflightclassdetails`({$classid})";
        return $this->getJSON($sql);
    }

    function deleteFlightClass($classid) {
        $sql = "CALL `sp_deleteflightclass`({$classid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the flight class was deleted successfully"];
    }
}
?>
