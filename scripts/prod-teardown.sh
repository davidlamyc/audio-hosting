#!/bin/bash

echo "Doing prod teardown..."

# Stop existing production containers
docker-compose -f docker/production/docker-compose.prod.yml down

# Remove containers and images
docker system prune -a -f
docker volume prune -a -f