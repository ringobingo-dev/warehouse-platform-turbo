import type { Box } from "@/types/Box"

/**
 * Formats a box location into a human-readable string.
 *
 * @param {number} row - The row coordinate (1-based index).
 * @param {number} column - The column coordinate (1-based index).
 * @param {number} level - The level coordinate (1-based index).
 * @returns {string} A formatted location string (e.g., "R1C2L3").
 *
 * @example
 * // Format a box location
 * const locationString = formatBoxLocation(1, 2, 3);
 * console.log(locationString); // "R1C2L3"
 */
export function formatBoxLocation(row: number, column: number, level: number): string {
  return `R${row}C${column}L${level}`
}

/**
 * Parses a box location string into its component coordinates.
 *
 * @param {string} location - The location string to parse (e.g., "R1C2L3").
 * @returns {[number, number, number] | null} The parsed coordinates as [row, column, level], or null if the format is invalid.
 *
 * @example
 * // Parse a box location string
 * const location = "R1C2L3";
 * const coordinates = parseBoxLocation(location);
 * if (coordinates) {
 *   const [row, column, level] = coordinates;
 *   console.log(`Row: ${row}, Column: ${column}, Level: ${level}`);
 * } else {
 *   console.error("Invalid location format");
 * }
 */
export function parseBoxLocation(location: string): [number, number, number] | null {
  const match = location.match(/R(\d+)C(\d+)L(\d+)/)
  if (!match) {
    return null
  }

  const [, rowStr, colStr, levelStr] = match
  const row = Number.parseInt(rowStr, 10)
  const col = Number.parseInt(colStr, 10)
  const level = Number.parseInt(levelStr, 10)

  if (isNaN(row) || isNaN(col) || isNaN(level)) {
    return null
  }

  return [row, col, level]
}

/**
 * Checks if a specific location in the room is occupied by a box.
 *
 * @param {Box[]} boxes - The array of boxes to check against.
 * @param {number} row - The row coordinate to check.
 * @param {number} column - The column coordinate to check.
 * @param {number} level - The level coordinate to check.
 * @returns {boolean} True if the location is occupied, false otherwise.
 *
 * @example
 * // Check if a location is occupied
 * const isOccupied = isLocationOccupied(boxes, 1, 2, 3);
 * if (isOccupied) {
 *   console.log("Cannot place a box at this location");
 * } else {
 *   console.log("Location is available for a new box");
 * }
 */
export function isLocationOccupied(boxes: Box[], row: number, column: number, level: number): boolean {
  return boxes.some((box) => box.row === row && box.column === column && box.level === level)
}

/**
 * Calculates the total capacity of a room based on its dimensions.
 *
 * @param {number} rows - The number of rows in the room.
 * @param {number} columns - The number of columns in the room.
 * @param {number} levels - The number of levels in the room.
 * @returns {number} The total capacity of the room (maximum number of boxes it can hold).
 *
 * @example
 * // Calculate room capacity
 * const capacity = calculateRoomCapacity(10, 10, 5);
 * console.log(`This room can hold up to ${capacity} boxes`);
 */
export function calculateRoomCapacity(rows: number, columns: number, levels: number): number {
  return rows * columns * levels
}

/**
 * Finds boxes matching specific criteria.
 *
 * @param {Box[]} boxes - The array of boxes to search.
 * @param {Object} criteria - The criteria to match against.
 * @param {string} [criteria.customerName] - The customer name to match.
 * @param {string} [criteria.varietyName] - The variety name to match.
 * @param {string} [criteria.grade] - The grade to match.
 * @param {"rectangle" | "square"} [criteria.size] - The box size to match.
 * @returns {Box[]} An array of boxes that match the criteria.
 *
 * @example
 * // Find all boxes for a specific customer
 * const customerBoxes = findBoxesByCriteria(boxes, { customerName: "Customer A" });
 * console.log(`Found ${customerBoxes.length} boxes for Customer A`);
 *
 * @example
 * // Find boxes with multiple criteria
 * const matchingBoxes = findBoxesByCriteria(boxes, {
 *   customerName: "Customer A",
 *   varietyName: "Variety X",
 *   size: "rectangle"
 * });
 * console.log(`Found ${matchingBoxes.length} rectangular boxes of Variety X for Customer A`);
 */
export function findBoxesByCriteria(
  boxes: Box[],
  criteria: {
    customerName?: string
    varietyName?: string
    grade?: string
    size?: "rectangle" | "square"
  },
): Box[] {
  return boxes.filter((box) => {
    let match = true

    if (criteria.customerName && box.customerName !== criteria.customerName) {
      match = false
    }

    if (criteria.varietyName && box.varietyName !== criteria.varietyName) {
      match = false
    }

    if (criteria.grade && box.grade !== criteria.grade) {
      match = false
    }

    if (criteria.size && box.size !== criteria.size) {
      match = false
    }

    return match
  })
}

/**
 * Sorts boxes by their position in the room, with various sorting options.
 *
 * @param {Box[]} boxes - The array of boxes to sort.
 * @param {Object} options - The sorting options.
 * @param {"asc" | "desc"} [options.rowOrder="asc"] - The order to sort rows.
 * @param {"asc" | "desc"} [options.columnOrder="asc"] - The order to sort columns.
 * @param {"asc" | "desc"} [options.levelOrder="asc"] - The order to sort levels.
 * @returns {Box[]} A new array of sorted boxes.
 *
 * @example
 * // Sort boxes from top to bottom (highest level first)
 * const topDownBoxes = sortBoxesByPosition(boxes, { levelOrder: "desc" });
 *
 * @example
 * // Sort boxes for removal (top down, back to front)
 * const boxesForRemoval = sortBoxesByPosition(boxes, {
 *   levelOrder: "desc",
 *   rowOrder: "desc",
 *   columnOrder: "desc"
 * });
 */
export function sortBoxesByPosition(
  boxes: Box[],
  options: {
    rowOrder?: "asc" | "desc"
    columnOrder?: "asc" | "desc"
    levelOrder?: "asc" | "desc"
  } = {},
): Box[] {
  const { rowOrder = "asc", columnOrder = "asc", levelOrder = "asc" } = options

  return [...boxes].sort((a, b) => {
    // First sort by row
    if (a.row !== b.row) {
      return rowOrder === "asc" ? a.row - b.row : b.row - a.row
    }

    // Then by column
    if (a.column !== b.column) {
      return columnOrder === "asc" ? a.column - b.column : b.column - a.column
    }

    // Finally by level
    return levelOrder === "asc" ? a.level - b.level : b.level - a.level
  })
}

/**
 * Generates a summary of boxes grouped by customer, variety, and grade.
 *
 * @param {Box[]} boxes - The array of boxes to summarize.
 * @returns {Object} A nested object with counts of boxes by customer, variety, and grade.
 *
 * @example
 * // Generate a summary of all boxes
 * const summary = generateBoxSummary(boxes);
 * console.log(JSON.stringify(summary, null, 2));
 * // Example output:
 * // {
 * //   "Customer A": {
 * //     "Variety X": {
 * //       "Grade 1": 10,
 * //       "Grade 2": 5
 * //     },
 * //     "Variety Y": {
 * //       "Grade 1": 8
 * //     }
 * //   },
 * //   "Customer B": {
 * //     "Variety Z": {
 * //       "Grade 3": 12
 * //     }
 * //   }
 * // }
 */
export function generateBoxSummary(boxes: Box[]): Record<string, Record<string, Record<string, number>>> {
  const summary: Record<string, Record<string, Record<string, number>>> = {}

  boxes.forEach((box) => {
    const { customerName, varietyName, grade } = box

    // Initialize customer if not exists
    if (!summary[customerName]) {
      summary[customerName] = {}
    }

    // Initialize variety if not exists
    if (!summary[customerName][varietyName]) {
      summary[customerName][varietyName] = {}
    }

    // Initialize or increment grade count
    if (!summary[customerName][varietyName][grade]) {
      summary[customerName][varietyName][grade] = 1
    } else {
      summary[customerName][varietyName][grade]++
    }
  })

  return summary
}

/**
 * Validates a box's position to ensure it's within the room boundaries.
 *
 * @param {Box} box - The box to validate.
 * @param {number} rows - The total number of rows in the room.
 * @param {number} columns - The total number of columns in the room.
 * @param {number} levels - The total number of levels in the room.
 * @returns {boolean} True if the box position is valid, false otherwise.
 *
 * @example
 * // Validate a box's position
 * const isValid = isBoxPositionValid(box, 10, 10, 5);
 * if (!isValid) {
 *   console.error("Box position is outside room boundaries");
 * }
 */
export function isBoxPositionValid(box: Box, rows: number, columns: number, levels: number): boolean {
  return (
    box.row >= 1 && box.row <= rows && box.column >= 1 && box.column <= columns && box.level >= 1 && box.level <= levels
  )
}

