#!/bin/bash

echo "Deploying Audio Hosting Platform to Production..."

# Load production environment
export $(cat .env.production | grep -v '^#' | xargs)

# Stop existing production containers
docker-compose -f docker/production/docker-compose.prod.yml down

# Start production containers
docker-compose -f docker/production/docker-compose.prod.yml up -d

echo "Production deployment completed!"
echo "Application URL: ${FRONTEND_URL}"
echo ""
echo "To view logs: docker-compose -f docker/production/docker-compose.prod.yml logs -f"
echo "To stop: docker-compose -f docker/production/docker-compose.prod.yml down"