@echo off
echo 🚀 Deploying FlowForge AI with Docker...

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ Error: .env.local file not found!
    echo 📋 Please create .env.local with required environment variables:
    echo    GEMINI_API_KEY=your_api_key_here
    pause
    exit /b 1
)

REM Build and start with Docker Compose
echo 🔨 Building Docker image...
docker-compose build

echo 🏃 Starting application...
docker-compose up -d

echo ✅ Deployment complete!
echo 🌐 Application is running at: http://localhost:3000
echo 📊 Check status: docker-compose ps
echo 📋 View logs: docker-compose logs -f
pause
