<?php
require_once("db.php");

class Plane extends Db {

    function checkPlane($planeid, $planemodel) {
        $sql = "CALL `sp_checkplane`({$planeid},'{$planemodel}')";
        return $this->getData($sql)->rowCount();
    }

    function savePlane($planeid, $airlineid, $planemodel, $capacity) {
        if ($this->checkPlane($planeid, $planemodel)) {
            return ["status" => "exists", "message" => "plane already exists"];
        } else {
            $sql = "CALL `sp_saveplane`({$planeid},{$airlineid},'{$planemodel}',{$capacity})";
            $this->getData($sql);
            return ["status" => "success", "message" => "plane saved successfully"];
        }
    }

    function getPlanes() {
        $sql = "CALL `sp_getplanes`()";
        return $this->getJSON($sql);
    }

    function getPlaneDetails($planeid) {
        $sql = "CALL `sp_getplanedetails`({$planeid})";
        return $this->getJSON($sql);
    }

    function deletePlane($planeid) {
        $sql = "CALL `sp_deleteplane`({$planeid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the plane was deleted successfully"];
    }
}
?>
