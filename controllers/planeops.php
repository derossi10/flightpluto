<?php
require_once("../models/Plane.php");
$plane = new Plane();

if (isset($_POST['saveplane']))
    echo json_encode($plane->savePlane($_POST['planeid'], $_POST['airlineid'], $_POST['planemodel'], $_POST['capacity']));

if (isset($_GET['getplanes']))
    echo $plane->getPlanes();

if (isset($_GET['getplanedetails']))
    echo $plane->getPlaneDetails($_GET['planeid']);

if (isset($_POST['deleteplane']))
    echo json_encode($plane->deletePlane($_POST['planeid']));
?>
