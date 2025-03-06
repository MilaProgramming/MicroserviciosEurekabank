# Use official MariaDB image from Docker Hub
FROM mariadb:latest

# Copy the initialization script for MariaDB (optional)
COPY init.sql /docker-entrypoint-initdb.d/

# Expose port (default MariaDB port)
EXPOSE 3306
