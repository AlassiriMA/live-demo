#!/bin/bash
# Database backup script for Portfolio application

# Load environment variables
source .env

# Extract database credentials from DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^:]*:\([^@]*\).*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^@]*@\([^:]*\).*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^@]*@[^:]*:\([^\/]*\).*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/^postgresql:\/\/[^@]*@[^\/]*\/\(.*\)$/\1/p')

# Set backup directory
BACKUP_DIR="/home/ubuntu/portfolio/backups"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/portfolio-backup-${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Set environment variable for PostgreSQL password
export PGPASSWORD=$DB_PASS

# Create backup
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f $BACKUP_FILE

# Reset PostgreSQL password environment variable
unset PGPASSWORD

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Cleanup old backups (keep only the latest 5)
    ls -t $BACKUP_DIR/portfolio-backup-*.sql | tail -n +6 | xargs rm -f
    
    # Log backup
    echo "${TIMESTAMP}: Backup successful - $BACKUP_FILE" >> $BACKUP_DIR/backup.log
else
    echo "Backup failed!"
    echo "${TIMESTAMP}: Backup failed" >> $BACKUP_DIR/backup.log
fi