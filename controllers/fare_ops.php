<?php
header('Content-Type: application/json');
require_once("../models/fare.php");
$fare = new Fare();

if (isset($_POST['savefare'])) {
    echo $fare->saveFare($_POST['flightid'], $_POST['classid'], $_POST['price']);
}

if (isset($_POST['updatefare'])) {
    echo $fare->updateFare($_POST['fareid'], $_POST['flightid'], $_POST['classid'], $_POST['price']);
}

if (isset($_GET['getfares'])) {
    echo $fare->getFares();
}

if (isset($_GET['getfaredetails'])) {
    echo $fare->getFareDetails($_GET['fareid']);
}

if (isset($_POST['deletefare'])) {
    echo $fare->deleteFare($_POST['fareid']);
}
?>
