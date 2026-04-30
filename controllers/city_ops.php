<?php
header('Content-Type: application/json');
require_once("../models/city.php");
$city = new City();

if (isset($_POST['savecity'])) {
    echo $city->saveCity($_POST['cityname'], $_POST['countryid']);
}

if (isset($_POST['updatecity'])) {
    echo $city->updateCity($_POST['cityid'], $_POST['cityname'], $_POST['countryid']);
}

if (isset($_GET['getcities'])) {
    echo $city->getCities();
}

if (isset($_GET['getcitydetails'])) {
    echo $city->getCityDetails($_GET['cityid']);
}

if (isset($_POST['deletecity'])) {
    echo $city->deleteCity($_POST['cityid']);
}
?>
