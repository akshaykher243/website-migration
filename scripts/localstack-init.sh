#!/bin/bash
set -e

# Source the environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Default values
MAX_RETRIES=30
RETRY_INTERVAL=2
AWS_ENDPOINT=${AWS_ENDPOINT:-"http://localhost:4566"}
BUCKET_NAME=${MEDIA_BUCKET_NAME:-"media"}
AWS_DEFAULT_REGION=${AWS_REGION:-"us-east-1"}

# Configure AWS CLI for LocalStack
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
aws configure set region $AWS_DEFAULT_REGION

echo "Waiting for LocalStack to be ready..."
retry_count=0
until aws --endpoint-url=$AWS_ENDPOINT s3 ls >/dev/null 2>&1; do
    retry_count=$((retry_count + 1))
    if [ $retry_count -gt $MAX_RETRIES ]; then
        echo "Error: LocalStack failed to start after $MAX_RETRIES retries"
        exit 1
    fi
    echo "Attempt $retry_count/$MAX_RETRIES: LocalStack not ready yet..."
    sleep $RETRY_INTERVAL
done

echo "LocalStack is ready!"

# Check if bucket already exists
if aws --endpoint-url=$AWS_ENDPOINT s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "Creating S3 bucket: $BUCKET_NAME"
    aws --endpoint-url=$AWS_ENDPOINT s3 mb "s3://$BUCKET_NAME"

    # Configure bucket for public access (for development only)
    aws --endpoint-url=$AWS_ENDPOINT s3api put-bucket-acl --bucket $BUCKET_NAME --acl public-read

    echo "S3 bucket created successfully"
else
    echo "Bucket $BUCKET_NAME already exists"
fi

# Verify bucket is accessible
if aws --endpoint-url=$AWS_ENDPOINT s3 ls "s3://$BUCKET_NAME" >/dev/null 2>&1; then
    echo "Bucket verification successful"
else
    echo "Error: Failed to verify bucket access"
    exit 1
fi

echo "LocalStack initialization completed successfully!"
