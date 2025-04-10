#!/bin/bash

# Server setup script for Oracle Cloud VM
# Run this script with sudo on a fresh Ubuntu installation

# Colors for console output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting server setup for Portfolio application...${NC}"

# Check if running as root/sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Error: Please run as root or with sudo.${NC}"
  exit 1
fi

# Update system
echo -e "${GREEN}Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# Install prerequisites
echo -e "${GREEN}Installing prerequisites...${NC}"
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw \
    nginx \
    certbot \
    python3-certbot-nginx

# Set up firewall
echo -e "${GREEN}Setting up firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5000/tcp
ufw --force enable

# Install Docker
echo -e "${GREEN}Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $SUDO_USER

# Install Docker Compose
echo -e "${GREEN}Installing Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create directories
echo -e "${GREEN}Creating project directories...${NC}"
mkdir -p /opt/portfolio
mkdir -p /opt/portfolio/nginx/ssl
chown -R $SUDO_USER:$SUDO_USER /opt/portfolio

echo -e "${GREEN}Server setup completed successfully!${NC}"
echo -e "Next steps:"
echo -e "1. Clone your repository to /opt/portfolio"
echo -e "2. Configure SSL certificates with Let's Encrypt:"
echo -e "   certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo -e "3. Copy certificates to the nginx/ssl directory"
echo -e "4. Create a .env file from .env.example and update values"
echo -e "5. Run the deployment script: ./scripts/deploy.sh"