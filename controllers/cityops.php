<?php
require_once("../models/City.php");
$city = new City();

if (isset($_POST['savecity']))
    echo json_encode($city->saveCity($_POST['cityid'], $_POST['cityname'], $_POST['countryid']));

if (isset($_GET['getcities']))
    echo $city->getCities();

if (isset($_GET['getcitydetails']))
    echo $city->getCityDetails($_GET['cityid']);

if (isset($_POST['deletecity']))
    echo json_encode($city->deleteCity($_POST['cityid']));
?>
