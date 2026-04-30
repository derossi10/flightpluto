<?php
header('Content-Type: application/json');
require_once("../models/airline.php");
$airline = new Airline();

if (isset($_POST['saveairline'])) {
    echo $airline->saveAirline($_POST['airlinename'], $_POST['iata'], $_POST['icao'], $_POST['countryid']);
}

if (isset($_POST['updateairline'])) {
    echo $airline->updateAirline($_POST['airlineid'], $_POST['airlinename'], $_POST['iata'], $_POST['icao'], $_POST['countryid']);
}

if (isset($_GET['getairlines'])) {
    echo $airline->getAirlines();
}

if (isset($_GET['getairlinedetails'])) {
    echo $airline->getAirlineDetails($_GET['airlineid']);
}

if (isset($_POST['deleteairline'])) {
    echo $airline->deleteAirline($_POST['airlineid']);
}
?>
