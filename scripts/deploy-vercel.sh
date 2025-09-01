#!/bin/bash

# Deploy FlowForge AI to Vercel
echo "🚀 Deploying FlowForge AI to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "📋 Please create .env.local with required environment variables"
    echo "⚠️  Don't forget to add them to Vercel Dashboard after deployment"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live on Vercel"
echo "⚙️  Don't forget to configure environment variables in Vercel Dashboard"
