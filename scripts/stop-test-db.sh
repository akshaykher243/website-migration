#!/bin/bash

# Stop and remove PostgreSQL container
echo "Stopping and removing PostgreSQL test container..."
docker stop payload-test-db
docker rm payload-test-db

echo "PostgreSQL test database has been stopped and removed." 
