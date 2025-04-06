"use client"

import { useState, useCallback } from "react"
import type { Box, LogEntry } from "@/types/Box"
import { customers, varieties, grades } from "@/app/mockData"

/**
 * Retrieves the customer name based on the customer ID.
 *
 * @param {string} customerId - The ID of the customer to look up.
 * @returns {string | undefined} The name of the customer if found, undefined otherwise.
 */
export function getCustomerName(customerId: string): string | undefined {
  console.log("Looking up customer with ID:", customerId)

  // Try to parse the ID as a number
  const id = Number.parseInt(customerId, 10)

  // Check if parsing was successful
  if (isNaN(id)) {
    console.error("Failed to parse customer ID as a number:", customerId)
    return undefined
  }

  const customer = customers.find((customer) => customer.id === id)

  if (!customer) {
    console.error("No customer found with ID:", id)
    return undefined
  }

  return customer.name
}

/**
 * Retrieves the variety name based on the variety ID.
 *
 * @param {string} varietyId - The ID of the variety to look up.
 * @returns {string | undefined} The name of the variety if found, undefined otherwise.
 */
export function getVarietyName(varietyId: string): string | undefined {
  console.log("Looking up variety with ID:", varietyId)

  // Try to parse the ID as a number
  const id = Number.parseInt(varietyId, 10)

  // Check if parsing was successful
  if (isNaN(id)) {
    console.error("Failed to parse variety ID as a number:", varietyId)
    return undefined
  }

  const variety = varieties.find((variety) => variety.id === id)

  if (!variety) {
    console.error("No variety found with ID:", id)
    return undefined
  }

  return variety.name
}

/**
 * Retrieves the grade name based on the grade ID.
 *
 * @param {string} gradeId - The ID of the grade to look up.
 * @returns {string | undefined} The name of the grade if found, undefined otherwise.
 */
export function getGradeName(gradeId: string): string | undefined {
  console.log("Looking up grade with ID:", gradeId)
  console.log("Available grades:", grades)

  // Try to parse the ID as a number
  const id = Number.parseInt(gradeId, 10)

  // Check if parsing was successful
  if (isNaN(id)) {
    console.error("Failed to parse grade ID as a number:", gradeId)
    return undefined
  }

  const grade = grades.find((grade) => grade.id === id)

  if (!grade) {
    console.error("No grade found with ID:", id)
    return undefined
  }

  return grade.name
}

/**
 * A custom hook that provides operations for managing boxes in a 3D space.
 * This hook handles adding, removing, and reapplying boxes, as well as maintaining
 * a log of all operations.
 *
 * @param {Box[]} initialBoxes - The initial array of boxes to use.
 * @param {LogEntry[]} initialLog - The initial log of operations.
 * @returns {Object} An object containing the boxes state, log state, and operations.
 *
 * @example
 * // Basic usage
 * const {
 *   boxes,
 *   log,
 *   addBoxes,
 *   removeBoxes,
 *   reapplyLastRemoved
 * } = useBoxOperations([], []);
 *
 * @throws Will not throw directly, but operations within the hook may throw exceptions
 * that should be caught by the caller.
 */
export function useBoxOperations(initialBoxes: Box[], initialLog: LogEntry[]) {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes)
  const [log, setLog] = useState<LogEntry[]>(initialLog)

  /**
   * Validates the consistency between box data and log entries.
   * This function performs a non-critical validation that checks for mismatches
   * between the boxes array and log entries, logging warnings for any inconsistencies.
   *
   * @param {Box[]} boxes - The array of box objects to validate.
   * @param {LogEntry[]} log - The array of log entries to validate against.
   *
   * @example
   * validateBoxData(boxes, log);
   *
   * @note This function does not throw exceptions but logs warnings to the console.
   * It is intended for debugging and data integrity checks.
   */
  const validateBoxData = useCallback((boxes: Box[], log: LogEntry[]) => {
    try {
      // Ensure boxes and log are arrays before proceeding
      if (!Array.isArray(boxes) || !Array.isArray(log)) {
        console.warn("Invalid data format: boxes or log is not an array")
        return
      }

      // If either array is empty, there's nothing to validate
      if (boxes.length === 0 || log.length === 0) {
        console.log("Nothing to validate: boxes or log is empty")
        return
      }

      // IMPORTANT: Box data uses 1-based indexing for row, column, and level.
      // This ensures boxes are placed correctly within the room boundaries.
      const boxMap = new Map()
      boxes.forEach((box) => {
        if (box) {
          // Ensure box is defined
          const key = `${box.row}-${box.column}-${box.level}`
          boxMap.set(key, box)
        }
      })

      const loggedBoxes = new Set()
      log.forEach((entry, index) => {
        // Check if entry.locations exists and is an array
        if (!entry.locations || !Array.isArray(entry.locations)) {
          console.warn(`Log entry ${index} has no valid locations array`)
          return
        }

        entry.locations.forEach((location) => {
          const match = location.match(/R(\d+)C(\d+)L(\d+)/)

          if (!match) {
            console.warn(`Invalid location format in log entry ${index}: ${location}`)
            return
          }

          const [, rowStr, colStr, levelStr] = match
          const row = Number.parseInt(rowStr, 10)
          const col = Number.parseInt(colStr, 10)
          const level = Number.parseInt(levelStr, 10)

          if (isNaN(row) || isNaN(col) || isNaN(level)) {
            console.warn(`Invalid location numbers in log entry ${index}: ${location}`)
            return
          }

          const key = `${row}-${col}-${level}`
          if (!boxMap.has(key)) {
            console.warn(`Log entry ${index} has location ${location}, but no corresponding box data.`)
          } else {
            loggedBoxes.add(key)
          }
        })
      })

      boxes.forEach((box) => {
        if (box) {
          // Ensure box is defined
          const key = `${box.row}-${box.column}-${box.level}`
          if (!loggedBoxes.has(key)) {
            console.warn(`Box data exists for ${key}, but no corresponding log entry.`)
          }
        }
      })

      console.log(`Validation complete. ${boxes.length} boxes, ${log.length} log entries.`)
      console.log(`${loggedBoxes.size} boxes are accounted for in the log.`)
      console.log(`${boxes.length - loggedBoxes.size} boxes are not logged.`)
    } catch (error) {
      console.error("Error validating box data:", error)
      // We don't throw here because validation is a non-critical operation
      // But we log the error for debugging purposes
    }
  }, [])

  /**
   * Finds the next available space in the room for placing a box.
   * This function implements a space-finding algorithm that prioritizes vertical stacking
   * up to the specified stack height before moving to the next column or row.
   *
   * The algorithm works as follows:
   * 1. First, try to stack vertically at the current position up to stackHeight
   * 2. If vertical stacking is not possible, move to the next column
   * 3. If all columns in the current row are checked, move to the next row
   * 4. If all rows are checked and no space is found, return null
   *
   * @param {number} startRow - The row to start searching from (1-based index).
   * @param {number} startColumn - The column to start searching from (1-based index).
   * @param {number} startLevel - The level to start searching from (1-based index).
   * @param {"rectangle" | "square"} boxSize - The size of the box to place.
   * @param {number} rows - The total number of rows in the room.
   * @param {number} columns - The total number of columns in the room.
   * @param {number} levels - The total number of levels in the room.
   * @param {number} stackHeight - The maximum stack height for the boxes.
   * @returns {[number, number, number] | null} The coordinates of the next available space as [row, column, level], or null if no space is found.
   *
   * @example
   * // Find the next available space starting from position [1,1,1]
   * const nextSpace = findNextAvailableSpace(1, 1, 1, "rectangle", 10, 10, 5, 3);
   * if (nextSpace) {
   *   const [row, column, level] = nextSpace;
   *   console.log(`Found space at R${row}C${column}L${level}`);
   * } else {
   *   console.log("No available space found");
   * }
   *
   * @example
   * // Find space starting from a specific position with limited stack height
   * try {
   *   const nextSpace = findNextAvailableSpace(2, 3, 1, "square", 10, 10, 5, 2);
   *   if (nextSpace) {
   *     // Use the coordinates to place a box
   *     const [row, column, level] = nextSpace;
   *     placeBox(row, column, level);
   *   }
   * } catch (error) {
   *   console.error("Error finding space:", error.message);
   * }
   *
   * @throws {Error} If any of the input parameters are invalid or out of bounds.
   * @note This function uses recursion to search through the space, which may cause
   * stack overflow for very large rooms. Consider an iterative approach for extremely large spaces.
   */
  const findNextAvailableSpace = useCallback(
    (
      startRow: number,
      startColumn: number,
      startLevel: number,
      boxSize: "rectangle" | "square",
      rows: number,
      columns: number,
      levels: number,
      stackHeight: number,
    ): [number, number, number] | null => {
      try {
        // Validate input parameters
        if (startRow <= 0 || startRow > rows) {
          throw new Error(`Invalid startRow: ${startRow}. Must be between 1 and ${rows}.`)
        }

        if (startColumn <= 0 || startColumn > columns) {
          throw new Error(`Invalid startColumn: ${startColumn}. Must be between 1 and ${columns}.`)
        }

        if (startLevel <= 0 || startLevel > levels) {
          throw new Error(`Invalid startLevel: ${startLevel}. Must be between 1 and ${levels}.`)
        }

        if (stackHeight <= 0 || stackHeight > levels) {
          throw new Error(`Invalid stackHeight: ${stackHeight}. Must be between 1 and ${levels}.`)
        }

        // Create a 3D grid to track occupied spaces
        const occupied = new Set<string>()
        boxes.forEach((box) => {
          occupied.add(`${box.row}-${box.column}-${box.level}`)
        })

        console.log(`Finding next available space with stack height: ${stackHeight}`) // Debug log

        // Check if the row is completely full
        let isRowFull = true
        for (let col = 1; col <= columns; col++) {
          for (let level = 1; level <= stackHeight; level++) {
            if (!occupied.has(`${startRow}-${col}-${level}`)) {
              isRowFull = false
              break
            }
          }
          if (!isRowFull) break
        }

        // If the row is full, try the next row
        if (isRowFull) {
          console.log(`Row ${startRow} is full, trying next row`)
          if (startRow < rows) {
            return findNextAvailableSpace(
              startRow + 1,
              1, // Reset column to 1
              1, // Reset level to 1
              boxSize,
              rows,
              columns,
              levels,
              stackHeight,
            )
          } else {
            console.log("All rows are full")
            return null
          }
        }

        // First, try to stack vertically at the current position
        if (startLevel <= stackHeight) {
          for (let level = startLevel; level <= stackHeight; level++) {
            if (!occupied.has(`${startRow}-${startColumn}-${level}`)) {
              console.log(`Found space at R${startRow}C${startColumn}L${level}`) // Debug log
              return [startRow, startColumn, level]
            }
          }
        }

        // If we can't stack vertically, move to the next column
        if (startColumn < columns) {
          return findNextAvailableSpace(
            startRow,
            startColumn + 1,
            1, // Reset level to 1
            boxSize,
            rows,
            columns,
            levels,
            stackHeight,
          )
        }

        // If we've reached the end of the row, move to the next row
        if (startRow < rows) {
          return findNextAvailableSpace(
            startRow + 1,
            1, // Reset column to 1
            1, // Reset level to 1
            boxSize,
            rows,
            columns,
            levels,
            stackHeight,
          )
        }

        // If we've checked all spaces and found none available
        return null
      } catch (error) {
        console.error("Error finding next available space:", error)
        throw error
      }
    },
    [boxes],
  )

  /**
   * Adds boxes to the room based on the provided parameters.
   * This function attempts to place the specified number of boxes in the room,
   * starting from the given row and following the space-finding algorithm.
   * It updates the boxes and log state, and validates the new data.
   *
   * @param {"rectangle" | "square"} boxSize - The size of the boxes to add.
   * @param {string} selectedCustomer - The ID of the selected customer.
   * @param {string} selectedRow - The selected starting row.
   * @param {string} boxCount - The number of boxes to add.
   * @param {string} selectedVariety - The ID of the selected variety.
   * @param {string} selectedGrade - The ID of the selected grade.
   * @param {string} loadingDate - The loading date for the boxes.
   * @param {string} customerBoxColor - The color of the boxes.
   * @param {number} rows - The total number of rows in the room.
   * @param {number} columns - The total number of columns in the room.
   * @param {number} levels - The total number of levels in the room.
   * @param {number} stackHeight - The maximum stack height for the boxes.
   * @returns {Promise<Box[]>} A promise that resolves to an array of the newly added boxes.
   *
   * @example
   * // Add 5 rectangular boxes for customer with ID "1"
   * try {
   *   const newBoxes = await addBoxes(
   *     "rectangle", "1", "1", "5", "1", "1",
   *     "2023-01-01", "#FF0000", 10, 10, 5, 3
   *   );
   *   console.log(`Added ${newBoxes.length} boxes`);
   * } catch (error) {
   *   console.error("Failed to add boxes:", error);
   * }
   *
   * @throws {Error} If there is insufficient space, invalid parameters, or other errors during box placement.
   */
  const addBoxes = useCallback(
    async (
      boxSize: "rectangle" | "square",
      selectedCustomer: string,
      selectedRow: string,
      boxCount: string,
      selectedVariety: string,
      selectedGrade: string,
      loadingDate: string,
      customerBoxColor: string,
      rows: number,
      columns: number,
      levels: number,
      stackHeight: number,
    ): Promise<Box[]> => {
      try {
        // Input validation
        const customerName = getCustomerName(selectedCustomer)
        const varietyName = getVarietyName(selectedVariety)
        const gradeName = getGradeName(selectedGrade)

        if (!customerName) {
          throw new Error(`Invalid customer selection: ${selectedCustomer}`)
        }

        if (!varietyName) {
          throw new Error(`Invalid variety selection: ${selectedVariety}`)
        }

        if (!gradeName) {
          throw new Error(`Invalid grade selection: ${selectedGrade}`)
        }

        const count = Number.parseInt(boxCount, 10)
        if (isNaN(count) || count <= 0) {
          throw new Error("Box count must be a positive number.")
        }

        const startingRow = Number.parseInt(selectedRow, 10)
        if (isNaN(startingRow) || startingRow <= 0 || startingRow > rows) {
          throw new Error(`Starting row must be between 1 and ${rows}.`)
        }

        // Ensure stackHeight doesn't exceed levels
        const effectiveStackHeight = Math.min(stackHeight, levels)

        console.log(`Adding boxes with effective stack height: ${effectiveStackHeight}`)

        // Pre-check if we have enough space before starting the operation
        const availableSpace = rows * columns * levels - boxes.length
        if (availableSpace < count) {
          throw new Error(`Not enough space to add ${count} boxes. Only ${availableSpace} spaces available.`)
        }

        // Track new boxes and their locations
        const newBoxes: Box[] = []
        const locations: string[] = []
        let currentRow = startingRow
        let currentColumn = 1
        let currentLevel = 1

        // Try to find space for each box
        for (let i = 0; i < count; i++) {
          try {
            const nextSpace = findNextAvailableSpace(
              currentRow,
              currentColumn,
              currentLevel,
              boxSize,
              rows,
              columns,
              levels,
              effectiveStackHeight,
            )

            if (!nextSpace) {
              throw new Error(`Cannot add ${count} boxes. Only space for ${i} boxes.`)
            }

            const [row, column, level] = nextSpace
            currentRow = row
            currentColumn = column
            currentLevel = level

            const locationString = `R${row}C${column}L${level}`
            locations.push(locationString)

            newBoxes.push({
              row,
              column,
              level,
              customerName,
              varietyName,
              grade: gradeName,
              loadingDate,
              color: customerBoxColor, // Ensure this is correctly passed
              logIndex: log.length,
              highlighted: false,
              size: boxSize,
            })

            // Determine next position - prioritize stacking vertically
            if (currentLevel < effectiveStackHeight) {
              currentLevel++
            } else {
              // Move to next column when stack is full
              currentLevel = 1
              currentColumn++

              // Move to next row when column is full
              if (currentColumn > columns) {
                currentColumn = 1
                currentRow++

                // Stop if we've used all rows
                if (currentRow > rows) {
                  // If we can't place all boxes, throw an error
                  if (i < count - 1) {
                    throw new Error(`Cannot add ${count} boxes. Only space for ${i + 1} boxes.`)
                  }
                  break
                }
              }
            }
          } catch (error) {
            // If we encounter an error during box placement, log it and rethrow
            console.error(`Error placing box ${i + 1}:`, error)
            throw error
          }
        }

        // If we've successfully placed all boxes, create a log entry
        const logEntry: LogEntry = {
          customerName,
          boxCount: newBoxes.length,
          varietyName,
          grade: gradeName,
          loadingDate,
          locations,
          boxSize: boxSize,
          startingRow,
          stackHeight: effectiveStackHeight,
          customerBoxColor,
        }

        // Update state
        setBoxes((prevBoxes) => [...prevBoxes, ...newBoxes])
        setLog((prevLog) => [...prevLog, logEntry])

        // Validate the updated data
        try {
          validateBoxData([...boxes, ...newBoxes], [...log, logEntry])
        } catch (validationError) {
          console.error("Validation error:", validationError)
          // We don't throw here because the boxes have already been added
          // But we log the error for debugging purposes
        }

        return newBoxes
      } catch (error) {
        // Log the error for debugging
        console.error("Error in addBoxes:", error)

        // Rethrow the error to be handled by the caller
        throw error
      }
    },
    [boxes, log, findNextAvailableSpace, validateBoxData],
  )

  /**
   * Removes boxes from the room based on the provided parameters.
   * This function finds boxes matching the specified criteria and removes them,
   * starting from the top of stacks and working backward to maintain stability.
   * It updates the boxes and log state, and validates the new data.
   *
   * @param {string} selectedCustomer - The ID of the selected customer.
   * @param {string} selectedVariety - The ID of the selected variety.
   * @param {string} selectedGrade - The ID of the selected grade.
   * @param {string} boxCount - The number of boxes to remove.
   * @param {"rectangle" | "square"} boxSize - The size of the boxes to remove.
   * @param {string} customerBoxColor - The color of the boxes to remove.
   * @returns {Box[]} An array of the removed boxes.
   *
   * @example
   * // Remove 3 rectangular boxes for customer with ID "1"
   * try {
   *   const removedBoxes = removeBoxes("1", "1", "1", "3", "rectangle", "#FF0000");
   *   console.log(`Removed ${removedBoxes.length} boxes`);
   * } catch (error) {
   *   console.error("Failed to remove boxes:", error);
   * }
   *
   * @throws {Error} If there are no matching boxes, not enough matching boxes, or other errors during removal.
   */
  const removeBoxes = useCallback(
    (
      selectedCustomer: string,
      selectedVariety: string,
      selectedGrade: string,
      boxCount: string,
      boxSize: "rectangle" | "square",
      customerBoxColor: string,
    ): Box[] => {
      try {
        const customerName = getCustomerName(selectedCustomer)
        const varietyName = getVarietyName(selectedVariety)
        const gradeName = getGradeName(selectedGrade)

        if (!customerName) {
          throw new Error(`Invalid customer selection: ${selectedCustomer}`)
        }

        if (!varietyName) {
          throw new Error(`Invalid variety selection: ${selectedVariety}`)
        }

        if (!gradeName) {
          throw new Error(`Invalid grade selection: ${selectedGrade}`)
        }

        const count = Number.parseInt(boxCount, 10)
        if (isNaN(count) || count <= 0) {
          throw new Error("Box count must be a positive number.")
        }

        // Find boxes matching the criteria
        const matchingBoxes = boxes.filter(
          (box) =>
            box.customerName === customerName &&
            box.varietyName === varietyName &&
            box.grade === gradeName &&
            box.size === boxSize,
        )

        if (matchingBoxes.length === 0) {
          throw new Error("No boxes match the selected criteria.")
        }

        if (matchingBoxes.length < count) {
          throw new Error(`Only ${matchingBoxes.length} boxes match the criteria. Cannot remove ${count} boxes.`)
        }

        // Sort boxes by column (descending), then row (ascending)
        // This ensures we remove all boxes from a specific grid location (column) before moving to the next
        // Starting from the back of the room (highest column number) and working forward
        const sortedBoxes = [...matchingBoxes].sort((a, b) => {
          if (a.column !== b.column) return b.column - a.column // Start from highest column number (back of room)
          if (a.row !== b.row) return a.row - b.row // Then by row (ascending)
          return a.level - b.level // Then by level (ascending, from bottom up)
        })

        // Group boxes by their grid location (column and row)
        const boxesByLocation = new Map()
        sortedBoxes.forEach((box) => {
          const locationKey = `${box.row}-${box.column}`
          if (!boxesByLocation.has(locationKey)) {
            boxesByLocation.set(locationKey, [])
          }
          boxesByLocation.get(locationKey).push(box)
        })

        // Flatten the grouped boxes, taking all boxes from each location
        // This ensures we remove all boxes from a location before moving to the next
        const boxesToRemove = []
        for (const [_, locationBoxes] of boxesByLocation) {
          // Sort boxes within a location by level (ascending)
          locationBoxes.sort((a, b) => a.level - b.level)
          boxesToRemove.push(...locationBoxes)

          // If we have enough boxes, stop adding more
          if (boxesToRemove.length >= count) {
            break
          }
        }

        // Slice to get only the requested number of boxes
        const finalBoxesToRemove = boxesToRemove.slice(0, count)
        const remainingBoxes = boxes.filter((box) => !finalBoxesToRemove.includes(box))

        // Create a log entry for the removed boxes
        const locations = finalBoxesToRemove.map((box) => `R${box.row}C${box.column}L${box.level}`)
        const logEntry: LogEntry = {
          customerName,
          boxCount: -count, // Negative count indicates removal
          varietyName,
          grade: gradeName,
          loadingDate: new Date().toISOString().split("T")[0],
          locations,
          boxSize,
          startingRow: finalBoxesToRemove[0]?.row || 0,
          stackHeight: Math.max(...finalBoxesToRemove.map((box) => box.level)),
          customerBoxColor,
        }

        // Update state
        setBoxes(remainingBoxes)
        setLog((prevLog) => [...prevLog, logEntry])

        // Validate the updated data
        try {
          validateBoxData(remainingBoxes, [...log, logEntry])
        } catch (validationError) {
          console.error("Validation error:", validationError)
          // We don't throw here because the boxes have already been removed
          // But we log the error for debugging purposes
        }

        return finalBoxesToRemove
      } catch (error) {
        console.error("Error in removeBoxes:", error)
        throw error
      }
    },
    [boxes, log, validateBoxData],
  )

  /**
   * Reapplies the last removed boxes to the room.
   * This function checks if the last action was a removal and if there are boxes to reapply.
   * It parses the locations from the log entry and creates new boxes at those locations.
   *
   * @param {number} columns - The total number of columns in the room.
   * @param {number} rows - The total number of rows in the room.
   * @returns {Box[]} An array of the reapplied boxes.
   *
   * @example
   * // Reapply the last removed boxes
   * try {
   *   const reappliedBoxes = reapplyLastRemoved(10, 10);
   *   console.log(`Reapplied ${reappliedBoxes.length} boxes`);
   * } catch (error) {
   *   console.error("Failed to reapply boxes:", error);
   * }
   *
   * @throws {Error} If there are no boxes to reapply, the last action was not a removal,
   * there is insufficient space, or if any of the spaces are already occupied.
   */
  const reapplyLastRemoved = useCallback(
    (columns: number, rows: number): Box[] => {
      try {
        if (log.length === 0) {
          throw new Error("No boxes to reapply.")
        }

        const lastEntry = log[log.length - 1]
        if (lastEntry.boxCount >= 0) {
          throw new Error("The last action was not a removal. Cannot reapply.")
        }

        // Check if we have enough space to reapply the boxes
        const boxesToReapply = Math.abs(lastEntry.boxCount)
        const availableSpace = rows * columns * boxes[0]?.level || 1 - boxes.length
        if (availableSpace < boxesToReapply) {
          throw new Error(
            `Not enough space to reapply ${boxesToReapply} boxes. Only ${availableSpace} spaces available.`,
          )
        }

        // Parse locations and create boxes
        const boxesToAdd = lastEntry.locations.map((location) => {
          const match = location.match(/R(\d+)C(\d+)L(\d+)/)
          if (!match) {
            throw new Error(`Invalid location format: ${location}`)
          }

          const [, rowStr, colStr, levelStr] = match
          const row = Number.parseInt(rowStr, 10)
          const col = Number.parseInt(colStr, 10)
          const level = Number.parseInt(levelStr, 10)

          if (isNaN(row) || isNaN(col) || isNaN(level)) {
            throw new Error(`Invalid location numbers in: ${location}`)
          }

          // Check if the space is already occupied
          const isOccupied = boxes.some((box) => box.row === row && box.column === col && box.level === level)

          if (isOccupied) {
            throw new Error(`Cannot reapply box at ${location} because the space is already occupied.`)
          }

          return {
            row,
            column: col,
            level,
            customerName: lastEntry.customerName,
            varietyName: lastEntry.varietyName,
            grade: lastEntry.grade,
            loadingDate: lastEntry.loadingDate,
            color: lastEntry.customerBoxColor,
            logIndex: log.length,
            highlighted: false,
            size: lastEntry.boxSize,
          }
        })

        // Update state
        setBoxes((prevBoxes) => [...prevBoxes, ...boxesToAdd])
        setLog((prevLog) => prevLog.slice(0, -1))

        return boxesToAdd
      } catch (error) {
        console.error("Error in reapplyLastRemoved:", error)
        throw error
      }
    },
    [boxes, log],
  )

  /**
   * The return value of the useBoxOperations hook.
   * Contains the current state and operations for managing boxes.
   *
   * @property {Box[]} boxes - The current array of boxes.
   * @property {Function} setBoxes - Function to update the boxes state.
   * @property {LogEntry[]} log - The current log of operations.
   * @property {Function} setLog - Function to update the log state.
   * @property {Function} validateBoxData - Function to validate box data against log entries.
   * @property {Function} addBoxes - Function to add boxes to the room.
   * @property {Function} removeBoxes - Function to remove boxes from the room.
   * @property {Function} reapplyLastRemoved - Function to reapply the last removed boxes.
   */
  return {
    boxes,
    setBoxes,
    log,
    setLog,
    validateBoxData,
    addBoxes,
    removeBoxes,
    reapplyLastRemoved,
  }
}

