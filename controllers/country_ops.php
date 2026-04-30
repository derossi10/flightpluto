<?php
header('Content-Type: application/json');
require_once("../models/country.php");
$country = new Country();

if (isset($_POST['savecountry'])) {
    echo $country->saveCountry($_POST['countryname'], $_POST['countrycode']);
}

if (isset($_POST['updatecountry'])) {
    echo $country->updateCountry($_POST['countryid'], $_POST['countryname'], $_POST['countrycode']);
}

if (isset($_GET['getcountries'])) {
    echo $country->getCountries();
}

if (isset($_GET['getcountrydetails'])) {
    echo $country->getCountryDetails($_GET['countryid']);
}

if (isset($_POST['deletecountry'])) {
    echo $country->deleteCountry($_POST['countryid']);
}
?>
