#!/bin/bash
# Health check script for Portfolio application on Oracle VPS

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Domain name argument
DOMAIN_NAME="$1"
if [ -z "$DOMAIN_NAME" ]; then
  DOMAIN_NAME="localhost:5000"
  echo -e "${YELLOW}No domain name provided, using $DOMAIN_NAME${NC}"
fi

# Log file
LOG_DIR="./logs"
mkdir -p $LOG_DIR
LOG_FILE="$LOG_DIR/health-check-$(date +%Y%m%d-%H%M%S).log"

# Header
echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}Portfolio Application Health Check${NC}"
echo -e "${BLUE}===================================${NC}"
echo -e "Date: $(date)"
echo -e "Domain: $DOMAIN_NAME"
echo -e "Log File: $LOG_FILE\n"

# Log to both console and file
log() {
  local message="$1"
  local color="${2:-$NC}"
  echo -e "${color}$message${NC}" | tee -a $LOG_FILE
}

# Function to check HTTP endpoint
check_endpoint() {
  local endpoint="$1"
  local expected_code="$2"
  local description="$3"
  
  log "\nChecking $description ($endpoint)..." $BLUE
  
  local http_code=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN_NAME$endpoint")
  
  if [ "$http_code" = "$expected_code" ]; then
    log "✅ $description: OK (HTTP $http_code)" $GREEN
  else
    log "❌ $description: FAILED (HTTP $http_code, expected $expected_code)" $RED
  fi
}

# Function to check application health endpoint
check_health() {
  log "\nChecking application health endpoint..." $BLUE
  
  local health_output=$(curl -s "http://$DOMAIN_NAME/health")
  if [ -z "$health_output" ]; then
    log "❌ Health endpoint: FAILED (No response)" $RED
    return
  fi
  
  # Extract status from health endpoint
  local db_status=$(echo $health_output | grep -o '"database":{"status":"[^"]*' | cut -d'"' -f6)
  local server_status=$(echo $health_output | grep -o '"server":{"status":"[^"]*' | cut -d'"' -f6)
  
  if [ "$db_status" = "up" ]; then
    log "✅ Database connection: OK" $GREEN
  else
    log "❌ Database connection: FAILED" $RED
  fi
  
  if [ "$server_status" = "up" ]; then
    log "✅ Server status: OK" $GREEN
  else
    log "❌ Server status: FAILED" $RED
  fi
}

# Function to check server resources
check_resources() {
  log "\nChecking server resources..." $BLUE
  
  # CPU Load
  local cpu_load=$(uptime | awk '{print $10}' | tr -d ',')
  log "CPU Load: $cpu_load"
  
  # Memory usage
  log "Memory Usage:"
  free -h | tee -a $LOG_FILE
  
  # Disk usage
  log "\nDisk Usage:"
  df -h | grep -v "tmpfs\|snap" | tee -a $LOG_FILE
  
  # Check for processes consuming too much CPU or memory
  log "\nTop processes by CPU usage:"
  ps aux --sort=-%cpu | head -6 | tee -a $LOG_FILE
  
  log "\nTop processes by memory usage:"
  ps aux --sort=-%mem | head -6 | tee -a $LOG_FILE
}

# Function to check NGINX status
check_nginx() {
  log "\nChecking NGINX status..." $BLUE
  
  if ! command -v nginx &> /dev/null; then
    log "❌ NGINX is not installed" $RED
    return
  fi
  
  local nginx_status=$(systemctl is-active nginx)
  if [ "$nginx_status" = "active" ]; then
    log "✅ NGINX service: ACTIVE" $GREEN
  else
    log "❌ NGINX service: $nginx_status" $RED
  fi
  
  # Check if port 80 is listening
  if netstat -tuln | grep -q ":80 "; then
    log "✅ Port 80 (HTTP): LISTENING" $GREEN
  else
    log "❌ Port 80 (HTTP): NOT LISTENING" $RED
  fi
  
  # Check if port 443 is listening (SSL)
  if netstat -tuln | grep -q ":443 "; then
    log "✅ Port 443 (HTTPS): LISTENING" $GREEN
  else
    log "❌ Port 443 (HTTPS): NOT LISTENING" $RED
  fi
  
  # Test NGINX configuration
  log "\nTesting NGINX configuration:"
  nginx -t | tee -a $LOG_FILE
}

# Function to check PostgreSQL status
check_postgresql() {
  log "\nChecking PostgreSQL status..." $BLUE
  
  # Check if PostgreSQL service is running
  local pg_status=$(systemctl is-active postgresql)
  if [ "$pg_status" = "active" ]; then
    log "✅ PostgreSQL service: ACTIVE" $GREEN
  else
    log "❌ PostgreSQL service: $pg_status" $RED
  fi
  
  # Check if port 5432 is listening
  if netstat -tuln | grep -q ":5432 "; then
    log "✅ Port 5432 (PostgreSQL): LISTENING" $GREEN
  else
    log "❌ Port 5432 (PostgreSQL): NOT LISTENING" $RED
  fi
}

# Function to check PM2 status
check_pm2() {
  log "\nChecking PM2 status..." $BLUE
  
  if ! command -v pm2 &> /dev/null; then
    log "❌ PM2 is not installed" $RED
    return
  fi
  
  log "PM2 process list:"
  pm2 list | tee -a $LOG_FILE
  
  # Check if portfolio application is running
  if pm2 list | grep -q "portfolio"; then
    log "✅ Portfolio application: RUNNING" $GREEN
    
    # Check memory usage
    local mem_usage=$(pm2 info portfolio | grep memory | awk '{print $4}')
    log "Memory usage: $mem_usage"
    
    # Check uptime
    local uptime=$(pm2 info portfolio | grep uptime | awk '{print $4" "$5" "$6" "$7}')
    log "Uptime: $uptime"
  else
    log "❌ Portfolio application: NOT RUNNING" $RED
  fi
}

# Function to check log files for errors
check_logs() {
  log "\nChecking for errors in log files..." $BLUE
  
  # Check NGINX error log
  if [ -f "/var/log/nginx/error.log" ]; then
    local nginx_errors=$(grep -i "error\|fatal" /var/log/nginx/error.log | tail -10)
    if [ -n "$nginx_errors" ]; then
      log "❌ Found errors in NGINX error log:" $RED
      echo "$nginx_errors" | tee -a $LOG_FILE
    else
      log "✅ No recent errors in NGINX error log" $GREEN
    fi
  else
    log "❌ NGINX error log not found" $RED
  fi
  
  # Check PM2 logs
  local pm2_errors=$(pm2 logs --lines 100 --nostream portfolio 2>/dev/null | grep -i "error\|exception\|fatal" | tail -10)
  if [ -n "$pm2_errors" ]; then
    log "❌ Found errors in PM2 logs:" $RED
    echo "$pm2_errors" | tee -a $LOG_FILE
  else
    log "✅ No recent errors in PM2 logs" $GREEN
  fi
}

# Execute checks
check_endpoint "/" 200 "Homepage"
check_endpoint "/api/auth/me" 401 "Auth API"
check_health
check_resources
check_nginx
check_postgresql
check_pm2
check_logs

# Summary
log "\n${BLUE}===================================${NC}"
log "${BLUE}Health Check Summary${NC}"
log "${BLUE}===================================${NC}"
log "Health check completed at $(date)"
log "Full details available in $LOG_FILE\n"