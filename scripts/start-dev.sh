#!/bin/bash

# Kill any existing processes using ports 3000-3002
echo "Killing existing processes on ports 3000-3002..."
pkill -f "next dev" || true
lsof -ti :3000-3002 | xargs kill -9 2>/dev/null || true

# Wait a moment for ports to be released
sleep 2

# Start the development servers
echo "Starting development servers..."
cd /Users/andrewscales/Development/warehouse-platform-turbo
pnpm dev

# Keep the script running
wait 