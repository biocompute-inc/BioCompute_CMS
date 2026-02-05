#!/bin/bash

# BioCompute Admin Portal - Quick Deploy Script
# This script automates the deployment process

set -e

echo "🚀 BioCompute Admin Portal - Deployment Script"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production file not found!"
    echo "📝 Creating from example..."
    cp .env.production.example .env.production
    echo "✅ Created .env.production"
    echo "⚠️  Please edit .env.production with your secure credentials before running again."
    exit 1
fi

# Load environment variables
source .env.production

# Validate required environment variables
if [ -z "$POSTGRES_USER" ] || [ "$POSTGRES_USER" = "your_secure_username" ]; then
    echo "❌ Please set POSTGRES_USER in .env.production"
    exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "your_secure_password_min_16_chars" ]; then
    echo "❌ Please set POSTGRES_PASSWORD in .env.production"
    exit 1
fi

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your_jwt_secret_key_min_32_chars" ]; then
    echo "❌ Please set JWT_SECRET in .env.production"
    exit 1
fi

echo "✅ Environment variables validated"
echo ""

# Ask for deployment mode
echo "Select deployment mode:"
echo "1) Production (docker-compose.prod.yml)"
echo "2) Development (docker-compose.dev.yml)"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        COMPOSE_FILE="docker-compose.prod.yml"
        echo "📦 Deploying in PRODUCTION mode"
        ;;
    2)
        COMPOSE_FILE="docker-compose.dev.yml"
        echo "📦 Deploying in DEVELOPMENT mode"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🔨 Building Docker images..."
docker-compose -f $COMPOSE_FILE build

echo ""
echo "🗑️  Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

echo ""
echo "🚀 Starting containers..."
docker-compose -f $COMPOSE_FILE up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "📊 Container status:"
docker-compose -f $COMPOSE_FILE ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Quick commands:"
echo "   View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   Stop: docker-compose -f $COMPOSE_FILE down"
echo "   Restart: docker-compose -f $COMPOSE_FILE restart"
echo ""
echo "🌐 Access your application:"
if [ "$COMPOSE_FILE" = "docker-compose.prod.yml" ]; then
    echo "   http://your-server-ip"
else
    echo "   http://localhost:8001"
fi
echo ""
echo "🎉 Happy coding!"
