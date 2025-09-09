<?php
require_once("../models/country.php");
$country = new Country();

if (isset($_POST['savecountry']))
    echo json_encode($country->saveCountry($_POST['countryid'], $_POST['countryname']));

if (isset($_GET['getcountries']))
    echo $country->getCountries();

if (isset($_GET['getcountrydetails']))
    echo $country->getCountryDetails($_GET['countryid']);

if (isset($_POST['deletecountry']))
    echo json_encode($country->deleteCountry($_POST['countryid']));
?>
