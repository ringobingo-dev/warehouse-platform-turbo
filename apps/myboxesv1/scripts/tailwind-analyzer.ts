/**
 * Tailwind Analyzer
 *
 * This script analyzes Tailwind usage in your codebase, identifies optimization
 * opportunities, and generates theme extension suggestions.
 */

import * as fs from "fs"
import * as glob from "glob"

// Define the report file path
const REPORT_FILE = "tailwind-analysis-report.md"

// Define the class pattern regex
const CLASS_PATTERN = /className=["'`]([^"'`]+)["'`]/g

// Define the inline style pattern regex
const INLINE_STYLE_PATTERN = /style=\{(\{[^}]+\})\}/g

// Define the color pattern regex (for hex, rgb, rgba, hsl, hsla)
const COLOR_PATTERN = /#[0-9a-f]{3,8}|rgba?$$[^)]+$$|hsla?$$[^)]+$$/gi

// Define common patterns that could be extracted to Tailwind
interface PatternDefinition {
  name: string
  regex: RegExp
  tailwindEquivalent: string
}

const COMMON_PATTERNS: PatternDefinition[] = [
  {
    name: "Flex Center",
    regex: /flex.*items-center.*justify-center/,
    tailwindEquivalent: "flex items-center justify-center",
  },
  {
    name: "Card Style",
    regex: /(?=.*rounded)(?=.*shadow)(?=.*bg-white)/,
    tailwindEquivalent: "rounded-lg shadow-md bg-white",
  },
  {
    name: "Button Base",
    regex: /(?=.*px-\d)(?=.*py-\d)(?=.*rounded)(?=.*font-\w+)/,
    tailwindEquivalent: "px-4 py-2 rounded font-medium",
  },
  {
    name: "Transition",
    regex: /transition.*duration-\d+/,
    tailwindEquivalent: "transition duration-200",
  },
  {
    name: "Hover Scale",
    regex: /hover:scale-\d+/,
    tailwindEquivalent: "hover:scale-105",
  },
]

// Define the analysis result type
interface AnalysisResult {
  totalFiles: number
  filesWithTailwind: number
  filesWithInlineStyles: number
  mostUsedClasses: Map<string, number>
  mostUsedColors: Map<string, number>
  commonPatterns: Map<string, number>
  optimizationSuggestions: string[]
}

// Analyze the codebase for Tailwind usage
function analyzeTailwind(): AnalysisResult {
  console.log("Analyzing Tailwind usage in the codebase...")

  const result: AnalysisResult = {
    totalFiles: 0,
    filesWithTailwind: 0,
    filesWithInlineStyles: 0,
    mostUsedClasses: new Map<string, number>(),
    mostUsedColors: new Map<string, number>(),
    commonPatterns: new Map<string, number>(),
    optimizationSuggestions: [],
  }

  // Find all JS/TS/JSX/TSX files
  const files = glob.sync("**/*.{js,ts,jsx,tsx}", {
    ignore: ["node_modules/**", ".next/**", "out/**", "build/**", "scripts/**"],
  })

  result.totalFiles = files.length

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8")

    // Check for Tailwind classes
    let hasTailwind = false
    let match

    while ((match = CLASS_PATTERN.exec(content)) !== null) {
      hasTailwind = true

      // Extract individual classes
      const classes = match[1].split(/\s+/)

      classes.forEach((cls) => {
        if (cls.trim()) {
          result.mostUsedClasses.set(cls.trim(), (result.mostUsedClasses.get(cls.trim()) || 0) + 1)
        }
      })

      // Check for common patterns
      COMMON_PATTERNS.forEach((pattern) => {
        if (pattern.regex.test(match[1])) {
          result.commonPatterns.set(pattern.name, (result.commonPatterns.get(pattern.name) || 0) + 1)
        }
      })
    }

    if (hasTailwind) {
      result.filesWithTailwind++
    }

    // Check for inline styles
    let hasInlineStyles = false
    let styleMatch

    while ((styleMatch = INLINE_STYLE_PATTERN.exec(content)) !== null) {
      hasInlineStyles = true

      // Extract colors from inline styles
      const styleContent = styleMatch[1]
      let colorMatch

      while ((colorMatch = COLOR_PATTERN.exec(styleContent)) !== null) {
        result.mostUsedColors.set(colorMatch[0], (result.mostUsedColors.get(colorMatch[0]) || 0) + 1)
      }
    }

    if (hasInlineStyles) {
      result.filesWithInlineStyles++

      // Add optimization suggestion for inline styles
      result.optimizationSuggestions.push(
        `File ${file} contains inline styles that could be replaced with Tailwind utilities.`,
      )
    }
  })

  // Generate optimization suggestions for common patterns
  result.commonPatterns.forEach((count, pattern) => {
    const patternDef = COMMON_PATTERNS.find((p) => p.name === pattern)

    if (patternDef && count > 5) {
      result.optimizationSuggestions.push(
        `Consider creating a custom utility for "${pattern}" (used ${count} times). Suggested Tailwind: "${patternDef.tailwindEquivalent}"`,
      )
    }
  })

  // Generate optimization suggestions for colors
  const sortedColors = [...result.mostUsedColors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)

  sortedColors.forEach(([color, count]) => {
    result.optimizationSuggestions.push(
      `Consider adding color "${color}" to your Tailwind theme (used ${count} times).`,
    )
  })

  return result
}

// Generate a report from the analysis result
function generateReport(result: AnalysisResult): void {
  console.log("Generating Tailwind analysis report...")

  // Sort the most used classes
  const sortedClasses = [...result.mostUsedClasses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)

  // Sort the most used colors
  const sortedColors = [...result.mostUsedColors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)

  // Sort the common patterns
  const sortedPatterns = [...result.commonPatterns.entries()].sort((a, b) => b[1] - a[1])

  const reportContent = `# Tailwind Analysis Report

## Summary

- Total files analyzed: ${result.totalFiles}
- Files with Tailwind classes: ${result.filesWithTailwind} (${Math.round((result.filesWithTailwind / result.totalFiles) * 100)}%)
- Files with inline styles: ${result.filesWithInlineStyles} (${Math.round((result.filesWithInlineStyles / result.totalFiles) * 100)}%)

## Most Used Tailwind Classes

${sortedClasses.map(([cls, count]) => `- \`${cls}\`: ${count} occurrences`).join("\n")}

## Most Used Colors in Inline Styles

${sortedColors.map(([color, count]) => `- \`${color}\`: ${count} occurrences`).join("\n")}

## Common Patterns

${sortedPatterns.map(([pattern, count]) => `- ${pattern}: ${count} occurrences`).join("\n")}

## Optimization Suggestions

${result.optimizationSuggestions.map((suggestion) => `- ${suggestion}`).join("\n")}

## Tailwind Theme Extension Suggestions

Based on the analysis, consider extending your Tailwind theme with the following:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${sortedColors.map(([color, _]) => `        // '${color.replace(/['"]/g, "")}': '${color.replace(/['"]/g, "")}',`).join("\n")}
      },
      // Consider adding custom utilities for common patterns
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
${sortedPatterns
  .slice(0, 5)
  .map(([pattern, _]) => {
    const patternDef = COMMON_PATTERNS.find((p) => p.name === pattern)
    return patternDef
      ? `        '.${pattern.toLowerCase().replace(/\s+/g, "-")}': {
          '@apply ${patternDef.tailwindEquivalent}': {},
        },`
      : ""
  })
  .join("\n")}
      };
      
      addUtilities(newUtilities);
    },
  ],
}
\`\`\`

## Next Steps

1. Review the optimization suggestions and implement the most impactful ones
2. Extend your Tailwind theme with the suggested colors
3. Create custom utilities for common patterns
4. Replace inline styles with Tailwind utilities
5. Run this analysis again after making changes to track progress
`

  fs.writeFileSync(REPORT_FILE, reportContent)
  console.log(`Report saved to ${REPORT_FILE}`)
}

// Main function
function main(): void {
  const result = analyzeTailwind()
  generateReport(result)

  console.log("\nAnalysis complete!")
  console.log(`Found ${result.filesWithTailwind} files with Tailwind classes`)
  console.log(`Found ${result.filesWithInlineStyles} files with inline styles`)
  console.log(`Generated ${result.optimizationSuggestions.length} optimization suggestions`)
  console.log(`Report saved to ${REPORT_FILE}`)
}

main()

