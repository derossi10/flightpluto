# FlightPluto - Deployment Guide

This guide covers production deployment strategies for FlightPluto.

## Production Considerations

### 1. Environment Security

**DO NOT** commit sensitive data to git:
- `.env` files with real credentials
- Database passwords
- API keys
- Private keys

Use environment variables or secrets management instead:

```bash
# Example with docker-compose override
cp docker-compose.yml docker-compose.prod.yml
# Edit docker-compose.prod.yml with production values
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 2. Database Backups

Set up automated backups:

```bash
#!/bin/bash
# backup-db.sh
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

docker-compose exec -T mariadb mysqldump -u root -proot_password flightpluto \
  > $BACKUP_DIR/flightpluto_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "flightpluto_*.sql" -mtime +7 -delete
```

Schedule with cron:
```
0 2 * * * /path/to/backup-db.sh
```

### 3. SSL/HTTPS Configuration

For production with Let's Encrypt:

```yaml
# docker-compose.prod.yml
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
      - ./certbot:/etc/letsencrypt
```

Install certificates:
```bash
docker run -it --rm -v ./certbot:/etc/letsencrypt certbot/certbot \
  certonly --standalone -d yourdomain.com
```

### 4. Resource Limits

Set resource constraints in docker-compose:

```yaml
services:
  php:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
  
  mariadb:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

### 5. Health Checks

Monitor service health:

```yaml
services:
  php:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/index.html"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
  
  mariadb:
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 30s
      timeout: 10s
      retries: 5
```

### 6. Logging

Configure centralized logging:

```yaml
services:
  php:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  mariadb:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Docker Swarm Deployment

For clustering across multiple servers:

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml flightpluto

# Check status
docker stack ps flightpluto

# Scale services
docker service scale flightpluto_php=3
```

## Kubernetes Deployment

Convert Docker Compose to Kubernetes:

```bash
# Install Kompose
curl -L https://github.com/kubernetes/kompose/releases/download/v1.26.0/kompose-linux-amd64 -o kompose
chmod +x kompose

# Convert
./kompose convert -f docker-compose.yml

# Deploy to Kubernetes
kubectl apply -f .
```

## Cloud Deployment Options

### AWS ECS
```bash
# Use ECS CLI
ecs-cli compose service up
```

### Google Cloud Run
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/flightpluto
gcloud run deploy flightpluto --image gcr.io/PROJECT_ID/flightpluto
```

### Azure Container Instances
```bash
# Create resource group
az group create --name flightpluto --location eastus

# Deploy container
az container create --resource-group flightpluto \
  --name flightpluto --image flightpluto:latest
```

## Monitoring & Analytics

### Using Prometheus & Grafana

```yaml
monitoring:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

## Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_flight_date ON flight(departure_time);
CREATE INDEX idx_booking_status ON booking(booking_status);
CREATE INDEX idx_passenger_email ON passenger(email);
```

### 2. PHP Opcache

Configure in Dockerfile:
```dockerfile
RUN docker-php-ext-install opcache
COPY opcache.ini /usr/local/etc/php/conf.d/opcache.ini
```

### 3. CDN for Static Assets

Use Cloudflare or AWS CloudFront for:
- JavaScript files in `assets/js/`
- CSS files in `assets/css/`
- Font files

## Backup & Disaster Recovery

### Full System Backup

```bash
#!/bin/bash
# backup-full.sh
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker-compose exec -T mariadb mysqldump -u root -proot_password flightpluto \
  > $BACKUP_DIR/db_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.docker' \
  ./

echo "Backup completed: $DATE"
```

### Recovery Procedure

```bash
# Restore database
docker-compose exec -T mariadb mysql -u root -proot_password flightpluto < $BACKUP_DIR/db_YYYYMMDD_HHMMSS.sql

# Restore files
tar -xzf $BACKUP_DIR/app_YYYYMMDD_HHMMSS.tar.gz

# Restart services
docker-compose restart
```

## Troubleshooting Production Issues

### Out of Memory
```bash
# Increase Docker memory allocation
# Edit Docker Desktop Settings or docker daemon.json
```

### Slow Database Queries
```bash
# Enable slow query log
# In mariadb service, add environment:
#   MYSQL_LOG_QUERIES_NOT_USING_INDEXES: '1'
```

### High CPU Usage
```bash
# Check container resource usage
docker stats

# Profile application
docker-compose exec php php -d xdebug.mode=profile script.php
```

## Maintenance Schedule

**Daily:**
- Check health status: `make ps`
- Review error logs: `make logs`

**Weekly:**
- Full backup of database
- Check disk space

**Monthly:**
- Security updates for images
- Database optimization
- Performance analysis

**Quarterly:**
- Disaster recovery test
- Architecture review
