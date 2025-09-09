<?php
require_once("../models/Airport.php");
$airport = new Airport();

if (isset($_POST['saveairport']))
    echo json_encode($airport->saveAirport($_POST['airportid'], $_POST['airportname'], $_POST['iata'], $_POST['cityid']));

if (isset($_GET['getairports']))
    echo $airport->getAirports();

if (isset($_GET['getairportdetails']))
    echo $airport->getAirportDetails($_GET['airportid']);

if (isset($_POST['deleteairport']))
    echo json_encode($airport->deleteAirport($_POST['airportid']));
?>
