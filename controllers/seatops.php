<?php
require_once("../models/Seat.php");
$seat = new Seat();

if (isset($_POST['saveseat']))
    echo json_encode($seat->saveSeat($_POST['seatid'], $_POST['flightid'], $_POST['classid'], $_POST['seatnumber'], $_POST['status']));

if (isset($_GET['getseats']))
    echo $seat->getSeats();

if (isset($_GET['getseatdetails']))
    echo $seat->getSeatDetails($_GET['seatid']);

if (isset($_POST['deleteseat']))
    echo json_encode($seat->deleteSeat($_POST['seatid']));
?>
