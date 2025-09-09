<?php
require_once("../models/FlightClass.php");
$fc = new FlightClass();

if (isset($_POST['saveflightclass']))
    echo json_encode($fc->saveFlightClass($_POST['classid'], $_POST['classname'], $_POST['description']));

if (isset($_GET['getflightclasses']))
    echo $fc->getFlightClasses();

if (isset($_GET['getflightclassdetails']))
    echo $fc->getFlightClassDetails($_GET['classid']);

if (isset($_POST['deleteflightclass']))
    echo json_encode($fc->deleteFlightClass($_POST['classid']));
?>
