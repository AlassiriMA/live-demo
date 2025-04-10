# Deployment Guide for Oracle VPS

This guide provides step-by-step instructions for deploying the Portfolio application to an Oracle VPS with NGINX and custom domain mapping.

## Prerequisites

- Oracle VPS with Ubuntu 20.04 or later
- SSH access to the VPS
- Domain name pointed to your VPS IP address
- Node.js 16+ installed on the VPS

## Step 1: Prepare the VPS

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Set Up PostgreSQL Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# In PostgreSQL shell, create a database and user
CREATE DATABASE portfolio;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
\q

# Edit pg_hba.conf to allow password authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Add or modify this line to allow password authentication
# host    all             all             127.0.0.1/32            md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Step 3: Clone and Set Up the Application

```bash
# Navigate to your home directory
cd ~

# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install --production

# Create .env file
cat > .env << EOF
# Environment Variables for Production
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://portfolio_user:your_secure_password@localhost:5432/portfolio

# JWT Secret for Authentication
JWT_SECRET=$(openssl rand -hex 32)

# Application Port
PORT=5000

# Enable/Disable Compression and Rate Limiting
ENABLE_COMPRESSION=true
ENABLE_RATE_LIMIT=true

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
EOF

# Initialize the database schema
npm run db:push
```

## Step 4: Set Up NGINX and SSL

Run the automated script:

```bash
# Make the script executable
chmod +x scripts/setup-nginx.sh

# Run the script with your domain name
./scripts/setup-nginx.sh yourdomain.com
```

Or manually configure NGINX:

```bash
# Install NGINX
sudo apt install -y nginx

# Create NGINX config file
sudo nano /etc/nginx/sites-available/portfolio.conf

# Add this configuration (replace yourdomain.com with your domain)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Optimize asset caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        proxy_pass http://localhost:5000;
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }
}

# Enable the site
sudo ln -sf /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/

# Remove default site if necessary
sudo rm -f /etc/nginx/sites-enabled/default

# Test NGINX configuration
sudo nginx -t

# If the test is successful, reload NGINX
sudo systemctl reload nginx
```

## Step 5: Set Up SSL with Let's Encrypt

```bash
# Install Certbot and the NGINX plugin
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts to set up SSL
```

## Step 6: Start the Application as a Service

### Using PM2:

```bash
# Start the application with PM2
pm2 start ecosystem.config.js --env production

# Make PM2 start on boot
pm2 startup
pm2 save
```

### Using systemd (alternative):

```bash
# Copy the service file
sudo cp scripts/portfolio.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable portfolio
sudo systemctl start portfolio

# Check status
sudo systemctl status portfolio
```

## Step 7: Verify Deployment

Visit your domain in a web browser to verify that the application is working correctly.

## Maintenance and Troubleshooting

### Viewing Logs

```bash
# PM2 logs
pm2 logs portfolio

# NGINX logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System service logs (if using systemd)
sudo journalctl -u portfolio -f
```

### Updating the Application

```bash
# Pull the latest changes
git pull

# Install dependencies (if needed)
npm install --production

# Rebuild (if necessary)
npm run build

# Restart the application
pm2 restart portfolio
# or 
sudo systemctl restart portfolio
```

### Backup Database

```bash
# Backup PostgreSQL database
pg_dump -h localhost -U portfolio_user -W -F c portfolio > portfolio_backup_$(date +%Y%m%d).dump

# Restore from backup if needed
pg_restore -h localhost -U portfolio_user -W -d portfolio portfolio_backup_YYYYMMDD.dump
```

## Security Best Practices

1. **Firewall Setup:** Configure a firewall to allow only necessary ports (80, 443, SSH).
   ```bash
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

2. **Secure SSH:** Disable password authentication and use key-based authentication only.

3. **Regular Updates:** Keep the system and applications updated.
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Monitor Logs:** Regularly check application and system logs for suspicious activity.

5. **Database Security:** Use strong passwords and restrict network access to the database.

6. **HTTPS Redirection:** Ensure all HTTP traffic is redirected to HTTPS.

7. **Rate Limiting:** Protect against brute force attacks (already configured in the application).

## Additional Optimizations

1. **Content Delivery Network (CDN):** Consider using a CDN for static assets.

2. **Caching:** Implement additional caching strategies for frequently accessed data.

3. **Database Optimization:** Regularly analyze and optimize database queries.

4. **Monitoring:** Set up monitoring tools like Prometheus and Grafana for real-time performance monitoring.

5. **Backup Automation:** Schedule regular automated backups of the database and application files.