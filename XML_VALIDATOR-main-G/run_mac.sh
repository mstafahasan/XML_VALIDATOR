#!/bin/bash

echo "🚀 Starting XML Schema Validator Pro on Mac..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install
pip3 install flask xmlschema

# Create templates directory if it doesn't exist
mkdir -p templates

# Start Flask backend on port 5001 (since 5000 might be used by ControlCenter)
echo "🔧 Starting Flask backend on port 5001..."
python3 -c "from app import app; app.run(debug=True, host='0.0.0.0', port=5001)" &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start React frontend
echo "⚛️  Starting React frontend on port 3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ XML Schema Validator Pro is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
