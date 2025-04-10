#!/bin/bash
# Server maintenance script for Portfolio application

# Log file
LOG_FILE="/home/ubuntu/portfolio/logs/maintenance.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Create logs directory if it doesn't exist
mkdir -p /home/ubuntu/portfolio/logs

# Log start of maintenance
echo "${TIMESTAMP}: Starting server maintenance" >> $LOG_FILE

# Update system packages
echo "${TIMESTAMP}: Updating system packages" >> $LOG_FILE
sudo apt update && sudo apt upgrade -y >> $LOG_FILE 2>&1

# Check disk space
echo "${TIMESTAMP}: Checking disk space" >> $LOG_FILE
df -h >> $LOG_FILE

# Clean up old log files
echo "${TIMESTAMP}: Cleaning up old log files" >> $LOG_FILE
find /home/ubuntu/portfolio/logs -name "*.log" -type f -mtime +30 -delete
find /var/log/nginx -name "*.gz" -type f -mtime +30 -delete

# Restart NGINX to clear any memory leaks
echo "${TIMESTAMP}: Restarting NGINX" >> $LOG_FILE
sudo systemctl restart nginx >> $LOG_FILE 2>&1

# Restart the application to clear any memory leaks
echo "${TIMESTAMP}: Restarting application" >> $LOG_FILE
pm2 reload portfolio >> $LOG_FILE 2>&1

# Check NGINX status
echo "${TIMESTAMP}: Checking NGINX status" >> $LOG_FILE
sudo systemctl status nginx | head -3 >> $LOG_FILE

# Check application status
echo "${TIMESTAMP}: Checking application status" >> $LOG_FILE
pm2 status portfolio >> $LOG_FILE

# Check server load
echo "${TIMESTAMP}: Server load" >> $LOG_FILE
uptime >> $LOG_FILE

# Check memory usage
echo "${TIMESTAMP}: Memory usage" >> $LOG_FILE
free -h >> $LOG_FILE

# Check running processes
echo "${TIMESTAMP}: Top processes by memory usage" >> $LOG_FILE
ps aux --sort=-%mem | head -10 >> $LOG_FILE

# Run database backup
echo "${TIMESTAMP}: Running database backup" >> $LOG_FILE
/home/ubuntu/portfolio/scripts/backup-db.sh >> $LOG_FILE 2>&1

# Log end of maintenance
echo "${TIMESTAMP}: Server maintenance completed" >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE