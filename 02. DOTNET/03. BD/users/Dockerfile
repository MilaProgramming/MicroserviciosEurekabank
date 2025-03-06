# Use the official MySQL image as the base image
FROM mysql:8.4

# Set environment variables for MySQL root user
ENV MYSQL_ROOT_PASSWORD=12345
ENV MYSQL_DATABASE=eurekabank

# Copy initialization scripts into the Docker container
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default MySQL port
EXPOSE 3306
