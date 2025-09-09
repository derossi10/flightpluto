<?php
require_once("../models/Payment.php");
$payment = new Payment();

if (isset($_POST['savepayment']))
    echo json_encode($payment->savePayment($_POST['paymentid'], $_POST['bookingid'], $_POST['amount'], $_POST['date'], $_POST['method'], $_POST['status']));

if (isset($_GET['getpayments']))
    echo $payment->getPayments();

if (isset($_GET['getpaymentdetails']))
    echo $payment->getPaymentDetails($_GET['paymentid']);

if (isset($_POST['deletepayment']))
    echo json_encode($payment->deletePayment($_POST['paymentid']));
?>
