#!/bin/bash

# Production deployment script for Oracle Cloud
# This script handles the full deployment process to Oracle Cloud VM

set -e

echo "Starting deployment process..."

# Variables
APP_DIR=$(pwd)
TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="${APP_DIR}/backups/${TIMESTAMP}"

# 1. Create backup directory
echo "Creating backup directory..."
mkdir -p ${BACKUP_DIR}

# 2. Backup current environment if it exists
if [ -f "${APP_DIR}/.env" ]; then
    echo "Backing up current environment..."
    cp ${APP_DIR}/.env ${BACKUP_DIR}/.env.bak
fi

# 3. Backup the database if running
if docker-compose ps | grep -q postgres; then
    echo "Backing up database..."
    docker-compose exec -T postgres pg_dump -U ${PGUSER} ${PGDATABASE} > ${BACKUP_DIR}/db_backup.sql
fi

# 4. Pull latest changes from git if this is a git repo
if [ -d "${APP_DIR}/.git" ]; then
    echo "Pulling latest changes from git..."
    git pull
fi

# 5. Build and restart containers
echo "Building and starting containers..."
docker-compose down
docker-compose build
docker-compose up -d

# 6. Wait for app to be fully running
echo "Waiting for application to start..."
MAX_RETRIES=30
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:5000/api/health | grep -q "ok"; then
        echo "Application is up and running!"
        break
    fi
    
    echo "Waiting for application to start ($((RETRY+1))/${MAX_RETRIES})..."
    sleep 2
    RETRY=$((RETRY+1))
done

if [ $RETRY -eq $MAX_RETRIES ]; then
    echo "WARNING: Application did not respond in time. Check logs with: docker-compose logs app"
fi

# 7. Run healthcheck
echo "Running health checks..."
./scripts/healthcheck.sh || true

# 8. Show deployment summary
echo "Deployment completed!"
echo "-------------------------"
echo "Timestamp: $(date)"
echo "Version: $(grep -m 1 \"version\" package.json | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')"
echo "Containers status:"
docker-compose ps
echo "-------------------------"
echo "Access your application at: https://$(grep DOMAIN .env | cut -d '=' -f2)"

# 9. Exit with success
exit 0