-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2025 at 12:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone="+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flightpluto`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airline_create`(IN `p_airline_name` VARCHAR(100),IN `p_iata_code` VARCHAR(10),IN `p_icao_code` VARCHAR(10),IN `p_country_id` INT) BEGIN
IF EXISTS(SELECT 1 FROM airline WHERE airline_name=p_airline_name OR iata_code=p_iata_code OR icao_code=p_icao_code) THEN
SELECT 'Airline already exists' AS message;
ELSE
INSERT INTO airline(airline_name,iata_code,icao_code,country_id) VALUES(p_airline_name,p_iata_code,p_icao_code,p_country_id);
SELECT 'Airline inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airline_delete`(IN `p_airline_id` INT) BEGIN
DELETE FROM airline WHERE airline_id=p_airline_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airline_select_all`() BEGIN
SELECT a.*, c.country_name FROM airline a LEFT JOIN country c ON a.country_id = c.country_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airline_select_by_id`(IN `p_airline_id` INT) BEGIN
SELECT * FROM airline WHERE airline_id=p_airline_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airline_update`(IN `p_airline_id` INT,IN `p_airline_name` VARCHAR(100),IN `p_iata_code` VARCHAR(10),IN `p_icao_code` VARCHAR(10),IN `p_country_id` INT) BEGIN
UPDATE airline SET airline_name=p_airline_name,iata_code=p_iata_code,icao_code=p_icao_code,country_id=p_country_id WHERE airline_id=p_airline_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airport_create`(IN `p_airport_name` VARCHAR(150),IN `p_iata_code` VARCHAR(10),IN `p_city_id` INT) BEGIN
IF EXISTS(SELECT 1 FROM airport WHERE airport_name=p_airport_name OR iata_code=p_iata_code) THEN
SELECT 'Airport already exists' AS message;
ELSE
INSERT INTO airport(airport_name,iata_code,city_id) VALUES(p_airport_name,p_iata_code,p_city_id);
SELECT 'Airport inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airport_delete`(IN `p_airport_id` INT) BEGIN
DELETE FROM airport WHERE airport_id=p_airport_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airport_select_all`() BEGIN
SELECT a.*, ci.city_name, co.country_name FROM airport a LEFT JOIN city ci ON a.city_id = ci.city_id LEFT JOIN country co ON ci.country_id = co.country_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airport_select_by_id`(IN `p_airport_id` INT) BEGIN
SELECT * FROM airport WHERE airport_id=p_airport_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_airport_update`(IN `p_airport_id` INT,IN `p_airport_name` VARCHAR(150),IN `p_iata_code` VARCHAR(10),IN `p_city_id` INT) BEGIN
UPDATE airport SET airport_name=p_airport_name,iata_code=p_iata_code,city_id=p_city_id WHERE airport_id=p_airport_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_booking_create`(IN `p_passenger_id` INT,IN `p_flight_id` INT,IN `p_flight_class_id` INT,IN `p_booking_date` DATETIME,IN `p_total_price` DECIMAL(10,2),IN `p_status` VARCHAR(50)) BEGIN
IF EXISTS(SELECT 1 FROM booking WHERE passenger_id=p_passenger_id AND flight_id=p_flight_id AND booking_date=p_booking_date) THEN
SELECT 'Booking already exists' AS message;
ELSE
INSERT INTO booking(passenger_id,flight_id,flight_class_id,booking_date,total_price,status) VALUES(p_passenger_id,p_flight_id,p_flight_class_id,p_booking_date,p_total_price,p_status);
SELECT 'Booking inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_booking_delete`(IN `p_booking_id` INT) BEGIN
DELETE FROM booking WHERE booking_id=p_booking_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_booking_select_all`() BEGIN
SELECT b.*, CONCAT(p.first_name, ' ', p.last_name) as passenger_name, f.flight_number, fc.flight_class_name FROM booking b LEFT JOIN passenger p ON b.passenger_id = p.passenger_id LEFT JOIN flight f ON b.flight_id = f.flight_id LEFT JOIN flight_class fc ON b.flight_class_id = fc.flight_class_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_booking_select_by_id`(IN `p_booking_id` INT) BEGIN
SELECT * FROM booking WHERE booking_id=p_booking_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_booking_update`(IN `p_booking_id` INT,IN `p_passenger_id` INT,IN `p_flight_id` INT,IN `p_flight_class_id` INT,IN `p_booking_date` DATETIME,IN `p_total_price` DECIMAL(10,2),IN `p_status` VARCHAR(50)) BEGIN
UPDATE booking SET passenger_id=p_passenger_id,flight_id=p_flight_id,flight_class_id=p_flight_class_id,booking_date=p_booking_date,total_price=p_total_price,status=p_status WHERE booking_id=p_booking_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_city_create`(IN `p_city_name` VARCHAR(100),IN `p_country_id` INT) BEGIN
IF EXISTS(SELECT 1 FROM city WHERE city_name=p_city_name AND country_id=p_country_id) THEN
SELECT 'City already exists' AS message;
ELSE
INSERT INTO city(city_name,country_id) VALUES(p_city_name,p_country_id);
SELECT 'City inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_city_delete`(IN `p_city_id` INT) BEGIN
DELETE FROM city WHERE city_id=p_city_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_city_select_all`() BEGIN
SELECT c.*, co.country_name FROM city c LEFT JOIN country co ON c.country_id = co.country_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_city_select_by_id`(IN `p_city_id` INT) BEGIN
SELECT * FROM city WHERE city_id=p_city_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_city_update`(IN `p_city_id` INT,IN `p_city_name` VARCHAR(100),IN `p_country_id` INT) BEGIN
UPDATE city SET city_name=p_city_name,country_id=p_country_id WHERE city_id=p_city_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_country_create`(IN `p_country_name` VARCHAR(100),IN `p_country_code` VARCHAR(10)) BEGIN
IF EXISTS(SELECT 1 FROM country WHERE country_name=p_country_name OR country_code=p_country_code) THEN
SELECT 'Country already exists' AS message;
ELSE
INSERT INTO country(country_name,country_code) VALUES(p_country_name,p_country_code);
SELECT 'Country inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_country_delete`(IN `p_country_id` INT) BEGIN
DELETE FROM country WHERE country_id=p_country_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_country_select_all`() BEGIN
SELECT * FROM country;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_country_select_by_id`(IN `p_country_id` INT) BEGIN
SELECT * FROM country WHERE country_id=p_country_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_country_update`(IN `p_country_id` INT,IN `p_country_name` VARCHAR(100),IN `p_country_code` VARCHAR(10)) BEGIN
UPDATE country SET country_name=p_country_name,country_code=p_country_code WHERE country_id=p_country_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_fare_create`(IN `p_flight_id` INT,IN `p_flight_class_id` INT,IN `p_unit_price` DECIMAL(10,2)) BEGIN
IF EXISTS(SELECT 1 FROM fare WHERE flight_id=p_flight_id AND flight_class_id=p_flight_class_id) THEN
SELECT 'Fare already exists' AS message;
ELSE
INSERT INTO fare(flight_id,flight_class_id,unit_price) VALUES(p_flight_id,p_flight_class_id,p_unit_price);
SELECT 'Fare inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_fare_delete`(IN `p_fare_id` INT) BEGIN
DELETE FROM fare WHERE fare_id=p_fare_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_fare_select_all`() BEGIN
SELECT f.*, fl.flight_number, fc.flight_class_name FROM fare f LEFT JOIN flight fl ON f.flight_id = fl.flight_id LEFT JOIN flight_class fc ON f.flight_class_id = fc.flight_class_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_fare_select_by_id`(IN `p_fare_id` INT) BEGIN
SELECT * FROM fare WHERE fare_id=p_fare_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_fare_update`(IN `p_fare_id` INT,IN `p_flight_id` INT,IN `p_flight_class_id` INT,IN `p_unit_price` DECIMAL(10,2)) BEGIN
UPDATE fare SET flight_id=p_flight_id,flight_class_id=p_flight_class_id,unit_price=p_unit_price WHERE fare_id=p_fare_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_class_create`(IN `p_flight_class_name` VARCHAR(50),IN `p_description` VARCHAR(200)) BEGIN
IF EXISTS(SELECT 1 FROM flight_class WHERE flight_class_name=p_flight_class_name) THEN
SELECT 'FlightClass already exists' AS message;
ELSE
INSERT INTO flight_class(flight_class_name,description) VALUES(p_flight_class_name,p_description);
SELECT 'FlightClass inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_class_delete`(IN `p_flight_class_id` INT) BEGIN
DELETE FROM flight_class WHERE flight_class_id=p_flight_class_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_class_select_all`() BEGIN
SELECT * FROM flight_class;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_class_select_by_id`(IN `p_flight_class_id` INT) BEGIN
SELECT * FROM flight_class WHERE flight_class_id=p_flight_class_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_class_update`(IN `p_flight_class_id` INT,IN `p_flight_class_name` VARCHAR(50),IN `p_description` VARCHAR(200)) BEGIN
UPDATE flight_class SET flight_class_name=p_flight_class_name,description=p_description WHERE flight_class_id=p_flight_class_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_create`(IN `p_flight_number` VARCHAR(10),IN `p_airline_id` INT,IN `p_plane_id` INT,IN `p_origin_airport_id` INT,IN `p_destination_airport_id` INT,IN `p_departure_time` DATETIME,IN `p_arrival_time` DATETIME,IN `p_duration_minutes` INT) BEGIN
IF EXISTS(SELECT 1 FROM flight WHERE flight_number=p_flight_number) THEN
SELECT 'Flight already exists' AS message;
ELSE
INSERT INTO flight(flight_number,airline_id,plane_id,origin_airport_id,destination_airport_id,departure_time,arrival_time,duration_minutes) VALUES(p_flight_number,p_airline_id,p_plane_id,p_origin_airport_id,p_destination_airport_id,p_departure_time,p_arrival_time,p_duration_minutes);
SELECT 'Flight inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_delete`(IN `p_flight_id` INT) BEGIN
DELETE FROM flight WHERE flight_id=p_flight_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_select_all`() BEGIN
SELECT f.*, al.airline_name, ao.iata_code as origin_iata, ad.iata_code as destination_iata, p.plane_model FROM flight f LEFT JOIN airline al ON f.airline_id = al.airline_id LEFT JOIN airport ao ON f.origin_airport_id = ao.airport_id LEFT JOIN airport ad ON f.destination_airport_id = ad.airport_id LEFT JOIN plane p ON f.plane_id = p.plane_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_select_by_id`(IN `p_flight_id` INT) BEGIN
SELECT * FROM flight WHERE flight_id=p_flight_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_flight_update`(IN `p_flight_id` INT,IN `p_flight_number` VARCHAR(10),IN `p_airline_id` INT,IN `p_plane_id` INT,IN `p_origin_airport_id` INT,IN `p_destination_airport_id` INT,IN `p_departure_time` DATETIME,IN `p_arrival_time` DATETIME,IN `p_duration_minutes` INT) BEGIN
UPDATE flight SET flight_number=p_flight_number,airline_id=p_airline_id,plane_id=p_plane_id,origin_airport_id=p_origin_airport_id,destination_airport_id=p_destination_airport_id,departure_time=p_departure_time,arrival_time=p_arrival_time,duration_minutes=p_duration_minutes WHERE flight_id=p_flight_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_passenger_create`(IN `p_first_name` VARCHAR(50),IN `p_last_name` VARCHAR(50),IN `p_date_of_birth` DATE,IN `p_passport_number` VARCHAR(20),IN `p_email` VARCHAR(100),IN `p_phone` VARCHAR(20)) BEGIN
IF EXISTS(SELECT 1 FROM passenger WHERE passport_number=p_passport_number OR email=p_email) THEN
SELECT 'Passenger already exists' AS message;
ELSE
INSERT INTO passenger(first_name,last_name,date_of_birth,passport_number,email,phone) VALUES(p_first_name,p_last_name,p_date_of_birth,p_passport_number,p_email,p_phone);
SELECT 'Passenger inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_passenger_delete`(IN `p_passenger_id` INT) BEGIN
DELETE FROM passenger WHERE passenger_id=p_passenger_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_passenger_select_all`() BEGIN
SELECT * FROM passenger;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_passenger_select_by_id`(IN `p_passenger_id` INT) BEGIN
SELECT * FROM passenger WHERE passenger_id=p_passenger_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_passenger_update`(IN `p_passenger_id` INT,IN `p_first_name` VARCHAR(50),IN `p_last_name` VARCHAR(50),IN `p_date_of_birth` DATE,IN `p_passport_number` VARCHAR(20),IN `p_email` VARCHAR(100),IN `p_phone` VARCHAR(20)) BEGIN
UPDATE passenger SET first_name=p_first_name,last_name=p_last_name,date_of_birth=p_date_of_birth,passport_number=p_passport_number,email=p_email,phone=p_phone WHERE passenger_id=p_passenger_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_payment_create`(IN `p_booking_id` INT,IN `p_amount_paid` DECIMAL(10,2),IN `p_payment_date` DATETIME,IN `p_payment_method` VARCHAR(50),IN `p_payment_status` VARCHAR(50)) BEGIN
IF EXISTS(SELECT 1 FROM payment WHERE booking_id=p_booking_id AND payment_date=p_payment_date) THEN
SELECT 'Payment already exists' AS message;
ELSE
INSERT INTO payment(booking_id,amount_paid,payment_date,payment_method,payment_status) VALUES(p_booking_id,p_amount_paid,p_payment_date,p_payment_method,p_payment_status);
SELECT 'Payment inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_payment_delete`(IN `p_payment_id` INT) BEGIN
DELETE FROM payment WHERE payment_id=p_payment_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_payment_select_all`() BEGIN
SELECT pay.*, b.booking_id, CONCAT(p.first_name, ' ', p.last_name) as passenger_name FROM payment pay LEFT JOIN booking b ON pay.booking_id = b.booking_id LEFT JOIN passenger p ON b.passenger_id = p.passenger_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_payment_select_by_id`(IN `p_payment_id` INT) BEGIN
SELECT * FROM payment WHERE payment_id=p_payment_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_payment_update`(IN `p_payment_id` INT,IN `p_booking_id` INT,IN `p_amount_paid` DECIMAL(10,2),IN `p_payment_date` DATETIME,IN `p_payment_method` VARCHAR(50),IN `p_payment_status` VARCHAR(50)) BEGIN
UPDATE payment SET booking_id=p_booking_id,amount_paid=p_amount_paid,payment_date=p_payment_date,payment_method=p_payment_method,payment_status=p_payment_status WHERE payment_id=p_payment_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_plane_create`(IN `p_airline_id` INT,IN `p_plane_model` VARCHAR(50),IN `p_plane_capacity` INT) BEGIN
IF EXISTS(SELECT 1 FROM plane WHERE airline_id=p_airline_id AND plane_model=p_plane_model) THEN
SELECT 'Plane already exists' AS message;
ELSE
INSERT INTO plane(airline_id,plane_model,plane_capacity) VALUES(p_airline_id,p_plane_model,p_plane_capacity);
SELECT 'Plane inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_plane_delete`(IN `p_plane_id` INT) BEGIN
DELETE FROM plane WHERE plane_id=p_plane_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_plane_select_all`() BEGIN
SELECT p.*, a.airline_name FROM plane p LEFT JOIN airline a ON p.airline_id = a.airline_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_plane_select_by_id`(IN `p_plane_id` INT) BEGIN
SELECT * FROM plane WHERE plane_id=p_plane_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_plane_update`(IN `p_plane_id` INT,IN `p_airline_id` INT,IN `p_plane_model` VARCHAR(50),IN `p_plane_capacity` INT) BEGIN
UPDATE plane SET airline_id=p_airline_id,plane_model=p_plane_model,plane_capacity=p_plane_capacity WHERE plane_id=p_plane_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_seat_create`(IN `p_flight_id` INT,IN `p_flight_class_id` INT,IN `p_seat_number` VARCHAR(5),IN `p_availability_status` VARCHAR(20)) BEGIN
IF EXISTS(SELECT 1 FROM seat WHERE flight_id=p_flight_id AND seat_number=p_seat_number) THEN
SELECT 'Seat already exists' AS message;
ELSE
INSERT INTO seat(flight_id,flight_class_id,seat_number,availability_status) VALUES(p_flight_id,p_flight_class_id,p_seat_number,p_availability_status);
SELECT 'Seat inserted successfully' AS message;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_seat_delete`(IN `p_seat_id` INT) BEGIN
DELETE FROM seat WHERE seat_id=p_seat_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_seat_select_all`() BEGIN
SELECT s.*, f.flight_number, fc.flight_class_name FROM seat s LEFT JOIN flight f ON s.flight_id = f.flight_id LEFT JOIN flight_class fc ON s.flight_class_id = fc.flight_class_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_seat_select_by_id`(IN `p_seat_id` INT) BEGIN
SELECT * FROM seat WHERE seat_id=p_seat_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_seat_update`(IN `p_seat_id` INT,IN `p_flight_id` INT,IN `p_flight_class_id` INT,IN `p_seat_number` VARCHAR(5),IN `p_availability_status` VARCHAR(20)) BEGIN
UPDATE seat SET flight_id=p_flight_id,flight_class_id=p_flight_class_id,seat_number=p_seat_number,availability_status=p_availability_status WHERE seat_id=p_seat_id;
END$$

DELIMITER ;

--
-- Table structure for table `airline`
--
CREATE TABLE airline(airline_id INT(11) NOT NULL,airline_name VARCHAR(100) NOT NULL,iata_code VARCHAR(10) NOT NULL,icao_code VARCHAR(10) NOT NULL,country_id INT(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airline`
--
INSERT INTO airline(airline_id,airline_name,iata_code,icao_code,country_id) VALUES(1,'Lufthansa','LH','DLH',1),(2,'Air France','AF','AFR',2),(3,'British Airways','BA','BAW',3),(4,'Alitalia','AZ','AZA',4),(5,'Iberia','IB','IBE',5),(6,'KLM','KL','KLM',6),(7,'Swiss International','LX','SWR',7),(8,'Austrian Airlines','OS','AUA',8),(9,'Scandinavian Airlines','SK','SAS',9),(10,'Finnair','AY','FIN',10);

--
-- Table structure for table `airport`
--
CREATE TABLE airport(airport_id INT(11) NOT NULL,airport_name VARCHAR(150) NOT NULL,iata_code VARCHAR(10) NOT NULL,city_id INT(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airport`
--
INSERT INTO airport(airport_id,airport_name,iata_code,city_id) VALUES(1,'Berlin Brandenburg Airport','BER',1),(2,'Charles de Gaulle Airport','CDG',2),(3,'Heathrow Airport','LHR',3),(4,'Fiumicino Airport','FCO',4),(5,'Adolfo Suárez Madrid–Barajas','MAD',5),(6,'Amsterdam Schiphol Airport','AMS',6),(7,'Zurich Airport','ZRH',7),(8,'Vienna International Airport','VIE',8),(9,'Stockholm Arlanda Airport','ARN',9),(10,'Helsinki-Vantaa Airport','HEL',10);

--
-- Table structure for table `booking`
--
CREATE TABLE booking(booking_id INT(11) NOT NULL,passenger_id INT(11) NOT NULL,flight_id INT(11) NOT NULL,flight_class_id INT(11) NOT NULL,booking_date DATETIME DEFAULT NULL,total_price DECIMAL(10,2) DEFAULT NULL,status VARCHAR(50) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--
INSERT INTO booking(booking_id,passenger_id,flight_id,flight_class_id,booking_date,total_price,status) VALUES(13,1,21,1,'2025-07-20 00:00:00',120.00,'Confirmed'),(14,2,22,2,'2025-07-21 00:00:00',180.00,'Confirmed'),(15,3,23,1,'2025-07-22 00:00:00',100.00,'Pending'),(16,4,24,3,'2025-07-23 00:00:00',220.00,'Confirmed'),(17,5,25,2,'2025-07-24 00:00:00',170.00,'Cancelled'),(18,6,26,1,'2025-07-25 00:00:00',130.00,'Confirmed'),(19,7,27,3,'2025-07-26 00:00:00',415.00,'Pending'),(20,8,28,2,'2025-07-27 00:00:00',270.00,'Confirmed'),(21,9,29,1,'2025-07-28 00:00:00',210.00,'Confirmed'),(22,10,30,2,'2025-07-29 00:00:00',120.00,'Pending');

--
-- Table structure for table `city`
--
CREATE TABLE city(city_id INT(11) NOT NULL,city_name VARCHAR(100) NOT NULL,country_id INT(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `city`
--
INSERT INTO city(city_id,city_name,country_id) VALUES(1,'Berlin',1),(2,'Paris',2),(3,'London',3),(4,'Rome',4),(5,'Madrid',5),(6,'Amsterdam',6),(7,'Zurich',7),(8,'Vienna',8),(9,'Stockholm',9),(10,'Helsinki',10);

--
-- Table structure for table `country`
--
CREATE TABLE country(country_id INT(11) NOT NULL,country_name VARCHAR(100) NOT NULL,country_code VARCHAR(10) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `country`
--
INSERT INTO country(country_id,country_name,country_code) VALUES(1,'Germany','DE'),(2,'France','FR'),(3,'United Kingdom','UK'),(4,'Italy','IT'),(5,'Spain','ES'),(6,'Netherlands','NL'),(7,'Switzerland','CH'),(8,'Austria','AT'),(9,'Sweden','SE'),(10,'Finland','FI');

--
-- Table structure for table `fare`
--
CREATE TABLE fare(fare_id INT(11) NOT NULL,flight_id INT(11) NOT NULL,flight_class_id INT(11) NOT NULL,unit_price DECIMAL(10,2) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `flight`
--
CREATE TABLE flight(flight_id INT(11) NOT NULL,flight_number VARCHAR(50) NOT NULL,airline_id INT(11) NOT NULL,plane_id INT(11) NOT NULL,origin_airport_id INT(11) NOT NULL,destination_airport_id INT(11) NOT NULL,departure_time DATETIME NOT NULL,arrival_time DATETIME NOT NULL,duration_minutes INT(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flight`
--
INSERT INTO flight(flight_id,flight_number,airline_id,plane_id,origin_airport_id,destination_airport_id,departure_time,arrival_time,duration_minutes) VALUES(21,'LH100',1,1,1,2,'2025-09-01 08:00:00','2025-09-01 10:00:00',120),(22,'AF200',2,2,2,3,'2025-09-01 09:00:00','2025-09-01 11:00:00',120),(23,'BA300',3,3,3,4,'2025-09-01 07:30:00','2025-09-01 09:30:00',120),(24,'AZ400',4,4,4,5,'2025-09-01 10:00:00','2025-09-01 12:00:00',120),(25,'IB500',5,5,5,6,'2025-09-01 06:00:00','2025-09-01 08:00:00',120),(26,'KL600',6,6,6,7,'2025-09-01 11:00:00','2025-09-01 12:30:00',90),(27,'LX700',7,7,7,8,'2025-09-01 12:00:00','2025-09-01 13:30:00',90),(28,'OS800',8,8,8,9,'2025-09-01 14:00:00','2025-09-01 15:30:00',90),(29,'SK900',9,9,9,10,'2025-09-01 08:00:00','2025-09-01 09:30:00',90),(30,'AY1000',10,10,10,1,'2025-09-01 16:00:00','2025-09-01 18:00:00',120);

--
-- Table structure for table `flight_class`
--
CREATE TABLE flight_class(flight_class_id INT(11) NOT NULL,flight_class_name VARCHAR(50) DEFAULT NULL,description VARCHAR(50) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flight_class`
--
INSERT INTO flight_class(flight_class_id,flight_class_name,description) VALUES(1,'Economy','Standard class'),(2,'Premium Economy','Better comfort'),(3,'Business','Business class seating'),(4,'First Class','Luxury seating');

--
-- Table structure for table `passenger`
--
CREATE TABLE passenger(passenger_id INT(11) NOT NULL,first_name VARCHAR(50) DEFAULT NULL,last_name VARCHAR(50) DEFAULT NULL,date_of_birth DATE DEFAULT NULL,passport_number VARCHAR(20) DEFAULT NULL,email VARCHAR(100) DEFAULT NULL,phone VARCHAR(20) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `passenger`
--
INSERT INTO passenger(passenger_id,first_name,last_name,date_of_birth,passport_number,email,phone) VALUES(1,'John','Doe',NULL,NULL,'john@example.com','123456789'),(2,'Jane','Smith',NULL,NULL,'jane@example.com','987654321'),(3,'Alice','Johnson',NULL,NULL,'alice@example.com','456789123'),(4,'Bob','Brown',NULL,NULL,'bob@example.com','654321987'),(5,'Carol','Davis',NULL,NULL,'carol@example.com','321654987'),(6,'David','Wilson',NULL,NULL,'david@example.com','789123456'),(7,'Eve','Taylor',NULL,NULL,'eve@example.com','159753486'),(8,'Frank','Anderson',NULL,NULL,'frank@example.com','357159486'),(9,'Grace','Thomas',NULL,NULL,'grace@example.com','258456123'),(10,'Henry','Martin',NULL,NULL,'henry@example.com','147852369');

--
-- Table structure for table `payment`
--
CREATE TABLE payment(payment_id INT(11) NOT NULL,booking_id INT(11) NOT NULL,amount_paid DECIMAL(10,2) DEFAULT NULL,payment_date DATETIME DEFAULT NULL,payment_method VARCHAR(50) DEFAULT NULL,payment_status VARCHAR(50) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--
INSERT INTO payment(payment_id,booking_id,amount_paid,payment_date,payment_method,payment_status) VALUES(13,13,120.00,'2025-08-01 00:00:00','Credit Card','Paid'),(14,14,180.00,'2025-08-02 00:00:00','PayPal','Paid'),(15,15,100.00,'2025-08-03 00:00:00','Bank Transfer','Pending'),(16,16,220.00,'2025-08-04 00:00:00','Credit Card','Paid'),(17,17,170.00,'2025-08-05 00:00:00','PayPal','Cancelled'),(18,18,130.00,'2025-08-06 00:00:00','Credit Card','Paid'),(19,19,415.00,'2025-08-07 00:00:00','Bank Transfer','Pending'),(20,20,270.00,'2025-08-08 00:00:00','Credit Card','Paid'),(21,21,210.00,'2025-08-09 00:00:00','PayPal','Paid'),(22,22,120.00,'2025-08-10 00:00:00','Credit Card','Pending');

--
-- Table structure for table `plane`
--
CREATE TABLE plane(plane_id INT(11) NOT NULL,airline_id INT(11) NOT NULL,plane_model VARCHAR(50) NOT NULL,plane_capacity INT(11) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plane`
--
INSERT INTO plane(plane_id,airline_id,plane_model,plane_capacity) VALUES(1,1,'Airbus A220',140),(2,2,'Airbus A320',180),(3,3,'Airbus A330',250),(4,4,'Airbus A350',300),(5,5,'Airbus A321',200),(6,6,'Boeing 767',210),(7,7,'Boeing 737',180),(8,8,'Boeing 737',160),(9,9,'Boeing 747',400),(10,10,'Boeing 777',300);

--
-- Table structure for table `seat`
--
CREATE TABLE seat(seat_id INT(11) NOT NULL,flight_id INT(11) NOT NULL,flight_class_id INT(11) NOT NULL,seat_number VARCHAR(5) DEFAULT NULL,availability_status VARCHAR(20) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seat`
--
INSERT INTO seat(seat_id,flight_id,flight_class_id,seat_number,availability_status) VALUES(1,21,1,'1A','Available'),(2,22,2,'1B','Available'),(3,23,1,'1C','Available'),(4,24,3,'2A','Available'),(5,25,2,'2B','Available'),(6,26,1,'2C','Available'),(7,27,3,'3A','Available'),(8,28,1,'3B','Available'),(9,29,2,'3C','Available'),(10,30,1,'4A','Available');

--
-- Indexes for dumped tables
--
ALTER TABLE airline ADD PRIMARY KEY(airline_id),ADD KEY country_id(country_id);
ALTER TABLE airport ADD PRIMARY KEY(airport_id),ADD KEY city_id(city_id);
ALTER TABLE booking ADD PRIMARY KEY(booking_id),ADD KEY passenger_id(passenger_id),ADD KEY flight_id(flight_id),ADD KEY flight_class_id(flight_class_id);
ALTER TABLE city ADD PRIMARY KEY(city_id),ADD KEY country_id(country_id);
ALTER TABLE country ADD PRIMARY KEY(country_id);
ALTER TABLE fare ADD PRIMARY KEY(fare_id),ADD KEY flight_id(flight_id),ADD KEY flight_class_id(flight_class_id);
ALTER TABLE flight ADD PRIMARY KEY(flight_id),ADD KEY airline_id(airline_id),ADD KEY plane_id(plane_id),ADD KEY origin_airport_id(origin_airport_id),ADD KEY destination_airport_id(destination_airport_id);
ALTER TABLE flight_class ADD PRIMARY KEY(flight_class_id);
ALTER TABLE passenger ADD PRIMARY KEY(passenger_id);
ALTER TABLE payment ADD PRIMARY KEY(payment_id),ADD KEY booking_id(booking_id);
ALTER TABLE plane ADD PRIMARY KEY(plane_id),ADD KEY airline_id(airline_id);
ALTER TABLE seat ADD PRIMARY KEY(seat_id),ADD KEY flight_id(flight_id),ADD KEY flight_class_id(flight_class_id);

--
-- AUTO_INCREMENT for dumped tables
--
ALTER TABLE airline MODIFY airline_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
ALTER TABLE airport MODIFY airport_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
ALTER TABLE booking MODIFY booking_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
ALTER TABLE city MODIFY city_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
ALTER TABLE country MODIFY country_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
ALTER TABLE fare MODIFY fare_id INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE flight MODIFY flight_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
ALTER TABLE flight_class MODIFY flight_class_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
ALTER TABLE passenger MODIFY passenger_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
ALTER TABLE payment MODIFY payment_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
ALTER TABLE plane MODIFY plane_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
ALTER TABLE seat MODIFY seat_id INT(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--
ALTER TABLE airline ADD CONSTRAINT airline_ibfk_1 FOREIGN KEY(country_id) REFERENCES country(country_id);
ALTER TABLE airport ADD CONSTRAINT airport_ibfk_1 FOREIGN KEY(city_id) REFERENCES city(city_id);
ALTER TABLE booking ADD CONSTRAINT booking_ibfk_1 FOREIGN KEY(passenger_id) REFERENCES passenger(passenger_id),ADD CONSTRAINT booking_ibfk_2 FOREIGN KEY(flight_id) REFERENCES flight(flight_id),ADD CONSTRAINT booking_ibfk_3 FOREIGN KEY(flight_class_id) REFERENCES flight_class(flight_class_id);
ALTER TABLE city ADD CONSTRAINT city_ibfk_1 FOREIGN KEY(country_id) REFERENCES country(country_id);
ALTER TABLE fare ADD CONSTRAINT fare_ibfk_1 FOREIGN KEY(flight_id) REFERENCES flight(flight_id),ADD CONSTRAINT fare_ibfk_2 FOREIGN KEY(flight_class_id) REFERENCES flight_class(flight_class_id);
ALTER TABLE flight ADD CONSTRAINT flight_ibfk_1 FOREIGN KEY(airline_id) REFERENCES airline(airline_id),ADD CONSTRAINT flight_ibfk_2 FOREIGN KEY(plane_id) REFERENCES plane(plane_id),ADD CONSTRAINT flight_ibfk_3 FOREIGN KEY(origin_airport_id) REFERENCES airport(airport_id),ADD CONSTRAINT flight_ibfk_4 FOREIGN KEY(destination_airport_id) REFERENCES airport(airport_id);
ALTER TABLE payment ADD CONSTRAINT payment_ibfk_1 FOREIGN KEY(booking_id) REFERENCES booking(booking_id);
ALTER TABLE plane ADD CONSTRAINT plane_ibfk_1 FOREIGN KEY(airline_id) REFERENCES airline(airline_id);
ALTER TABLE seat ADD CONSTRAINT seat_ibfk_1 FOREIGN KEY(flight_id) REFERENCES flight(flight_id),ADD CONSTRAINT seat_ibfk_2 FOREIGN KEY(flight_class_id) REFERENCES flight_class(flight_class_id);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;