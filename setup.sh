#!/bin/bash

# SafeTech Quick Start Script
# This script sets up the SafeTech platform locally

echo "🚀 SafeTech Platform - Quick Start"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js first."
  exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed."
  exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo "⚠️  Please update .env with your configuration"
fi

# Create uploads directories
echo ""
echo "📁 Creating upload directories..."
mkdir -p uploads/receipts
mkdir -p uploads/claims

# Check MongoDB connection
echo ""
echo "🔍 Checking MongoDB..."
if ! mongod --version &> /dev/null; then
  echo "⚠️  MongoDB is not installed. Install it or use MongoDB Atlas."
  echo "   Download: https://www.mongodb.com/try/download/community"
else
  echo "✅ MongoDB found: $(mongod --version)"
  echo ""
  echo "💡 Make sure MongoDB is running before starting the app:"
  echo "   mongod"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with your settings"
echo "2. Start MongoDB: mongod"
echo "3. Start the application:"
echo "   npm run dev (development)"
echo "   npm start (production)"
echo ""
echo "App will be available at: http://localhost:3000"
