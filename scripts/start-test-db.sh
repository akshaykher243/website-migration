#!/bin/bash

# Remove any existing test container
echo "Removing any existing test container..."
docker rm -f payload-test-db 2>/dev/null || true

# Start PostgreSQL container for testing
echo "Starting PostgreSQL container for testing..."
docker run --name payload-test-db \
  -e POSTGRES_DB=payload_test \
  -e POSTGRES_USER=payload \
  -e POSTGRES_PASSWORD=payload \
  -p 5434:5432 \
  -d postgres:14-alpine

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "PostgreSQL test database is ready!" 
