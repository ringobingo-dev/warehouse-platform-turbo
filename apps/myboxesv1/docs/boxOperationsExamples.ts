import { useBoxOperations } from "@/hooks/useBoxOperations"
import {
  formatBoxLocation,
  parseBoxLocation,
  isLocationOccupied,
  calculateRoomCapacity,
  findBoxesByCriteria,
  sortBoxesByPosition,
  generateBoxSummary,
} from "@/utils/boxUtils"
import type { Box } from "@/types/Box"

/**
 * This file contains examples of common usage patterns for the box operations.
 * These examples are for documentation purposes and are not meant to be executed directly.
 */

/**
 * Example 1: Basic setup and initialization
 *
 * This example shows how to initialize the useBoxOperations hook
 * and set up the basic state for the 3D box system.
 */
function example1() {
  // Initialize with empty arrays for boxes and log
  const { boxes, log, addBoxes, removeBoxes, reapplyLastRemoved, validateBoxData } = useBoxOperations([], [])

  // Room dimensions
  const rows = 10
  const columns = 10
  const levels = 5

  // Calculate room capacity
  const capacity = calculateRoomCapacity(rows, columns, levels)
  console.log(`Room capacity: ${capacity} boxes`)

  // Validate initial state
  validateBoxData(boxes, log)
}

/**
 * Example 2: Adding boxes
 *
 * This example demonstrates how to add boxes to the room
 * and handle potential errors.
 */
async function example2() {
  const { boxes, addBoxes } = useBoxOperations([], [])

  // Room dimensions
  const rows = 10
  const columns = 10
  const levels = 5
  const stackHeight = 3

  try {
    // Add 5 rectangular boxes for Customer 1
    const newBoxes = await addBoxes(
      "rectangle", // Box size
      "1", // Customer ID
      "1", // Starting row
      "5", // Box count
      "1", // Variety ID
      "1", // Grade ID
      "2023-01-01", // Loading date
      "#FF0000", // Box color
      rows,
      columns,
      levels,
      stackHeight,
    )

    console.log(`Successfully added ${newBoxes.length} boxes`)

    // Log the locations of the new boxes
    newBoxes.forEach((box) => {
      const location = formatBoxLocation(box.row, box.column, box.level)
      console.log(`Box added at ${location}`)
    })
  } catch (error) {
    console.error("Failed to add boxes:", error instanceof Error ? error.message : error)
  }
}

/**
 * Example 3: Removing boxes
 *
 * This example shows how to remove boxes based on specific criteria
 * and handle the results.
 */
function example3() {
  // Assume we have some boxes already in the room
  const { boxes, removeBoxes } = useBoxOperations(/* existing boxes */, [])

  try {
    // Remove 3 rectangular boxes for Customer 1, Variety 1, Grade 1
    const removedBoxes = removeBoxes(
      "1", // Customer ID
      "1", // Variety ID
      "1", // Grade ID
      "3", // Box count to remove
      "rectangle", // Box size
      "#FF0000", // Box color
    )

    console.log(`Successfully removed ${removedBoxes.length} boxes`)

    // Log the locations of the removed boxes
    removedBoxes.forEach((box) => {
      const location = formatBoxLocation(box.row, box.column, box.level)
      console.log(`Box removed from ${location}`)
    })
  } catch (error) {
    console.error("Failed to remove boxes:", error instanceof Error ? error.message : error)
  }
}

/**
 * Example 4: Reapplying removed boxes
 *
 * This example demonstrates how to reapply the last batch of removed boxes
 * and handle potential errors.
 */
function example4() {
  const { reapplyLastRemoved } = useBoxOperations(/* existing boxes */, /* existing log */)

  // Room dimensions
  const columns = 10
  const rows = 10

  try {
    // Reapply the last removed boxes
    const reappliedBoxes = reapplyLastRemoved(columns, rows)

    console.log(`Successfully reapplied ${reappliedBoxes.length} boxes`)

    // Log the locations of the reapplied boxes
    reappliedBoxes.forEach((box) => {
      const location = formatBoxLocation(box.row, box.column, box.level)
      console.log(`Box reapplied at ${location}`)
    })
  } catch (error) {
    console.error("Failed to reapply boxes:", error instanceof Error ? error.message : error)

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("not a removal")) {
        console.log("The last action was not a removal. Nothing to reapply.")
      } else if (error.message.includes("No boxes")) {
        console.log("There are no previous operations in the log.")
      } else if (error.message.includes("space is already occupied")) {
        console.log("Cannot reapply because some spaces are already occupied.")
      }
    }
  }
}

/**
 * Example 5: Working with box locations
 *
 * This example shows how to work with box locations,
 * including parsing, formatting, and checking occupancy.
 */
function example5() {
  const { boxes } = useBoxOperations(/* existing boxes */, [])

  // Format a box location
  const locationString = formatBoxLocation(1, 2, 3)
  console.log(`Formatted location: ${locationString}`) // "R1C2L3"

  // Parse a box location
  const location = "R1C2L3"
  const coordinates = parseBoxLocation(location)
  if (coordinates) {
    const [row, column, level] = coordinates
    console.log(`Parsed coordinates - Row: ${row}, Column: ${column}, Level: ${level}`)
  }

  // Check if a location is occupied
  if (coordinates) {
    const [row, column, level] = coordinates
    const isOccupied = isLocationOccupied(boxes, row, column, level)
    console.log(`Location ${location} is ${isOccupied ? "occupied" : "available"}`)
  }
}

/**
 * Example 6: Finding and sorting boxes
 *
 * This example demonstrates how to find boxes matching specific criteria
 * and sort them in different ways.
 */
function example6() {
  const { boxes } = useBoxOperations(/* existing boxes */, [])

  // Find all boxes for a specific customer
  const customerBoxes = findBoxesByCriteria(boxes, { customerName: "Customer A" })
  console.log(`Found ${customerBoxes.length} boxes for Customer A`)

  // Find boxes with multiple criteria
  const matchingBoxes = findBoxesByCriteria(boxes, {
    customerName: "Customer A",
    varietyName: "Variety X",
    size: "rectangle",
  })
  console.log(`Found ${matchingBoxes.length} rectangular boxes of Variety X for Customer A`)

  // Sort boxes from top to bottom (highest level first)
  const topDownBoxes = sortBoxesByPosition(boxes, { levelOrder: "desc" })
  console.log("Boxes sorted from top to bottom:")
  topDownBoxes.slice(0, 5).forEach((box) => {
    console.log(`Box at R${box.row}C${box.column}L${box.level}`)
  })

  // Sort boxes for removal (top down, back to front)
  const boxesForRemoval = sortBoxesByPosition(boxes, {
    levelOrder: "desc",
    rowOrder: "desc",
    columnOrder: "desc",
  })
  console.log("Boxes sorted for removal (top down, back to front):")
  boxesForRemoval.slice(0, 5).forEach((box) => {
    console.log(`Box at R${box.row}C${box.column}L${box.level}`)
  })
}

/**
 * Example 7: Generating box summaries
 *
 * This example shows how to generate and use summaries of the boxes
 * in the room, grouped by customer, variety, and grade.
 */
function example7() {
  const { boxes } = useBoxOperations(/* existing boxes */, [])

  // Generate a summary of all boxes
  const summary = generateBoxSummary(boxes)

  // Display the summary
  console.log("Box Summary:")
  Object.entries(summary).forEach(([customer, varieties]) => {
    console.log(`${customer}:`)
    Object.entries(varieties).forEach(([variety, grades]) => {
      console.log(`  ${variety}:`)
      Object.entries(grades).forEach(([grade, count]) => {
        console.log(`    ${grade}: ${count} boxes`)
      })
    })
  })

  // Calculate total boxes for a specific customer
  const customerName = "Customer A"
  let totalCustomerBoxes = 0
  if (summary[customerName]) {
    Object.values(summary[customerName]).forEach((grades) => {
      Object.values(grades).forEach((count) => {
        totalCustomerBoxes += count
      })
    })
  }
  console.log(`Total boxes for ${customerName}: ${totalCustomerBoxes}`)
}

/**
 * Example 8: Error handling patterns
 *
 * This example demonstrates common error handling patterns
 * when working with box operations.
 */
async function example8() {
  const { addBoxes, removeBoxes, reapplyLastRemoved } = useBoxOperations([], [])

  // Room dimensions
  const rows = 10
  const columns = 10
  const levels = 5
  const stackHeight = 3

  // Example 1: Try-catch with specific error handling
  try {
    await addBoxes("rectangle", "1", "1", "5", "1", "1", "2023-01-01", "#FF0000", rows, columns, levels, stackHeight)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Not enough space")) {
        console.error("The room is full or doesn't have enough space for these boxes")
      } else if (error.message.includes("Invalid customer")) {
        console.error("Please select a valid customer")
      } else {
        console.error("An unexpected error occurred:", error.message)
      }
    }
  }

  // Example 2: Using Promise.all to add multiple batches of boxes
  try {
    const promises = [
      addBoxes("rectangle", "1", "1", "3", "1", "1", "2023-01-01", "#FF0000", rows, columns, levels, stackHeight),
      addBoxes("square", "2", "2", "2", "2", "2", "2023-01-01", "#00FF00", rows, columns, levels, stackHeight),
      addBoxes("rectangle", "3", "3", "4", "3", "3", "2023-01-01", "#0000FF", rows, columns, levels, stackHeight),
    ]

    const results = await Promise.all(promises)
    const totalBoxesAdded = results.reduce((sum, boxes) => sum + boxes.length, 0)
    console.log(`Successfully added ${totalBoxesAdded} boxes in multiple batches`)
  } catch (error) {
    console.error("Failed to add one or more batches of boxes:", error)
  }

  // Example 3: Handling errors with a fallback
  let removedBoxes: Box[] = []
  try {
    removedBoxes = removeBoxes("1", "1", "1", "3", "rectangle", "#FF0000")
  } catch (error) {
    console.error("Failed to remove boxes with the specified criteria")
    console.log("Trying with a different criteria...")

    try {
      // Try with a different criteria as fallback
      removedBoxes = removeBoxes("2", "2", "2", "2", "square", "#00FF00")
    } catch (fallbackError) {
      console.error("Fallback removal also failed:", fallbackError)
    }
  }

  if (removedBoxes.length > 0) {
    console.log(`Successfully removed ${removedBoxes.length} boxes`)
  }
}

