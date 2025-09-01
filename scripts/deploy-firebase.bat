@echo off
echo 🚀 Deploying FlowForge AI to Firebase...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ Error: .env.local file not found!
    echo 📋 Please create .env.local with required environment variables
    pause
    exit /b 1
)

REM Build the project
echo 🔨 Building project...
npm run build

REM Deploy to Firebase
echo 🚀 Deploying to Firebase...
firebase deploy

echo ✅ Deployment complete!
echo 🌐 Your app is now live on Firebase App Hosting
pause
