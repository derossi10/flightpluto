<?php
require_once("db.php");

class City extends Db {

    public function saveCity($city_name, $country_id) {
        $sql = "CALL sp_City_Create(?, ?)";
        return $this->getJSON($sql, [$city_name, $country_id]);
    }

    public function updateCity($city_id, $city_name, $country_id) {
        $sql = "CALL sp_City_Update(?, ?, ?)";
        $this->execute($sql, [$city_id, $city_name, $country_id]);
        return json_encode(["status" => "success", "message" => "City updated successfully"]);
    }

    public function getCities() {
        $sql = "CALL sp_City_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getCityDetails($city_id) {
        $sql = "CALL sp_City_SelectByID(?)";
        return $this->getJSON($sql, [$city_id]);
    }

    public function deleteCity($city_id) {
        $sql = "CALL sp_City_Delete(?)";
        $this->execute($sql, [$city_id]);
        return json_encode(["status" => "success", "message" => "City deleted successfully"]);
    }
}
?>
