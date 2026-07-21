<?php
require_once("db.php");

class Plane extends Db {

    public function savePlane($airline_id, $plane_model, $plane_capacity) {
        $sql = "CALL sp_plane_create(?, ?, ?)";
        return $this->getJSON($sql, [$airline_id, $plane_model, $plane_capacity]);
    }

    public function updatePlane($plane_id, $airline_id, $plane_model, $plane_capacity) {
        $sql = "CALL sp_plane_update(?, ?, ?, ?)";
        $this->execute($sql, [$plane_id, $airline_id, $plane_model, $plane_capacity]);
        return json_encode(["status" => "success", "message" => "Plane updated successfully"]);
    }

    public function getPlanes() {
        $sql = "CALL sp_plane_select_all()";
        return $this->getJSON($sql);
    }

    public function getPlaneDetails($plane_id) {
        $sql = "CALL sp_plane_select_by_id(?)";
        return $this->getJSON($sql, [$plane_id]);
    }

    public function deletePlane($plane_id) {
        $sql = "CALL sp_plane_delete(?)";
        $this->execute($sql, [$plane_id]);
        return json_encode(["status" => "success", "message" => "Plane deleted successfully"]);
    }
}
?>
