<?php
header('Content-Type: application/json');
require_once("../models/payment.php");
$payment = new Payment();

if (isset($_POST['savepayment'])) {
    echo $payment->savePayment($_POST['bookingid'], $_POST['amount'], $_POST['date'], $_POST['method'], $_POST['status']);
}

if (isset($_POST['updatepayment'])) {
    echo $payment->updatePayment($_POST['paymentid'], $_POST['bookingid'], $_POST['amount'], $_POST['date'], $_POST['method'], $_POST['status']);
}

if (isset($_GET['getpayments'])) {
    echo $payment->getPayments();
}

if (isset($_GET['getpaymentdetails'])) {
    echo $payment->getPaymentDetails($_GET['paymentid']);
}

if (isset($_POST['deletepayment'])) {
    echo $payment->deletePayment($_POST['paymentid']);
}
?>
