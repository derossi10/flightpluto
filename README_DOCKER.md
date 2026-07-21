# FlightPluto - Docker Setup

This guide provides instructions for running FlightPluto using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Make (optional, for using Makefile commands)
- At least 2GB of free disk space

## Quick Start with Apache (Default)

### 1. Build and Start the Application

```bash
docker-compose up --build
```

Or using Make:
```bash
make up
```

This command will:
- Build the PHP Apache image
- Start the PHP service on port 8080
- Start the MariaDB database service on port 3306
- Initialize the database with SQL schemas

### 2. Access the Application

Open your web browser and navigate to:
- **Application**: http://localhost:8080
- **Database**: mariadb:3306 (internal container network)

## Alternative Setup with Nginx

If you prefer Nginx instead of Apache:

```bash
docker-compose -f docker-compose.nginx.yml up --build
```

Or using Make:
```bash
make nginx-up
```

Nginx typically offers better performance for production environments.

## Database Access
To access MariaDB directly from your host machine:

```bash
mysql -h localhost -P 3306 -u flightpluto_user -p flightpluto
```

Password: `flightpluto_pass123`

### 4. View Logs

To view logs from the PHP service:
```bash
docker-compose logs -f php
```

To view logs from the MariaDB service:
```bash
docker-compose logs -f mariadb
```

## Common Commands

### Using Docker Compose Directly

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f php          # PHP service logs
docker-compose logs -f mariadb      # Database logs

# Execute commands
docker-compose exec php bash                           # PHP container shell
docker-compose exec mariadb mysql -u root -p          # MariaDB shell

# Rebuild images
docker-compose build --no-cache
```

### Using Make Commands (Recommended)

If you have `make` installed, you can use convenient shorthand commands:

```bash
make help          # Show all available commands
make up            # Start services
make down          # Stop services
make rebuild       # Rebuild and restart
make logs          # View PHP logs
make logs-db       # View database logs
make shell         # Open PHP container shell
make db-shell      # Open database shell
make clean         # Remove everything
make ps            # Show running containers
make nginx-up      # Start Nginx setup instead
```

## Test Database Connection

Verify the database is properly connected:

```bash
# Using Make
make test-connection

# Using Docker Compose
docker-compose exec php php -r "require 'models/db.php'; \$db = new Db(); \$db->connect(); echo 'Database connection successful!\\n';"
```
## Environment Variables

Configure environment variables by editing:
- Copy `.env.example` to `.env` and modify as needed
- Or update values directly in `docker-compose.yml`

## Port Configuration

- **PHP/Apache**: 8080 (accessible at http://localhost:8080)
- **MariaDB**: 3306 (accessible at localhost:3306)

You can change these ports in `docker-compose.yml` if needed.

## Troubleshooting

### Database Connection Refused
```
Make sure MariaDB container is running:
docker-compose ps
```

### Port Already in Use
```
Change port mapping in docker-compose.yml:
ports:
  - "8081:80"  # Changed from 8080:80
```

### Database Not Initialized
```
Check logs:
docker-compose logs mariadb

Rebuild and restart:
docker-compose down -v
docker-compose up --build
```

### Permission Issues
```
If you see permission errors in PHP:
docker-compose exec php chown -R www-data:www-data /var/www/html
```

## File Structure in Container

```
/var/www/html/
├── controllers/        # PHP controllers
├── models/            # Database models
├── assets/
│   └── js/           # JavaScript files
├── database/         # SQL schema files
└── *.html           # HTML pages
```

## Production Considerations

For production deployment:

1. **Use environment variables** for sensitive data (DB passwords, etc.)
2. **Use secrets management** (Docker Secrets for Swarm, Kubernetes Secrets, etc.)
3. **Enable HTTPS** with SSL certificates
4. **Use persistent volumes** for database data
5. **Configure resource limits** in docker-compose.yml
6. **Set up backup strategy** for MariaDB data
7. **Use health checks** (already configured for MariaDB)
8. **Consider using reverse proxy** (nginx/traefik)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MariaDB Docker Image](https://hub.docker.com/_/mariadb)
- [PHP Docker Image](https://hub.docker.com/_/php)
