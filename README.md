# FlightPluto - Flight Management System

FlightPluto is a robust, full-stack flight management system designed for efficient administration of airlines, airports, aircraft, and flight schedules. It features a modern, responsive interface and a secure user management module.

## Key Features

*   **Comprehensive Management Modules**:
    *   **City Management**: Track international cities and their countries.
    *   **Airport Management**: Manage global airports with IATA codes and city associations.
    *   **Airline Management**: Maintain airline profiles, including IATA and ICAO codes.
    *   **Aircraft Management**: Fleet tracking with model and capacity details.
    *   **Flight Scheduling**: Manage complex flight schedules with origin/destination, times, and aircraft assignments.
*   **Secure Authentication & Authorization**:
    *   Salted SHA-256 password hashing.
    *   Granular privilege management (Object-based access control).
    *   System auditing (Track who added each record).
*   **Modern User Interface**:
    *   Responsive design powered by Bootstrap 4.
    *   Sleek aesthetics with glassmorphism and subtle animations.
    *   Dynamic data loading using AJAX/jQuery.

## Technology Stack

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+), jQuery, Bootstrap 4, Font Awesome 5.
*   **Backend**: PHP 8.0+.
*   **Database**: MySQL/MariaDB (Stored Procedures for all CRUD operations).
*   **Styling**: Modern CSS with glassmorphism effects and Google Fonts (Inter).

## Prerequisites

*   **Web Server**: Apache (XAMPP/WAMP recommended).
*   **PHP**: Version 8.0 or higher.
*   **Database**: MySQL 5.7+ or MariaDB 10.4+.

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/derossi10/flightpluto.git
    ```
2.  **Database Setup**:
    *   Create a database named `flightpluto`.
    *   Import `database/flightpluto.sql` to set up the core tables and flight data.
    *   Import `database/security_setup.sql` to set up the user management system and stored procedures.
3.  **Configuration**:
    *   Open `models/db.php` and update your database credentials (`host`, `username`, `password`).
4.  **First User Setup**:
    *   Navigate to `setup_first_user.html` in your browser to create the initial system administrator account.

## Architecture

FlightPluto follows a modular architecture:
*   **Models**: PHP classes handling database interactions via Stored Procedures.
*   **Controllers**: API endpoints that bridge the frontend and models.
*   **Assets**: Modular JavaScript files and modern CSS styling.
*   **Database**: Logic is centralized in SQL Stored Procedures for performance and security.

## Security

The system employs a multi-layered security approach:
*   **Password Security**: Every user has a unique 20-character random salt. Passwords are hashed using SHA-256 (Password + Salt).
*   **Access Control**: A dedicated `user_privileges` table determines which modules each staff member can access.
*   **Session Management**: Secure PHP sessions track user state across the application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
