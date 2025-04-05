import fs from "fs"
import glob from "glob"

// Regular expressions to match hardcoded colors
const colorRegexes = [
  /#[0-9A-Fa-f]{3,8}/g, // Hex colors: #fff, #ffffff, #ffffffff
  /rgba?$$[^)]+$$/g, // RGB/RGBA colors: rgb(255, 255, 255), rgba(255, 255, 255, 0.5)
  /hsla?$$[^)]+$$/g, // HSL/HSLA colors: hsl(0, 0%, 100%), hsla(0, 0%, 100%, 0.5)
  /bg-\[#[^\]]+\]/g, // Tailwind arbitrary values: bg-[#ffffff]
  /text-\[#[^\]]+\]/g, // Tailwind arbitrary values: text-[#ffffff]
  /border-\[#[^\]]+\]/g, // Tailwind arbitrary values: border-[#ffffff]
]

// Tailwind color classes to look for
const tailwindColorClasses = [
  /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{1,3}/g,
  /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{1,3}/g,
  /border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{1,3}/g,
]

// File patterns to search
const filePatterns = ["**/*.tsx", "**/*.jsx", "**/*.ts", "**/*.js", "**/*.css", "**/*.scss"]

// Directories to exclude
const excludePatterns = ["node_modules/**", ".next/**", "out/**", "build/**", "dist/**"]

// Find all matching files
const files = filePatterns.flatMap((pattern) => glob.sync(pattern, { ignore: excludePatterns }))

// Results object
const results: Record<
  string,
  {
    hardcodedColors: string[]
    tailwindColors: string[]
    suggestions: Record<string, string>
  }
> = {}

// Process each file
files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8")

  // Find hardcoded colors
  const hardcodedColors = colorRegexes.flatMap((regex) => {
    const matches = content.match(regex) || []
    return matches
  })

  // Find Tailwind color classes
  const tailwindColors = tailwindColorClasses.flatMap((regex) => {
    const matches = content.match(regex) || []
    return matches
  })

  // Only add to results if we found something
  if (hardcodedColors.length > 0 || tailwindColors.length > 0) {
    // Generate suggestions
    const suggestions: Record<string, string> = {}

    // For hardcoded colors
    hardcodedColors.forEach((color) => {
      // This is a simplified suggestion logic - in a real implementation,
      // you would want to analyze the color and suggest the closest CSS variable
      if (color.startsWith("#")) {
        suggestions[color] = "Use CSS variable: var(--primary) or Tailwind class: bg-primary"
      } else if (color.startsWith("rgb")) {
        suggestions[color] = "Use CSS variable: hsl(var(--primary)) or Tailwind class: bg-primary"
      }
    })

    // For Tailwind colors
    tailwindColors.forEach((colorClass) => {
      if (colorClass.startsWith("bg-")) {
        suggestions[colorClass] = "Use Tailwind class: bg-primary or bg-secondary, etc."
      } else if (colorClass.startsWith("text-")) {
        suggestions[colorClass] = "Use Tailwind class: text-primary-foreground or text-secondary-foreground, etc."
      } else if (colorClass.startsWith("border-")) {
        suggestions[colorClass] = "Use Tailwind class: border-border or border-primary, etc."
      }
    })

    results[file] = {
      hardcodedColors: [...new Set(hardcodedColors)],
      tailwindColors: [...new Set(tailwindColors)],
      suggestions,
    }
  }
})

// Generate report
let report = "# Hardcoded Colors Report\n\n"

Object.entries(results).forEach(([file, { hardcodedColors, tailwindColors, suggestions }]) => {
  report += `## ${file}\n\n`

  if (hardcodedColors.length > 0) {
    report += "### Hardcoded Colors\n\n"
    hardcodedColors.forEach((color) => {
      report += `- \`${color}\` → ${suggestions[color] || "Consider using a CSS variable"}\n`
    })
    report += "\n"
  }

  if (tailwindColors.length > 0) {
    report += "### Tailwind Color Classes\n\n"
    tailwindColors.forEach((colorClass) => {
      report += `- \`${colorClass}\` → ${suggestions[colorClass] || "Consider using a theme color"}\n`
    })
    report += "\n"
  }
})

// Write report to file
fs.writeFileSync("hardcoded-colors-report.md", report)

console.log(`Found ${Object.keys(results).length} files with hardcoded colors or Tailwind color classes.`)
console.log("Report written to hardcoded-colors-report.md")

