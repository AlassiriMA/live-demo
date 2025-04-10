# Portfolio Application: Deployment Guide

## Overview
This guide provides detailed instructions for deploying the Portfolio application to an Oracle VPS with NGINX for custom domain mapping. The deployment is optimized for security, performance, and maintainability.

## Deployment Options

### Option 1: Traditional Deployment (Recommended)
The traditional deployment method installs the application directly on the VPS with NGINX and PostgreSQL.

**Pros:**
- Lower resource usage
- Simpler networking
- Easier direct access to logs and files

**Cons:**
- More manual configuration
- OS-specific dependencies

### Option 2: Docker Deployment
The Docker deployment uses containers for the application, database, and NGINX.

**Pros:**
- Isolated environments
- Easier to migrate
- Consistent across different systems

**Cons:**
- Higher resource overhead
- More complex networking
- Additional layer of abstraction

## Prerequisites
- Oracle VPS with Ubuntu 20.04 or newer
- Domain name pointing to your VPS IP address
- SSH access to the VPS
- Basic knowledge of Linux, NGINX, and PostgreSQL

## Deployment Files
The following files are provided for deployment:

### Scripts
- `scripts/setup-nginx.sh`: Configures NGINX with your domain name
- `scripts/backup-db.sh`: Creates database backups
- `scripts/server-maintenance.sh`: Performs routine server maintenance
- `scripts/security-setup.sh`: Enhances server security
- `scripts/health-check.sh`: Checks application health
- `scripts/db-migration.sh`: Handles database migrations

### Configuration Files
- `.env.production.sample`: Sample environment variables for production
- `ecosystem.config.js`: PM2 process manager configuration
- `scripts/portfolio.service`: Systemd service file for automatic startup
- `Dockerfile`: For containerized deployment
- `docker-compose.yml`: Docker Compose configuration
- `nginx/conf.d/default.conf`: NGINX server configuration

## Quick Start: Traditional Deployment

1. **Clone the repository to your VPS:**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install --production
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.production.sample .env
   # Edit .env with your actual values
   nano .env
   ```

4. **Make scripts executable:**
   ```bash
   chmod +x scripts/*.sh
   ```

5. **Set up the database:**
   ```bash
   # Install PostgreSQL if not already installed
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # Create a database and user
   sudo -u postgres psql -c "CREATE DATABASE portfolio;"
   sudo -u postgres psql -c "CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_secure_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;"
   
   # Push database schema
   npm run db:push
   ```

6. **Set up NGINX with auto-SSL:**
   ```bash
   ./scripts/setup-nginx.sh yourdomain.com
   ```

7. **Set up security enhancements:**
   ```bash
   ./scripts/security-setup.sh
   ```

8. **Configure as a system service:**
   ```bash
   sudo cp scripts/portfolio.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable portfolio
   sudo systemctl start portfolio
   ```

9. **Verify the deployment:**
   ```bash
   ./scripts/health-check.sh yourdomain.com
   ```

## Quick Start: Docker Deployment

1. **Clone the repository to your VPS:**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install Docker and Docker Compose:**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo systemctl enable docker
   sudo systemctl start docker
   sudo usermod -aG docker $USER
   # Log out and back in for group changes to take effect
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.production.sample .env
   # Edit .env with your actual values
   nano .env
   ```

4. **Start the application with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

5. **Verify the deployment:**
   ```bash
   ./scripts/health-check.sh yourdomain.com
   ```

## Maintenance Operations

### Database Backups
```bash
./scripts/backup-db.sh
```

### Server Maintenance
```bash
./scripts/server-maintenance.sh
```

### Health Checks
```bash
./scripts/health-check.sh yourdomain.com
```

### Database Migrations
```bash
./scripts/db-migration.sh
```

## Troubleshooting

### Application Not Accessible
1. Check if the application is running:
   ```bash
   pm2 status
   # or for Docker
   docker-compose ps
   ```

2. Check NGINX configuration:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. Check firewall settings:
   ```bash
   sudo ufw status
   ```

### Database Connection Issues
1. Check PostgreSQL status:
   ```bash
   sudo systemctl status postgresql
   ```

2. Verify database credentials in `.env`

3. Check database connection:
   ```bash
   curl http://localhost:5000/health
   ```

### SSL Certificate Issues
1. Check Let's Encrypt certificate status:
   ```bash
   sudo certbot certificates
   ```

2. Renew certificates if needed:
   ```bash
   sudo certbot renew --dry-run
   ```

## Performance Optimization

### NGINX Caching
Edit `nginx/conf.d/default.conf` to add additional caching:

```nginx
# Add this inside the server block
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=portfolio_cache:10m max_size=1g inactive=60m;

# Add this inside the location block
proxy_cache portfolio_cache;
proxy_cache_valid 200 60m;
proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
```

### Database Optimization
For production environments with higher load:

1. Edit PostgreSQL configuration:
   ```bash
   sudo nano /etc/postgresql/*/main/postgresql.conf
   ```

2. Adjust these parameters based on your server's resources:
   ```
   shared_buffers = 256MB
   work_mem = 8MB
   maintenance_work_mem = 64MB
   effective_cache_size = 1GB
   ```

3. Restart PostgreSQL:
   ```bash
   sudo systemctl restart postgresql
   ```

## Security Best Practices

1. **Keep software updated:**
   ```bash
   sudo apt update && sudo apt upgrade
   npm update --production
   ```

2. **Regularly check logs for suspicious activity:**
   ```bash
   sudo journalctl -u nginx
   sudo journalctl -u portfolio
   ```

3. **Monitor authentication attempts:**
   ```bash
   sudo grep "authentication fail" /var/log/auth.log
   ```

4. **Regularly rotate database credentials**

5. **Enable automatic security updates:**
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

## Conclusion
Following this guide, you should have a secure, optimized deployment of the Portfolio application on an Oracle VPS with NGINX for custom domain mapping. The deployment includes health checks, database backups, and security enhancements to ensure a robust production environment.

For more detailed information, refer to the comprehensive `DEPLOYMENT.md` file.