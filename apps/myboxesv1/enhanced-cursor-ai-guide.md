# Enhanced CSS & Tailwind Cleanup Implementation Guide for Cursor AI

This comprehensive guide provides detailed technical specifications and step-by-step instructions for implementing the CSS and Tailwind cleanup in preparation for NX monorepo migration.

## 1. Project Analysis & Inventory

### 1.1 CSS File Inventory

First, create a complete inventory of all CSS files and their usage:

```typescript
// scripts/css-inventory.ts
import fs from 'fs';
import path from 'path';
import glob from 'glob';

interface CssFile {
  path: string;
  imports: string[];
  selectors: string[];
  variables: Record<string, string>;
  tailwindClasses: string[];
  hardcodedColors: string[];
}

// Find all CSS files
const cssFiles = glob.sync('**/*.css', {
  ignore: ['node_modules/**', '.next/**', 'out/**', 'build/**']
});

const inventory: Record<string, CssFile> = {};

cssFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract imports
  const imports = content.match(/@import\s+['"](.+)['"]/g) || [];
  
  // Extract CSS selectors
  const selectors = content.match(/[.#][a-zA-Z0-9_-]+\s*{/g) || [];
  
  // Extract CSS variables
  const variableRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
  const variables: Record<string, string> = {};
  let match;
  while ((match = variableRegex.exec(content)) !== null) {
    variables[match[1]] = match[2].trim();
  }
  
  // Extract Tailwind classes
  const tailwindClasses = content.match(/@apply\s+([^;]+);/g) || [];
  
  // Extract hardcoded colors
  const colorRegex = /#[0-9A-Fa-f]{3,8}|rgba?$$[^)]+$$|hsla?$$[^)]+$$/g;
  const hardcodedColors = content.match(colorRegex) || [];
  
  inventory[filePath] = {
    path: filePath,
    imports,
    selectors,
    variables,
    tailwindClasses,
    hardcodedColors
  };
});

// Write inventory to file
fs.writeFileSync('css-inventory.json', JSON.stringify(inventory, null, 2));
console.log(`CSS inventory created with ${Object.keys(inventory).length} files.`);

