<?php
require_once("db.php");

class Country extends Db {

    public function saveCountry($country_name, $country_code) {
        $sql = "CALL sp_Country_Create(?, ?)";
        return $this->getJSON($sql, [$country_name, $country_code]);
    }

    public function updateCountry($country_id, $country_name, $country_code) {
        $sql = "CALL sp_Country_Update(?, ?, ?)";
        $this->execute($sql, [$country_id, $country_name, $country_code]);
        return json_encode(["status" => "success", "message" => "Country updated successfully"]);
    }

    public function getCountries() {
        $sql = "CALL sp_Country_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getCountryDetails($country_id) {
        $sql = "CALL sp_Country_SelectByID(?)";
        return $this->getJSON($sql, [$country_id]);
    }

    public function deleteCountry($country_id) {
        $sql = "CALL sp_Country_Delete(?)";
        $this->execute($sql, [$country_id]);
        return json_encode(["status" => "success", "message" => "Country deleted successfully"]);
    }
}
?>
