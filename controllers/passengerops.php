<?php
require_once("../models/Passenger.php");
$passenger = new Passenger();

if (isset($_POST['savepassenger']))
    echo json_encode($passenger->savePassenger($_POST['passengerid'], $_POST['firstname'], $_POST['lastname'], $_POST['dob'], $_POST['passport'], $_POST['email'], $_POST['phone']));

if (isset($_GET['getpassengers']))
    echo $passenger->getPassengers();

if (isset($_GET['getpassengerdetails']))
    echo $passenger->getPassengerDetails($_GET['passengerid']);

if (isset($_POST['deletepassenger']))
    echo json_encode($passenger->deletePassenger($_POST['passengerid']));
?>
