#!/bin/sh

# Production Docker entry point script
# This script handles startup tasks inside the Docker container

set -e

echo "Starting portfolio application in production mode..."

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is required"
    exit 1
fi

if [ -z "$SESSION_SECRET" ]; then
    echo "ERROR: SESSION_SECRET environment variable is required"
    exit 1
fi

# Wait for database to be ready
echo "Waiting for database to be ready..."
for i in $(seq 1 30); do
    if pg_isready -h postgres -p 5432 -U ${PGUSER:-postgres} > /dev/null 2>&1; then
        echo "Database is ready!"
        break
    fi
    echo "Waiting for database... $i/30"
    sleep 1
done

if ! pg_isready -h postgres -p 5432 -U ${PGUSER:-postgres} > /dev/null 2>&1; then
    echo "ERROR: Database is not available"
    exit 1
fi

# Run database migrations if needed
echo "Running database migrations..."
npm run db:push

# Check if we need to seed the database (only on first run)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database with initial data..."
    # Seed users first
    node scripts/seed-admin.js
    
    # Seed categories
    node scripts/seed-project-categories.js
    node scripts/seed-book-categories.js
    
    # Seed main content
    node scripts/seed-projects.js
    node scripts/seed-settings.js
    
    # Mark seeding as complete
    echo "Database seeding completed!"
fi

# Optimize for production
echo "Optimizing application for production..."
# Clear unnecessary files
rm -rf .git .github .vscode

# Start the application
echo "Starting application..."
exec node dist/index.js