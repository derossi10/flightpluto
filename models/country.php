<?php
require_once("db.php");

class Country extends Db {

    public function saveCountry($country_name, $country_code) {
        $sql = "CALL sp_country_create(?, ?)";
        return $this->getJSON($sql, [$country_name, $country_code]);
    }

    public function updateCountry($country_id, $country_name, $country_code) {
        $sql = "CALL sp_country_update(?, ?, ?)";
        $this->execute($sql, [$country_id, $country_name, $country_code]);
        return json_encode(["status" => "success", "message" => "Country updated successfully"]);
    }

    public function getCountries() {
        $sql = "CALL sp_country_select_all()";
        return $this->getJSON($sql);
    }

    public function getCountryDetails($country_id) {
        $sql = "CALL sp_country_select_by_id(?)";
        return $this->getJSON($sql, [$country_id]);
    }

    public function deleteCountry($country_id) {
        $sql = "CALL sp_country_delete(?)";
        $this->execute($sql, [$country_id]);
        return json_encode(["status" => "success", "message" => "Country deleted successfully"]);
    }
}
?>
