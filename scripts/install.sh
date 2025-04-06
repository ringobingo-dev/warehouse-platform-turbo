#!/bin/bash

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the current timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_DIR="logs/install"
LOG_FILE="$LOG_DIR/install-$TIMESTAMP.log"
MONOREPO_ROOT=$(pwd)

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to log messages with color
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to log status
log_status() {
    local status=$1
    local message=$2
    case $status in
        "success") log "${GREEN}✓ $message${NC}" ;;
        "warning") log "${YELLOW}⚠ $message${NC}" ;;
        "error") log "${RED}✗ $message${NC}" ;;
        "info") log "${BLUE}ℹ $message${NC}" ;;
    esac
}

# Start installation process
log "${BLUE}=== Starting Installation Process ===${NC}"
log "Timestamp: $(date)"
log "Log file: $LOG_FILE"
log "Monorepo root: $MONOREPO_ROOT"

# Step 1: Clean up any existing installations
log_status "info" "Step 1: Cleaning up existing installations..."
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -f pnpm-lock.yaml
log_status "success" "Cleanup completed successfully"

# Step 2: Install dependencies
log_status "info" "Step 2: Installing dependencies..."
log "Running pnpm install..."
pnpm install | tee -a "$LOG_FILE"
if [ $? -eq 0 ]; then
    log_status "success" "Dependencies installed successfully"
else
    log_status "error" "Failed to install dependencies"
    exit 1
fi

# Step 3: Verify installations
log_status "info" "Step 3: Verifying installations..."
if [ -d "node_modules" ]; then
    log_status "success" "Root node_modules installed successfully"
else
    log_status "error" "Failed to install root node_modules"
    exit 1
fi

# Step 4: Check for any warnings or errors
log_status "info" "Step 4: Checking for warnings and errors..."
WARNINGS=$(grep -i "warn" "$LOG_FILE" | wc -l)
ERRORS=$(grep -i "error" "$LOG_FILE" | grep -v "Checking for warnings and errors" | wc -l)

if [ "$WARNINGS" -gt 0 ]; then
    log_status "warning" "Found $WARNINGS warnings in the installation log"
    log_status "info" "Warnings found:"
    grep -i "warn" "$LOG_FILE" | while read -r warning; do
        log_status "warning" "$warning"
    done
fi

if [ "$ERRORS" -gt 0 ]; then
    log_status "error" "Found $ERRORS errors in the installation log"
    log_status "info" "Errors found:"
    grep -i "error" "$LOG_FILE" | grep -v "Checking for warnings and errors" | while read -r error; do
        log_status "error" "$error"
    done
    exit 1
fi

# Step 5: Clean up existing processes on ports 3000-3002
log_status "info" "Step 5: Cleaning up existing processes on ports 3000-3002..."
pkill -f "next dev" || true
lsof -ti :3000-3002 | xargs kill -9 2>/dev/null || true
log_status "success" "Port cleanup completed"

# Add delay to ensure ports are fully released
log_status "info" "Waiting for ports to be fully released..."
sleep 5

# Verify ports are actually free
log_status "info" "Verifying ports are available..."
for port in 3000 3001 3002; do
    if lsof -i :$port > /dev/null 2>&1; then
        log_status "error" "Port $port is still in use after cleanup"
        exit 1
    else
        log_status "success" "Port $port is available"
    fi
done

# Step 6: Start development server
log_status "info" "Step 6: Starting development server..."
pnpm dev &
SERVER_PID=$!
log_status "success" "Server started with PID: $SERVER_PID"

# Step 7: Wait for server to be ready
log_status "info" "Step 7: Waiting for server to be ready..."
sleep 10  # Give the server time to start

# Step 8: Test server with curl
log_status "info" "Step 8: Testing server with curl..."
CURL_OUTPUT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$CURL_OUTPUT" -eq 200 ]; then
    log_status "success" "Server is responding correctly (HTTP 200)"
else
    log_status "error" "Server test failed (HTTP $CURL_OUTPUT)"
    kill $SERVER_PID
    exit 1
fi

# Step 9: Final status
log "${BLUE}=== Installation Process Complete ===${NC}"
log_status "success" "Log file: $LOG_FILE"
log_status "success" "Installation completed at: $(date)"
log_status "success" "Server is running at: http://localhost:3000"

# Make the script executable
chmod +x "$0" 