#!/bin/bash

# Deploy FlowForge AI with Docker
echo "🚀 Deploying FlowForge AI with Docker..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "📋 Please create .env.local with required environment variables:"
    echo "   GEMINI_API_KEY=your_api_key_here"
    exit 1
fi

# Load environment variables
set -a
source .env.local
set +a

# Build and start with Docker Compose
echo "🔨 Building Docker image..."
docker-compose build

echo "🏃 Starting application..."
docker-compose up -d

echo "✅ Deployment complete!"
echo "🌐 Application is running at: http://localhost:3000"
echo "📊 Check status: docker-compose ps"
echo "📋 View logs: docker-compose logs -f"
