FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["npm", "run", "start"]