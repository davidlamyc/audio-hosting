#!/bin/bash

echo "Starting Audio Hosting Platform in Development Mode..."

# Load development environment
export $(cat .env.development | grep -v '^#' | xargs)

# Stop any existing containers
docker-compose -f docker/development/docker-compose.dev.yml down

# Build and start development containers
docker-compose -f docker/development/docker-compose.dev.yml up --build -d

echo "Development environment started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api"
echo "API Docs: http://localhost:5000/api/docs"
echo "Database: localhost:5432"
echo ""
echo "To view logs: docker-compose -f docker/development/docker-compose.dev.yml logs -f"
echo "To stop: docker-compose -f docker/development/docker-compose.dev.yml down"