#!/bin/bash

# Kill any existing processes on port 3003
lsof -ti:3003 | xargs -r kill -9 2>/dev/null || true

# Set environment variables
export PORT=3003
export BROWSER=none

# Start the frontend
echo "Starting frontend on port 3003..."
npm start