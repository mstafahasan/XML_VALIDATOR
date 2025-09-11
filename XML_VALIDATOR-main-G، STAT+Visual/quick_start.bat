@echo off
echo Starting XML Schema Validator Pro...
echo.
echo Starting Flask backend on port 5000...
start "Flask Backend" cmd /k "python app.py"
echo.
echo Starting React frontend on port 3000...
start "React Frontend" cmd /k "npm start"
echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to open frontend in browser...
pause >nul
start http://localhost:3000
echo Browser opened!
echo.
echo Keep the Flask and React windows open while using the app.
pause
