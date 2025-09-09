<?php
require_once("../models/Airline.php");
$airline = new Airline();

if (isset($_POST['saveairline']))
    echo json_encode($airline->saveAirline($_POST['airlineid'], $_POST['airlinename'], $_POST['iata'], $_POST['icao'], $_POST['countryid']));

if (isset($_GET['getairlines']))
    echo $airline->getAirlines();

if (isset($_GET['getairlinedetails']))
    echo $airline->getAirlineDetails($_GET['airlineid']);

if (isset($_POST['deleteairline']))
    echo json_encode($airline->deleteAirline($_POST['airlineid']));
?>
