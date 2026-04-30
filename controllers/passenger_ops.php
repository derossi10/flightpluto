<?php
header('Content-Type: application/json');
require_once("../models/passenger.php");
$passenger = new Passenger();

if (isset($_POST['savepassenger'])) {
    echo $passenger->savePassenger($_POST['firstname'], $_POST['lastname'], $_POST['dob'], $_POST['passport'], $_POST['email'], $_POST['phone']);
}

if (isset($_POST['updatepassenger'])) {
    echo $passenger->updatePassenger($_POST['passengerid'], $_POST['firstname'], $_POST['lastname'], $_POST['dob'], $_POST['passport'], $_POST['email'], $_POST['phone']);
}

if (isset($_GET['getpassengers'])) {
    echo $passenger->getPassengers();
}

if (isset($_GET['getpassengerdetails'])) {
    echo $passenger->getPassengerDetails($_GET['passengerid']);
}

if (isset($_POST['deletepassenger'])) {
    echo $passenger->deletePassenger($_POST['passengerid']);
}
?>
