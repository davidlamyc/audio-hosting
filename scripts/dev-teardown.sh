#!/bin/bash

echo "Doing dev teardown..."

# Stop existing production containers
docker-compose -f docker/development/docker-compose.dev.yml down

# Remove containers and images
docker system prune -a -f
docker volume prune -a -f