#!/bin/bash
# This script automates the cleanup of original UI component files
# after migration to the shared directory structure

# Set up error handling
set -e
trap 'echo "Error occurred. Exiting..."; exit 1' ERR

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Components to remove
COMPONENTS=(
  "button"
  "input"
  "textarea"
  "checkbox"
  "select"
  "slider"
  "label"
  "card"
  "table"
  "tabs"
  "dialog"
  "popover"
  "tooltip"
  "badge"
)

# Step 1: Verify imports
echo -e "${YELLOW}Step 1: Verifying imports...${NC}"
npx ts-node scripts/verify-imports.ts
if [ $? -ne 0 ]; then
  echo -e "${RED}Import verification failed. Please update all imports before proceeding.${NC}"
  exit 1
fi
echo -e "${GREEN}Import verification passed.${NC}"

# Step 2: Create backup
echo -e "${YELLOW}Step 2: Creating backup...${NC}"
BACKUP_DIR="backup/components/ui"
mkdir -p $BACKUP_DIR
cp components/ui/*.tsx $BACKUP_DIR/
echo -e "${GREEN}Backup created at $BACKUP_DIR${NC}"

# Step 3: Remove original component files
echo -e "${YELLOW}Step 3: Removing original component files...${NC}"
for component in "${COMPONENTS[@]}"; do
  COMPONENT_PATH="components/ui/${component}.tsx"
  if [ -f "$COMPONENT_PATH" ]; then
    echo "Removing $COMPONENT_PATH"
    rm "$COMPONENT_PATH"
  else
    echo -e "${YELLOW}Warning: $COMPONENT_PATH not found${NC}"
  fi
done
echo -e "${GREEN}Original component files removed.${NC}"

# Step 4: Verify build
echo -e "${YELLOW}Step 4: Verifying build...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Restoring from backup...${NC}"
  cp -r $BACKUP_DIR/* components/ui/
  exit 1
fi
echo -e "${GREEN}Build verification passed.${NC}"

# Step 5: Run tests
echo -e "${YELLOW}Step 5: Running tests...${NC}"
npm test
if [ $? -ne 0 ]; then
  echo -e "${RED}Tests failed. Restoring from backup...${NC}"
  cp -r $BACKUP_DIR/* components/ui/
  exit 1
fi
echo -e "${GREEN}Tests passed.${NC}"

echo -e "${GREEN}Cleanup completed successfully!${NC}"
echo "Next steps:"
echo "1. Commit the changes"
echo "2. Deploy to staging for final verification"
echo "3. Update documentation"

