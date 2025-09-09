<?php
require_once("db.php");

class Payment extends Db {

    function checkPayment($paymentid, $bookingid) {
        $sql = "CALL `sp_checkpayment`({$paymentid},{$bookingid})";
        return $this->getData($sql)->rowCount();
    }

    function savePayment($paymentid, $bookingid, $amount, $date, $method, $status) {
        if ($this->checkPayment($paymentid, $bookingid)) {
            return ["status" => "exists", "message" => "payment already exists"];
        } else {
            $sql = "CALL `sp_savepayment`({$paymentid},{$bookingid},{$amount},'{$date}','{$method}','{$status}')";
            $this->getData($sql);
            return ["status" => "success", "message" => "payment saved successfully"];
        }
    }

    function getPayments() {
        $sql = "CALL `sp_getpayments`()";
        return $this->getJSON($sql);
    }

    function getPaymentDetails($paymentid) {
        $sql = "CALL `sp_getpaymentdetails`({$paymentid})";
        return $this->getJSON($sql);
    }

    function deletePayment($paymentid) {
        $sql = "CALL `sp_deletepayment`({$paymentid})";
        $this->getData($sql);
        return ["status" => "success", "message" => "the payment was deleted successfully"];
    }
}
?>
