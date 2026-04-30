<?php
header('Content-Type: application/json');
require_once("../models/plane.php");
$plane = new Plane();

if (isset($_POST['saveplane'])) {
    echo $plane->savePlane($_POST['airlineid'], $_POST['planemodel'], $_POST['capacity']);
}

if (isset($_POST['updateplane'])) {
    echo $plane->updatePlane($_POST['planeid'], $_POST['airlineid'], $_POST['planemodel'], $_POST['capacity']);
}

if (isset($_GET['getplanes'])) {
    echo $plane->getPlanes();
}

if (isset($_GET['getplanedetails'])) {
    echo $plane->getPlaneDetails($_GET['planeid']);
}

if (isset($_POST['deleteplane'])) {
    echo $plane->deletePlane($_POST['planeid']);
}
?>
