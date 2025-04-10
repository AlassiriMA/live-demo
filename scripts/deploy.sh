#!/bin/bash

# This script deploys the application to the Oracle VPS
# Usage: ./deploy.sh

# Build the application
echo "Building application for production..."
npm run build

# Create deployment directory if it doesn't exist
mkdir -p dist

# Copy necessary files to the deployment directory
echo "Preparing files for deployment..."
cp -r server/dist dist/server
cp -r client/dist dist/client
cp package.json dist/
cp package-lock.json dist/
cp -r node_modules dist/node_modules
cp -r scripts/prod-server.js dist/

# Create a .env file for production with placeholders
cat > dist/.env << EOF
# Environment Variables for Production
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio

# JWT Secret for Authentication
JWT_SECRET=your-jwt-secret-here

# Application Port
PORT=5000

# Enable/Disable Compression and Rate Limiting
ENABLE_COMPRESSION=true
ENABLE_RATE_LIMIT=true

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
EOF

echo "Deployment package prepared."
echo "Next steps:"
echo "1. Transfer the dist/ directory to your Oracle VPS"
echo "2. SSH into your VPS and navigate to the application directory"
echo "3. Install production dependencies: npm install --production"
echo "4. Set up environment variables in .env file"
echo "5. Set up NGINX: ./scripts/setup-nginx.sh yourdomain.com"
echo "6. Start the application: npm run start:prod"