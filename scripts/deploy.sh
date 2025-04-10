#!/bin/bash

# Deployment script for Oracle Cloud VM

# Colors for console output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process for Portfolio application...${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${RED}Error: .env file not found!${NC}"
  echo -e "Please create an .env file based on .env.example before deploying."
  exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Error: Docker is not installed!${NC}"
  echo -e "Please install Docker before proceeding."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Error: Docker Compose is not installed!${NC}"
  echo -e "Please install Docker Compose before proceeding."
  exit 1
fi

# Check if nginx/ssl directory exists and contains SSL certificates
if [ ! -d "nginx/ssl" ] || [ ! -f "nginx/ssl/server.crt" ] || [ ! -f "nginx/ssl/server.key" ]; then
  echo -e "${YELLOW}Warning: SSL certificates not found in nginx/ssl directory.${NC}"
  echo -e "Creating directory for SSL certificates..."
  mkdir -p nginx/ssl
  echo -e "${YELLOW}You'll need to add your SSL certificates to the nginx/ssl directory.${NC}"
  echo -e "Place your certificate as server.crt and private key as server.key."
fi

# Pull latest changes
echo -e "${GREEN}Pulling latest changes from repository...${NC}"
git pull

# Build and start containers
echo -e "${GREEN}Building and starting containers...${NC}"
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check if containers are running
echo -e "${GREEN}Checking container status...${NC}"
docker-compose ps

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "Your application should now be accessible at https://yourdomain.com"
echo -e "Run 'docker-compose logs -f' to view the logs."