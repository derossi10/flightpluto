<?php
require_once("db.php");

class City extends Db {

    function checkCity($cityid, $cityname) {
        $sql = "CALL `sp_checkcity`({$cityid},'{$cityname}')";
        return $this->getData($sql)->rowCount();
    }

    function saveCity($cityid, $cityname, $countryid) {
        if ($this->checkCity($cityid, $cityname)) {
            return ["status" => "exists", "message" => "city name already exists"];
        } else {
            $sql = "CALL `sp_savecity`({$cityid},'{$cityname}',{$countryid})";
            $this->getData($sql);
            return ["status" => "success", "message" => "city saved successfully"];
        }
    }

    function getCities() {
        $sql = "CALL `sp_getcities`()";
        return $this->getJSON($sql);
    }

    function getCityDetails($cityid) {
        $sql = "CALL `sp_getcitydetails`({$cityid})";
        return $this->getJSON($sql);
    }

    function deleteCity($cityid) {
        $sql = "CALL `sp_deletecity`({$cityid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the city was deleted successfully"];
    }
}
?>
