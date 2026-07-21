<?php
require_once("db.php");

class Seat extends Db {

    public function saveSeat($flight_id, $flight_class_id, $seat_number, $availability_status) {
        $sql = "CALL sp_seat_create(?, ?, ?, ?)";
        return $this->getJSON($sql, [$flight_id, $flight_class_id, $seat_number, $availability_status]);
    }

    public function updateSeat($seat_id, $flight_id, $flight_class_id, $seat_number, $availability_status) {
        $sql = "CALL sp_seat_update(?, ?, ?, ?, ?)";
        $this->execute($sql, [$seat_id, $flight_id, $flight_class_id, $seat_number, $availability_status]);
        return json_encode(["status" => "success", "message" => "Seat updated successfully"]);
    }

    public function getSeats() {
        $sql = "CALL sp_seat_select_all()";
        return $this->getJSON($sql);
    }

    public function getSeatDetails($seat_id) {
        $sql = "CALL sp_seat_select_by_id(?)";
        return $this->getJSON($sql, [$seat_id]);
    }

    public function deleteSeat($seat_id) {
        $sql = "CALL sp_seat_delete(?)";
        $this->execute($sql, [$seat_id]);
        return json_encode(["status" => "success", "message" => "Seat deleted successfully"]);
    }
}
?>
