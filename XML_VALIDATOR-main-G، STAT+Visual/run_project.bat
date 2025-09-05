@echo off
title XML Schema Validator Pro - Project Runner
color 0A

echo ========================================
echo XML Schema Validator Pro - Project Runner
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and add it to PATH
    pause
    exit /b 1
) else (
    echo ✅ Python found
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 16+ and add it to PATH
    pause
    exit /b 1
) else (
    echo ✅ Node.js found
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    echo Please install npm and add it to PATH
    pause
    exit /b 1
) else (
    echo ✅ npm found
)

echo.
echo ========================================
echo Installing Dependencies...
echo ========================================

REM Install Python dependencies
echo Installing Python dependencies...
pip install flask xmlschema >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    echo Trying with pip3...
    pip3 install flask xmlschema >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Python dependencies with pip3
        pause
        exit /b 1
    )
)
echo ✅ Python dependencies installed

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✅ Node.js dependencies installed

echo.
echo ========================================
echo Starting the Application...
echo ========================================
echo.

REM Create a temporary batch file to run Flask in background
echo @echo off > temp_flask.bat
echo title Flask Backend - Port 5000 >> temp_flask.bat
echo color 0B >> temp_flask.bat
echo echo Starting Flask backend on port 5000... >> temp_flask.bat
echo echo. >> temp_flask.bat
echo python app.py >> temp_flask.bat
echo pause >> temp_flask.bat

REM Create a temporary batch file to run React in background
echo @echo off > temp_react.bat
echo title React Frontend - Port 3000 >> temp_react.bat
echo color 0E >> temp_react.bat
echo echo Starting React frontend on port 3000... >> temp_react.bat
echo echo. >> temp_react.bat
echo npm start >> temp_react.bat
echo pause >> temp_react.bat

echo 🚀 Starting Flask Backend (Port 5000)...
start "Flask Backend" temp_flask.bat

REM Wait a moment for Flask to start
timeout /t 3 /nobreak >nul

echo 🚀 Starting React Frontend (Port 3000)...
start "React Frontend" temp_react.bat

echo.
echo ========================================
echo 🎉 Application Started Successfully!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo 📋 Both servers are now running in separate windows
echo 💡 Keep these windows open while using the application
echo.
echo 🚪 To stop the application, close the Flask and React windows
echo.
echo Press any key to open the frontend in your browser...
pause >nul

REM Open the frontend in the default browser
start http://localhost:3000

echo.
echo 🌐 Frontend opened in your browser!
echo.
echo ========================================
echo Project Status:
echo ========================================
echo.
echo ✅ Dependencies installed
echo ✅ Flask backend started (Port 5000)
echo ✅ React frontend started (Port 3000)
echo ✅ Browser opened
echo.
echo 🎯 You can now use the XML Schema Validator!
echo.
echo Press any key to exit this launcher...
pause >nul

REM Clean up temporary files
del temp_flask.bat >nul 2>&1
del temp_react.bat >nul 2>&1

echo.
echo 👋 Launcher closed. Your application is still running!
echo Close the Flask and React windows to stop the servers.
echo.
pause
