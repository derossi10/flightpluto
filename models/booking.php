<?php
require_once("db.php");

class Booking extends Db {

    public function saveBooking($passenger_id, $flight_id, $flight_class_id, $booking_date, $total_price, $status) {
        $sql = "CALL sp_booking_create(?, ?, ?, ?, ?, ?)";
        return $this->getJSON($sql, [$passenger_id, $flight_id, $flight_class_id, $booking_date, $total_price, $status]);
    }

    public function updateBooking($booking_id, $passenger_id, $flight_id, $flight_class_id, $booking_date, $total_price, $status) {
        $sql = "CALL sp_booking_update(?, ?, ?, ?, ?, ?, ?)";
        $this->execute($sql, [$booking_id, $passenger_id, $flight_id, $flight_class_id, $booking_date, $total_price, $status]);
        return json_encode(["status" => "success", "message" => "Booking updated successfully"]);
    }

    public function getBookings() {
        $sql = "CALL sp_booking_select_all()";
        return $this->getJSON($sql);
    }

    public function getBookingDetails($booking_id) {
        $sql = "CALL sp_booking_select_by_id(?)";
        return $this->getJSON($sql, [$booking_id]);
    }

    public function deleteBooking($booking_id) {
        $sql = "CALL sp_booking_delete(?)";
        $this->execute($sql, [$booking_id]);
        return json_encode(["status" => "success", "message" => "Booking deleted successfully"]);
    }
}
?>
