<?php
header('Content-Type: application/json');
require_once("../models/flight.php");
$flight = new Flight();

if (isset($_POST['saveflight'])) {
    echo $flight->saveFlight($_POST['flightnumber'], $_POST['airlineid'], $_POST['planeid'], $_POST['origin'], $_POST['destination'], $_POST['departure'], $_POST['arrival'], $_POST['duration']);
}

if (isset($_POST['updateflight'])) {
    echo $flight->updateFlight($_POST['flightid'], $_POST['flightnumber'], $_POST['airlineid'], $_POST['planeid'], $_POST['origin'], $_POST['destination'], $_POST['departure'], $_POST['arrival'], $_POST['duration']);
}

if (isset($_GET['getflights'])) {
    echo $flight->getFlights();
}

if (isset($_GET['getflightdetails'])) {
    echo $flight->getFlightDetails($_GET['flightid']);
}

if (isset($_POST['deleteflight'])) {
    echo $flight->deleteFlight($_POST['flightid']);
}
?>
