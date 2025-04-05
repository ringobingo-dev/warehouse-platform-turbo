#!/bin/bash

# Simple CSS Cleanup Script
# This script performs the minimal necessary changes for NX compatibility

echo "Starting simple CSS cleanup for NX compatibility..."

# Create globals.css if it doesn't exist
if [ ! -f styles/globals.css ]; then
  mkdir -p styles
  echo "Creating styles/globals.css..."
  
  # Find existing CSS files
  CSS_FILES=$(find . -name "*.css" -not -path "*/node_modules/*" -not -path "*/.next/*")
  
  # Create basic globals.css
  cat > styles/globals.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
  }
}

/* Global styles */
@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
EOL

  echo "Created styles/globals.css"
else
  echo "styles/globals.css already exists, skipping..."
fi

# Update Tailwind config for NX compatibility
if [ -f tailwind.config.js ]; then
  echo "Backing up existing tailwind.config.js..."
  cp tailwind.config.js tailwind.config.js.bak
  
  echo "Updating tailwind.config.js for NX compatibility..."
  cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // For NX monorepo compatibility
    "../../libs/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
  plugins: [],
}
EOL
  echo "Updated tailwind.config.js"
else
  echo "tailwind.config.js not found, skipping..."
fi

echo "Simple CSS cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Import styles/globals.css in your main layout or app file"
echo "2. Gradually migrate component styles to use CSS variables"
echo "3. When ready for NX migration, update import paths"

