#!/bin/bash

# Health Check Script for Portfolio Application
# This script checks if all components of the application are working properly

set -e

# Set defaults
HOST="${1:-localhost}"
PORT="${2:-5000}"
TIMEOUT=10

echo "======================================================"
echo "Portfolio Application Health Check"
echo "======================================================"
echo "Target: $HOST:$PORT"
echo "Timeout: ${TIMEOUT}s"
echo "======================================================"

# Check if all Docker containers are running
echo "Checking Docker containers..."
if ! docker-compose ps | grep -q "Up"; then
  echo "❌ ERROR: No containers are running"
  docker-compose ps
  exit 1
fi

# Check if web server is responding
echo "Checking web server..."
if ! curl -s --head --fail --max-time $TIMEOUT "http://$HOST:$PORT/"; then
  echo "❌ ERROR: Web server is not responding"
  exit 1
fi
echo "✅ Web server is responding"

# Check API endpoints
echo "Checking API endpoints..."
if ! curl -s --fail --max-time $TIMEOUT "http://$HOST:$PORT/api/settings" > /dev/null; then
  echo "❌ ERROR: API endpoint /api/settings is not working"
  exit 1
fi
echo "✅ API endpoints are working"

# Check database connection via API
echo "Checking database connection..."
if ! curl -s --fail --max-time $TIMEOUT "http://$HOST:$PORT/api/projects/published" > /dev/null; then
  echo "❌ ERROR: Database connection or query failed"
  exit 1
fi
echo "✅ Database connection is working"

# Check OpenAI API key (if chatbot is used)
if [ -n "$OPENAI_API_KEY" ]; then
  echo "Checking OpenAI API key..."
  # This is just a check to see if the environment variable is set
  FIRST_CHAR=$(echo $OPENAI_API_KEY | cut -c1-3)
  if [ "$FIRST_CHAR" != "sk-" ]; then
    echo "⚠️ WARNING: OpenAI API key may not be properly formatted"
  else
    echo "✅ OpenAI API key is present and properly formatted"
  fi
else
  echo "⚠️ WARNING: OpenAI API key is not set (chatbot may not work)"
fi

echo "======================================================"
echo "✅ All health checks passed!"
echo "======================================================"

exit 0