# Multi-stage build for the Portfolio application

# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:client

# Stage 2: Build the backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY --from=frontend-builder /app/client/dist ./client/dist
RUN npm run build:server

# Stage 3: Production image
FROM node:18-alpine
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=frontend-builder /app/client/dist ./client/dist

# Copy required scripts and configuration
COPY scripts/prod-server.js ./scripts/
COPY ecosystem.config.js ./.env.production.sample ./

# Install PM2 globally
RUN npm install -g pm2

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the application port
EXPOSE 5000

# Start the application with PM2
CMD ["pm2-runtime", "ecosystem.config.js"]