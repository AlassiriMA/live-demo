#!/bin/bash

# This script sets up NGINX for the portfolio application deployment
# It should be run on your Oracle VPS after cloning the repository

# Install NGINX if not already installed
if ! command -v nginx &> /dev/null; then
    echo "Installing NGINX..."
    sudo apt update
    sudo apt install -y nginx
else
    echo "NGINX is already installed."
fi

# Create NGINX configuration file
DOMAIN_NAME="$1"
if [ -z "$DOMAIN_NAME" ]; then
    echo "Please provide your domain name as an argument."
    echo "Usage: ./setup-nginx.sh yourdomain.com"
    exit 1
fi

# Create NGINX site configuration
cat > /tmp/portfolio-site.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN_NAME} www.${DOMAIN_NAME};

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Optimize asset caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        proxy_pass http://localhost:5000;
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }

    # For Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
}
EOF

sudo mv /tmp/portfolio-site.conf /etc/nginx/sites-available/portfolio-site.conf

# Enable the site
sudo ln -sf /etc/nginx/sites-available/portfolio-site.conf /etc/nginx/sites-enabled/

# Verify NGINX configuration
sudo nginx -t

# If configuration is valid, reload NGINX
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "NGINX configured successfully for ${DOMAIN_NAME}"
    
    # Set up SSL with Certbot
    echo "Now setting up SSL with Let's Encrypt..."
    
    # Install Certbot if not already installed
    if ! command -v certbot &> /dev/null; then
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Get and install SSL certificate
    sudo certbot --nginx -d ${DOMAIN_NAME} -d www.${DOMAIN_NAME}
    
    echo "SSL setup complete! Your site should now be accessible via HTTPS."
else
    echo "NGINX configuration failed. Please check the error message above."
fi

# Create a directory for logs
sudo mkdir -p /var/log/portfolio
sudo chown -R $USER:$USER /var/log/portfolio

echo "NGINX setup completed!"