@echo off
echo ========================================
echo XML Schema Validator Pro - Setup Script
echo ========================================
echo.

echo Installing Node.js dependencies...
npm install

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Flask backend (Terminal 1):
echo    python app.py
echo.
echo 2. Start React frontend (Terminal 2):
echo    npm start
echo.
echo 3. Open your browser to:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo.
pause
