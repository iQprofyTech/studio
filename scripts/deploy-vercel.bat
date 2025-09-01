@echo off
echo 🚀 Deploying FlowForge AI to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ Error: .env.local file not found!
    echo 📋 Please create .env.local with required environment variables
    echo ⚠️  Don't forget to add them to Vercel Dashboard after deployment
    pause
    exit /b 1
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🌐 Your app is now live on Vercel
echo ⚙️  Don't forget to configure environment variables in Vercel Dashboard
pause
