<?php
require_once("db.php");

class Booking extends Db {

    function checkBooking($bookingid, $passengerid, $flightid) {
        $sql = "CALL `sp_checkbooking`({$bookingid},{$passengerid},{$flightid})";
        return $this->getData($sql)->rowCount();
    }

    function saveBooking($bookingid, $passengerid, $flightid, $classid, $date, $price, $status) {
        if ($this->checkBooking($bookingid, $passengerid, $flightid)) {
            return ["status" => "exists", "message" => "booking already exists"];
        } else {
            $sql = "CALL `sp_savebooking`({$bookingid},{$passengerid},{$flightid},{$classid},'{$date}',{$price},'{$status}')";
            $this->getData($sql);
            return ["status" => "success", "message" => "booking saved successfully"];
        }
    }

    function getBookings() {
        $sql = "CALL `sp_getbookings`()";
        return $this->getJSON($sql);
    }

    function getBookingDetails($bookingid) {
        $sql = "CALL `sp_getbookingdetails`({$bookingid})";
        return $this->getJSON($sql);
    }

    function deleteBooking($bookingid) {
        $sql = "CALL `sp_deletebooking`({$bookingid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the booking was deleted successfully"];
    }
}
?>
