FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install PostgreSQL client for health checks
RUN apk add --no-cache postgresql-client

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Make entrypoint script executable
RUN chmod +x scripts/docker-entrypoint.sh

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=5000

# Use entrypoint script
ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]