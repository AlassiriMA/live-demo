#!/bin/bash

# Server setup script for Oracle Cloud VM
# This script installs dependencies and configures the server for portfolio deployment

set -e

echo "========================================================================"
echo "Portfolio Server Setup Script for Oracle Cloud"
echo "========================================================================"
echo "This script will install Docker, Docker Compose, and other dependencies"
echo "========================================================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Update system packages
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    certbot \
    python3-certbot-nginx \
    nginx \
    git \
    ufw

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure firewall
echo "Configuring firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 5000
ufw --force enable

# Configure Docker to start on boot
echo "Configuring Docker to start on boot..."
systemctl enable docker
systemctl start docker

# Create directories
echo "Creating directories..."
mkdir -p /opt/portfolio/nginx/ssl
mkdir -p /opt/portfolio/nginx/www
mkdir -p /opt/portfolio/data

# Add current user to docker group
echo "Adding current user to docker group..."
usermod -aG docker $SUDO_USER

echo "========================================================================"
echo "Server setup complete!"
echo "========================================================================"
echo "Next steps:"
echo "1. Clone your repository to /opt/portfolio"
echo "2. Set up SSL certificates using certbot"
echo "3. Configure environment variables"
echo "4. Run the deployment script"
echo "========================================================================"