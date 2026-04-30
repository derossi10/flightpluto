<?php
header('Content-Type: application/json');
require_once("../models/airport.php");
$airport = new Airport();

if (isset($_POST['saveairport'])) {
    echo $airport->saveAirport($_POST['airportname'], $_POST['iata'], $_POST['cityid']);
}

if (isset($_POST['updateairport'])) {
    echo $airport->updateAirport($_POST['airportid'], $_POST['airportname'], $_POST['iata'], $_POST['cityid']);
}

if (isset($_GET['getairports'])) {
    echo $airport->getAirports();
}

if (isset($_GET['getairportdetails'])) {
    echo $airport->getAirportDetails($_GET['airportid']);
}

if (isset($_POST['deleteairport'])) {
    echo $airport->deleteAirport($_POST['airportid']);
}
?>
