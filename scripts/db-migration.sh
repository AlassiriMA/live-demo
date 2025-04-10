#!/bin/bash
# Database migration script for Portfolio application on Oracle VPS

# Load environment variables
source .env

# Extract database credentials from DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^:]*:\([^@]*\).*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^@]*@\([^:]*\).*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^@]*@[^:]*:\([^\/]*\).*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^@]*@[^\/]*\/\(.*\)$/\1/p')

# Log file
LOG_FILE="./logs/db-migration-$(date +%Y%m%d-%H%M%S).log"
mkdir -p ./logs

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to log messages
log() {
  local message="$1"
  local color="${2:-$NC}"
  echo -e "${color}$(date +"%Y-%m-%d %H:%M:%S") - $message${NC}" | tee -a $LOG_FILE
}

# Check if drizzle-kit is installed
if ! command -v drizzle-kit &> /dev/null && ! [ -f "./node_modules/.bin/drizzle-kit" ]; then
  log "drizzle-kit is not installed. Please run: npm install -g drizzle-kit" $RED
  exit 1
fi

# Welcome message
log "Starting database migration process for Portfolio application" $GREEN
log "Database: $DB_NAME on $DB_HOST" $GREEN

# Backup the database before migration
log "Creating database backup before migration..." $YELLOW
export PGPASSWORD=$DB_PASS
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f "./backups/pre_migration_backup_$(date +%Y%m%d-%H%M%S).dump"

if [ $? -eq 0 ]; then
  log "Backup created successfully" $GREEN
else
  log "Backup failed. Do you want to continue with migration? (y/n)" $RED
  read -r continue_migration
  if [[ "$continue_migration" != "y" ]]; then
    log "Migration aborted" $RED
    exit 1
  fi
fi

# Generate migration
log "Generating migration..." $YELLOW
npx drizzle-kit push >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
  log "Migration generated successfully" $GREEN
else
  log "Migration generation failed. See $LOG_FILE for details" $RED
  exit 1
fi

# Run migration
log "Applying migration to database..." $YELLOW
npm run db:push >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
  log "Migration applied successfully" $GREEN
else
  log "Migration failed. See $LOG_FILE for details" $RED
  log "Restoring from backup is recommended" $RED
  exit 1
fi

# Done
log "Database migration completed successfully" $GREEN
log "If you encounter any issues, you can restore from the backup created before migration" $YELLOW