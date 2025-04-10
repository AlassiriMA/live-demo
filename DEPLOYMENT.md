# Deployment Guide for Oracle Cloud

This document provides step-by-step instructions for deploying the Portfolio application to Oracle Cloud Infrastructure (OCI).

## Prerequisites

- Oracle Cloud account with a Compute instance (VM.Standard shape recommended)
- Domain name pointed to your Oracle Cloud VM's public IP
- Basic familiarity with Linux command line

## Setup Process

### 1. Provision Oracle Cloud VM

1. Log in to your Oracle Cloud dashboard
2. Create a Compute instance with at least 2 OCPUs and 4GB RAM
3. Use Oracle Linux or Ubuntu 22.04 as the operating system
4. Create a Virtual Cloud Network (VCN) with public subnet
5. Configure security list to allow:
   - SSH (port 22)
   - HTTP (port 80)
   - HTTPS (port 443)
   - Application port (5000)

### 2. Initial Server Setup

1. SSH into your VM:
   ```bash
   ssh opc@your-vm-public-ip -i your-private-key.pem
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git /opt/portfolio
   cd /opt/portfolio
   ```

3. Run the server setup script:
   ```bash
   sudo ./scripts/setup-server.sh
   ```

This script will:
- Update system packages
- Install Docker and Docker Compose
- Configure firewall
- Install Nginx and Certbot for SSL

### 3. Configure SSL Certificates

1. Use Certbot to obtain and configure SSL certificates:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

2. Copy certificates to the nginx/ssl directory:
   ```bash
   sudo mkdir -p /opt/portfolio/nginx/ssl
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/portfolio/nginx/ssl/server.crt
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/portfolio/nginx/ssl/server.key
   sudo chown -R $(whoami):$(whoami) /opt/portfolio/nginx/ssl
   ```

### 4. Configure Environment Variables

1. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your production values:
   ```bash
   nano .env
   ```

   Ensure you set secure values for:
   - `DATABASE_URL`
   - `PGUSER`, `PGPASSWORD`, `PGDATABASE`
   - `SESSION_SECRET`
   - `JWT_SECRET`
   - `APP_DOMAIN`

### 5. Deploy the Application

1. Run the deployment script:
   ```bash
   ./scripts/deploy.sh
   ```

2. Verify the application is running:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

3. Access your application at https://yourdomain.com

## Maintenance

### Updating the Application

1. Pull the latest changes:
   ```bash
   cd /opt/portfolio
   git pull
   ```

2. Redeploy:
   ```bash
   ./scripts/deploy.sh
   ```

### Backup and Restore

1. Backup the database:
   ```bash
   docker-compose exec postgres pg_dump -U postgres -d portfolio > backup.sql
   ```

2. Restore the database:
   ```bash
   cat backup.sql | docker-compose exec -T postgres psql -U postgres -d portfolio
   ```

### Monitoring

1. View application logs:
   ```bash
   docker-compose logs -f app
   ```

2. Check container status:
   ```bash
   docker-compose ps
   ```

## Troubleshooting

### Database Connection Issues

1. Check database container is running:
   ```bash
   docker-compose ps postgres
   ```

2. Verify database credentials in `.env` file:
   ```bash
   nano .env
   ```

3. Connect to database manually:
   ```bash
   docker-compose exec postgres psql -U postgres -d portfolio
   ```

### Nginx SSL Issues

1. Verify SSL certificates are correctly placed:
   ```bash
   ls -la nginx/ssl/
   ```

2. Check Nginx configuration:
   ```bash
   docker-compose exec nginx nginx -t
   ```

3. Renew SSL certificates:
   ```bash
   sudo certbot renew
   ```

### Application Not Starting

1. Check application logs:
   ```bash
   docker-compose logs app
   ```

2. Verify all required environment variables are set in `.env`

3. Rebuild the application container:
   ```bash
   docker-compose build --no-cache app
   docker-compose up -d
   ```

## Support

For assistance with deployment issues, please contact:
- Email: me@alassiri.nl