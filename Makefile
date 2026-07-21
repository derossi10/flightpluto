.PHONY: help build up down logs shell db-shell rebuild clean

help:
	@echo "FlightPluto - Docker Commands"
	@echo "============================="
	@echo "make build       - Build Docker images"
	@echo "make up          - Start services"
	@echo "make down        - Stop services"
	@echo "make rebuild     - Rebuild and restart services"
	@echo "make logs        - View PHP service logs"
	@echo "make logs-db     - View database logs"
	@echo "make shell       - Open PHP container shell"
	@echo "make db-shell    - Open MariaDB shell"
	@echo "make clean       - Remove containers and volumes"
	@echo "make ps          - Show running containers"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f php

logs-db:
	docker-compose logs -f mariadb

shell:
	docker-compose exec php bash

db-shell:
	docker-compose exec mariadb mysql -u root -p

rebuild: down build up

clean: down
	docker-compose down -v
	docker volume prune -f

ps:
	docker-compose ps

# Alternative Nginx setup
nginx-build:
	docker-compose -f docker-compose.nginx.yml build

nginx-up:
	docker-compose -f docker-compose.nginx.yml up -d

nginx-down:
	docker-compose -f docker-compose.nginx.yml down

nginx-logs:
	docker-compose -f docker-compose.nginx.yml logs -f

test-connection:
	docker-compose exec php php -r "require 'models/db.php'; \$$db = new Db(); \$$db->connect(); echo 'Database connection successful!\\n';"
