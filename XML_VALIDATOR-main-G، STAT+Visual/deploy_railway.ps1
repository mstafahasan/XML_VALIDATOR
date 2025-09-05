Write-Host "🚀 Deploying XML Validator to Railway..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
npm install -g @railway/cli

Write-Host ""
Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
railway login

Write-Host ""
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your app will be available at: https://your-project-name.railway.app" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
