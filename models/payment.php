<?php
require_once("db.php");

class Payment extends Db {

    public function savePayment($booking_id, $amount_paid, $payment_date, $payment_method, $payment_status) {
        $sql = "CALL sp_Payment_Create(?, ?, ?, ?, ?)";
        return $this->getJSON($sql, [$booking_id, $amount_paid, $payment_date, $payment_method, $payment_status]);
    }

    public function updatePayment($payment_id, $booking_id, $amount_paid, $payment_date, $payment_method, $payment_status) {
        $sql = "CALL sp_Payment_Update(?, ?, ?, ?, ?, ?)";
        $this->execute($sql, [$payment_id, $booking_id, $amount_paid, $payment_date, $payment_method, $payment_status]);
        return json_encode(["status" => "success", "message" => "Payment updated successfully"]);
    }

    public function getPayments() {
        $sql = "CALL sp_Payment_SelectAll()";
        return $this->getJSON($sql);
    }

    public function getPaymentDetails($payment_id) {
        $sql = "CALL sp_Payment_SelectByID(?)";
        return $this->getJSON($sql, [$payment_id]);
    }

    public function deletePayment($payment_id) {
        $sql = "CALL sp_Payment_Delete(?)";
        $this->execute($sql, [$payment_id]);
        return json_encode(["status" => "success", "message" => "Payment deleted successfully"]);
    }
}
?>
