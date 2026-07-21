FROM php:8.0-apache

# Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install additional useful packages
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite \
    && a2enmod headers \
    && a2enmod deflate

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Copy Apache configuration
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/controllers \
    && chmod -R 775 /var/www/html/models

# Disable default Apache configuration and enable ours
RUN a2dissite 000-default || true \
    && a2ensite 000-default

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
