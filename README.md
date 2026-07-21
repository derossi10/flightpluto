# FlightPluto - Flight Management System
IBL 3.3

FlightPluto is a comprehensive, full-stack flight management system designed for efficient administration of airlines, airports, aircraft, and flight schedules. It provides a modern, responsive interface with secure user management capabilities.

## Overview

FlightPluto enables aviation businesses to manage their operations through a centralized platform featuring:

- **City & Airport Management**: Track international cities, countries, and airports with IATA codes
- **Airline Management**: Maintain airline profiles with IATA and ICAO code identification
- **Aircraft Management**: Fleet tracking with model specifications and capacity details
- **Flight Scheduling**: Comprehensive scheduling with origin/destination routes, times, and aircraft assignments

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+), jQuery, Bootstrap 4, Font Awesome |
| Backend | PHP 8.0+ |
| Database | MySQL/MariaDB with Stored Procedures |
| Styling | Modern CSS with glassmorphism effects, Google Fonts (Inter) |

## Security Features

- **Password Security**: Unique 20-character random salt per user, SHA-256 hashing
- **Access Control**: Object-based privilege management system
- **Session Management**: Secure PHP sessions with audit trails
- **Input Validation**: Sanitized queries via prepared statements

## Getting Started

### Quick Start with Docker (Recommended)

The easiest way to get FlightPluto running is with Docker:

```bash
# Clone the repository
git clone https://github.com/derossi10/flightpluto.git
cd flightpluto

# Start services with Docker Compose
docker-compose up --build

# Access the application
# - Application: http://localhost:8080
# - Database: mariadb:3306
```

See [README_DOCKER.md](README_DOCKER.md) for detailed Docker instructions, troubleshooting, and commands.

### Local Development Setup

#### Prerequisites

- Web Server (Apache via XAMPP/WAMP)
- PHP 8.0 or higher
- MySQL 5.7+ or MariaDB 10.4+

#### Installation

1. Clone the repository:
   ```
   git clone https://github.com/derossi10/flightpluto.git
   ```

2. Set up the database:
   - Create a database named `flightpluto`
   - Import `database/flightpluto.sql`
   - Import `database/security_setup.sql`

3. Configure database credentials in `models/db.php` (or set environment variables):
   ```php
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=flightpluto
   ```

4. Create your initial administrator account by visiting `setup_first_user.html`

5. Start your local web server (Apache/XAMPP)

## Project Structure

```
flightpluto/
├── assets/
│   ├── css/           # Stylesheets
│   └── js/            # Frontend JavaScript
├── controllers/       # Business logic layer
├── database/         # SQL scripts and schema
├── models/           # Data access layer
└── *.html            # Frontend pages
```
