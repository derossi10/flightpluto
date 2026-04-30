<?php
header('Content-Type: application/json');
require_once("../models/flight_class.php");
$flight_class = new FlightClass();

if (isset($_POST['saveflightclass'])) {
    echo $flight_class->saveFlightClass($_POST['classname'], $_POST['description']);
}

if (isset($_POST['updateflightclass'])) {
    echo $flight_class->updateFlightClass($_POST['classid'], $_POST['classname'], $_POST['description']);
}

if (isset($_GET['getflightclasses'])) {
    echo $flight_class->getFlightClasses();
}

if (isset($_GET['getflightclassdetails'])) {
    echo $flight_class->getFlightClassDetails($_GET['classid']);
}

if (isset($_POST['deleteflightclass'])) {
    echo $flight_class->deleteFlightClass($_POST['classid']);
}
?>
