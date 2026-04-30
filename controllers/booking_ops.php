<?php
header('Content-Type: application/json');
require_once("../models/booking.php");
$booking = new Booking();

if (isset($_POST['savebooking'])) {
    echo $booking->saveBooking($_POST['passengerid'], $_POST['flightid'], $_POST['classid'], $_POST['date'], $_POST['price'], $_POST['status']);
}

if (isset($_POST['updatebooking'])) {
    echo $booking->updateBooking($_POST['bookingid'], $_POST['passengerid'], $_POST['flightid'], $_POST['classid'], $_POST['date'], $_POST['price'], $_POST['status']);
}

if (isset($_GET['getbookings'])) {
    echo $booking->getBookings();
}

if (isset($_GET['getbookingdetails'])) {
    echo $booking->getBookingDetails($_GET['bookingid']);
}

if (isset($_POST['deletebooking'])) {
    echo $booking->deleteBooking($_POST['bookingid']);
}
?>
