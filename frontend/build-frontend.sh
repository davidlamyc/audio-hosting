#!/bin/bash

echo "Building Audio Hosting Frontend with Ant Design 5..."

# Create directories
mkdir -p build

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run build
echo "Building React application..."
npm run build

# Build Docker image
echo "Building Docker image..."
docker build -t audio-hosting-frontend:latest .

echo "Frontend build completed successfully!"
echo ""
echo "To run the frontend:"
echo "docker run -p 3000:80 audio-hosting-frontend:latest"
echo ""
echo "Or use with docker-compose:"
echo "docker-compose up frontend"