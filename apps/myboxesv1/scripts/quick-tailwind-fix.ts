/**
 * Quick Tailwind Fix
 *
 * This script performs quick fixes to make your Tailwind usage more compatible with NX.
 * It focuses on the most critical issues without requiring a full migration.
 */

import * as fs from "fs"
import * as glob from "glob"

console.log("Starting Quick Tailwind Fix...")

// Find all JS/TS/JSX/TSX files
const files = glob.sync("**/*.{js,ts,jsx,tsx}", {
  ignore: ["node_modules/**", ".next/**", "out/**", "build/**", "scripts/**"],
})

console.log(`Found ${files.length} files to process`)

// Process each file
let filesModified = 0
let inlineStylesReplaced = 0

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8")
  let modified = false

  // Simple replacement of common inline styles with Tailwind classes
  // This is a very basic implementation - a real version would be more sophisticated

  // Replace background colors
  let newContent = content.replace(/style=\{.*?backgroundColor:\s*["']#3b82f6["'].*?\}/g, 'className="bg-primary"')

  if (newContent !== content) {
    modified = true
    inlineStylesReplaced++
  }

  // Replace text colors
  content = newContent
  newContent = content.replace(/style=\{.*?color:\s*["']#ffffff["'].*?\}/g, 'className="text-primary-foreground"')

  if (newContent !== content) {
    modified = true
    inlineStylesReplaced++
  }

  // Replace more complex inline styles with combined Tailwind classes
  content = newContent
  newContent = content.replace(
    /style=\{.*?display:\s*["']flex["'].*?alignItems:\s*["']center["'].*?justifyContent:\s*["']center["'].*?\}/g,
    'className="flex items-center justify-center"',
  )

  if (newContent !== content) {
    modified = true
    inlineStylesReplaced++
  }

  // Save the file if modified
  if (modified) {
    fs.writeFileSync(file, newContent)
    filesModified++
    console.log(`Modified ${file}`)
  }
})

console.log(`
Quick Tailwind Fix complete!
- Files modified: ${filesModified}
- Inline styles replaced: ${inlineStylesReplaced}

Next steps:
1. Review the changes to ensure they work as expected
2. Run your application to test the changes
3. Continue with manual cleanup of more complex cases
`)

