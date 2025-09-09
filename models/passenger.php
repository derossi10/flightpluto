<?php
require_once("db.php");

class Passenger extends Db {

    function checkPassenger($passengerid, $passport) {
        $sql = "CALL `sp_checkpassenger`({$passengerid},'{$passport}')";
        return $this->getData($sql)->rowCount();
    }

    function savePassenger($passengerid, $firstname, $lastname, $dob, $passport, $email, $phone) {
        if ($this->checkPassenger($passengerid, $passport)) {
            return ["status" => "exists", "message" => "passenger already exists"];
        } else {
            $sql = "CALL `sp_savepassenger`({$passengerid},'{$firstname}','{$lastname}','{$dob}','{$passport}','{$email}','{$phone}')";
            $this->getData($sql);
            return ["status" => "success", "message" => "passenger saved successfully"];
        }
    }

    function getPassengers() {
        $sql = "CALL `sp_getpassengers`()";
        return $this->getJSON($sql);
    }

    function getPassengerDetails($passengerid) {
        $sql = "CALL `sp_getpassengerdetails`({$passengerid})";
        return $this->getJSON($sql);
    }

    function deletePassenger($passengerid) {
        $sql = "CALL `sp_deletepassenger`({$passengerid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the passenger was deleted successfully"];
    }
}
?>
