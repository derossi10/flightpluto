<?php
require_once("db.php");

class Country extends Db {

    function checkCountry($countryid, $countryname) {
        $sql = "CALL `sp_checkcountry`({$countryid},'{$countryname}')";
        return $this->getData($sql)->rowCount();
    }

    function saveCountry($countryid, $countryname) {
        if ($this->checkCountry($countryid, $countryname)) {
            return ["status" => "exists", "message" => "country name already exists"];
        } else {
            $sql = "CALL `sp_savecountry`({$countryid},'{$countryname}')";
            $this->getData($sql);
            return ["status" => "success", "message" => "country saved successfully"];
        }
    }

    function getCountries() {
        $sql = "CALL `sp_getcountries`()";
        return $this->getJSON($sql);
    }

    function getCountryDetails($countryid) {
        $sql = "CALL `sp_getcountrydetails`({$countryid})";
        return $this->getJSON($sql);
    }

    function deleteCountry($countryid) {
        $sql = "CALL `sp_deletecountry`({$countryid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the country was deleted successfully"];
    }
}
?>
