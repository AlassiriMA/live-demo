#!/bin/bash

# Deployment script for Oracle Cloud Infrastructure
# This script builds and deploys the portfolio application to Docker containers

set -e

echo "======================================================"
echo "Portfolio Deployment Script for Oracle Cloud"
echo "======================================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please create a .env file from .env.example or .env.production.sample"
    exit 1
fi

# Load .env variables
export $(grep -v '^#' .env | xargs)

echo "======================================================"
echo "Testing database connection..."
echo "======================================================"
node --experimental-specifier-resolution=node scripts/test-db-connection.js
if [ $? -ne 0 ]; then
    echo "ERROR: Database connection test failed!"
    echo "Please check your DATABASE_URL and other database settings"
    exit 1
fi

echo "======================================================"
echo "Stopping existing containers (if any)..."
echo "======================================================"
docker-compose down || true

echo "======================================================"
echo "Building application containers..."
echo "======================================================"
docker-compose build

echo "======================================================"
echo "Starting containers in detached mode..."
echo "======================================================"
docker-compose up -d

echo "======================================================"
echo "Waiting for services to start..."
echo "======================================================"
# Sleep to allow services to start
sleep 10

echo "======================================================"
echo "Checking container status..."
echo "======================================================"
docker-compose ps

echo "======================================================"
echo "Application logs (last 20 lines)..."
echo "======================================================"
docker-compose logs --tail=20 app

echo "======================================================"
echo "Deployment complete!"
echo "======================================================"
echo "Your application should now be running at:"
echo "https://${APP_DOMAIN:-localhost}"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo "======================================================"