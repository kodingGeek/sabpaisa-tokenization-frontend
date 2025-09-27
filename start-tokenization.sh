#!/bin/bash

# Temporarily rename index files to use the simple version
mv src/index.tsx src/index.original.tsx 2>/dev/null || true
mv src/App.tsx src/App.original.tsx 2>/dev/null || true
cp src/index.simple.tsx src/index.tsx
cp src/App.simple.tsx src/App.tsx

# Set the API URL
export REACT_APP_API_URL=http://localhost:8082/api/v1

# Start the app
echo "Starting SabPaisa Tokenization UI..."
echo "Backend API: http://localhost:8082"
echo "Frontend will start on: http://localhost:3000"
echo ""

npm start