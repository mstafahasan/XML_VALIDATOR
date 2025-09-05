@echo off
echo 🚀 Deploying XML Validator to Railway...
echo.

echo 📦 Installing Railway CLI...
npm install -g @railway/cli

echo.
echo 🔐 Logging into Railway...
railway login

echo.
echo 🚀 Deploying to Railway...
railway up

echo.
echo ✅ Deployment complete!
echo 🌐 Your app will be available at: https://your-project-name.railway.app
echo.
pause
