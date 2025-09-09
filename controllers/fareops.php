<?php
require_once("../models/Fare.php");
$fare = new Fare();

if (isset($_POST['savefare']))
    echo json_encode($fare->saveFare($_POST['fareid'], $_POST['flightid'], $_POST['classid'], $_POST['price']));

if (isset($_GET['getfares']))
    echo $fare->getFares();

if (isset($_GET['getfaredetails']))
    echo $fare->getFareDetails($_GET['fareid']);

if (isset($_POST['deletefare']))
    echo json_encode($fare->deleteFare($_POST['fareid']));
?>
