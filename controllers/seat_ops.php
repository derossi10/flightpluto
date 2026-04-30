<?php
header('Content-Type: application/json');
require_once("../models/seat.php");
$seat = new Seat();

if (isset($_POST['saveseat'])) {
    echo $seat->saveSeat($_POST['flightid'], $_POST['classid'], $_POST['seatnumber'], $_POST['status']);
}

if (isset($_POST['updateseat'])) {
    echo $seat->updateSeat($_POST['seatid'], $_POST['flightid'], $_POST['classid'], $_POST['seatnumber'], $_POST['status']);
}

if (isset($_GET['getseats'])) {
    echo $seat->getSeats();
}

if (isset($_GET['getseatdetails'])) {
    echo $seat->getSeatDetails($_GET['seatid']);
}

if (isset($_POST['deleteseat'])) {
    echo $seat->deleteSeat($_POST['seatid']);
}
?>
