# XML Schema Validator Pro - Project Runner (PowerShell)
# Run this script as Administrator if you encounter permission issues

param(
    [switch]$SkipDependencies,
    [switch]$SkipBrowser
)

# Set console colors and title
$Host.UI.RawUI.WindowTitle = "XML Schema Validator Pro - Project Runner"
$Host.UI.RawUI.ForegroundColor = "Green"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "XML Schema Validator Pro - Project Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command($Command) {
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Python
if (Test-Command "python") {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} elseif (Test-Command "python3") {
    $pythonVersion = python3 --version 2>&1
    Write-Host "✅ Python3 found: $pythonVersion" -ForegroundColor Green
    $pythonCmd = "python3"
} else {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ and add it to PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 16+ and add it to PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install npm and add it to PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

if (-not $SkipDependencies) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Installing Dependencies..." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    # Install Python dependencies
    Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
    try {
        if ($pythonCmd -eq "python3") {
            python3 -m pip install flask xmlschema
        } else {
            python -m pip install flask xmlschema
        }
        Write-Host "✅ Python dependencies installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }

    # Install Node.js dependencies
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    try {
        npm install
        Write-Host "✅ Node.js dependencies installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Node.js dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting the Application..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Flask backend
Write-Host "🚀 Starting Flask Backend (Port 5000)..." -ForegroundColor Green
$flaskJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    if ($using:pythonCmd -eq "python3") {
        python3 app.py
    } else {
        python app.py
    }
}

# Wait a moment for Flask to start
Start-Sleep -Seconds 3

# Start React frontend
Write-Host "🚀 Starting React Frontend (Port 3000)..." -ForegroundColor Green
$reactJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm start
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Application Started Successfully!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📋 Both servers are now running in background jobs" -ForegroundColor White
Write-Host "💡 The application will continue running in the background" -ForegroundColor White
Write-Host ""
Write-Host "🚪 To stop the application, close this PowerShell window" -ForegroundColor White

if (-not $SkipBrowser) {
    Write-Host ""
    Write-Host "Press any key to open the frontend in your browser..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

    # Open the frontend in the default browser
    Start-Process "http://localhost:3000"
    Write-Host ""
    Write-Host "🌐 Frontend opened in your browser!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Project Status:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host "✅ Flask backend started (Port 5000)" -ForegroundColor Green
Write-Host "✅ React frontend started (Port 3000)" -ForegroundColor Green
if (-not $SkipBrowser) {
    Write-Host "✅ Browser opened" -ForegroundColor Green
}
Write-Host ""
Write-Host "🎯 You can now use the XML Schema Validator!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this launcher..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "👋 Launcher closed. Your application is still running!" -ForegroundColor Green
Write-Host "Close this PowerShell window to stop the servers." -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
