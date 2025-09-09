<?php
require_once("db.php");

class Seat extends Db {

    function checkSeat($seatid, $seatnumber) {
        $sql = "CALL `sp_checkseat`({$seatid},'{$seatnumber}')";
        return $this->getData($sql)->rowCount();
    }

    function saveSeat($seatid, $flightid, $classid, $seatnumber, $status) {
        if ($this->checkSeat($seatid, $seatnumber)) {
            return ["status" => "exists", "message" => "seat already exists"];
        } else {
            $sql = "CALL `sp_saveseat`({$seatid},{$flightid},{$classid},'{$seatnumber}','{$status}')";
            $this->getData($sql);
            return ["status" => "success", "message" => "seat saved successfully"];
        }
    }

    function getSeats() {
        $sql = "CALL `sp_getseats`()";
        return $this->getJSON($sql);
    }

    function getSeatDetails($seatid) {
        $sql = "CALL `sp_getseatdetails`({$seatid})";
        return $this->getJSON($sql);
    }

    function deleteSeat($seatid) {
        $sql = "CALL `sp_deleteseat`({$seatid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the seat was deleted successfully"];
    }
}
?>
