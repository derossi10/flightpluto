<?php
require_once("../models/Booking.php");
$booking = new Booking();

if (isset($_POST['savebooking']))
    echo json_encode($booking->saveBooking($_POST['bookingid'], $_POST['passengerid'], $_POST['flightid'], $_POST['classid'], $_POST['date'], $_POST['price'], $_POST['status']));

if (isset($_GET['getbookings']))
    echo $booking->getBookings();

if (isset($_GET['getbookingdetails']))
    echo $booking->getBookingDetails($_GET['bookingid']);

if (isset($_POST['deletebooking']))
    echo json_encode($booking->deleteBooking($_POST['bookingid']));
?>
