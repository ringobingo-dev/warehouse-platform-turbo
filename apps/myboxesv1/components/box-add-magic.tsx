"use client"

import type React from "react"

import { useCallback } from "react"
import type { Box, LogEntry } from "@/types/Box"
import { toast } from "@/components/ui/use-toast"

interface BoxAddMagicProps {
  boxes: Box[]
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>
  log: LogEntry[]
  setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>
  validateBoxData: (boxes: Box[], log: LogEntry[]) => void
}

/**
 * BoxAddMagic component encapsulates the box addition logic
 * This component is currently a placeholder for future enhancements
 * to the box addition algorithm
 */
export function BoxAddMagic({ boxes, setBoxes, log, setLog, validateBoxData }: BoxAddMagicProps) {
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
        // Create a 3D grid to track occupied spaces
        const occupied = new Set<string>()
        boxes.forEach((box) => {
          occupied.add(`${box.row}-${box.column}-${box.level}`)
        })

        console.log(`Finding next available space with stack height: ${stackHeight}`) // Debug log

        // Simple implementation - find the first available space
        for (let r = startRow; r <= rows; r++) {
          for (let c = startColumn; c <= columns; c++) {
            for (let l = 1; l <= stackHeight; l++) {
              if (!occupied.has(`${r}-${c}-${l}`)) {
                console.log(`Found space at R${r}C${c}L${l}`) // Debug log
                return [r, c, l]
              }
            }
          }
        }

        // If no space is found
        return null
      } catch (error) {
        console.error("Error finding next available space:", error)
        throw error
      }
    },
    [boxes],
  )

  const addBoxes = useCallback(
    async (
      boxSize: "rectangle" | "square",
      customerName: string,
      startingRow: number,
      count: number,
      varietyName: string,
      gradeName: string,
      loadingDate: string,
      customerBoxColor: string,
      rows: number,
      columns: number,
      levels: number,
      stackHeight: number,
    ): Promise<Box[]> => {
      try {
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

        // Create a local copy of boxes to track occupied spaces during this operation
        const occupiedSpaces = new Set<string>()
        boxes.forEach((box) => {
          occupiedSpaces.add(`${box.row}-${box.column}-${box.level}`)
        })

        // Try to find space for each box
        for (let i = 0; i < count; i++) {
          try {
            // Find next available space, considering both existing boxes and newly added ones
            let nextSpace: [number, number, number] | null = null

            // Search for an available space
            for (let r = currentRow; r <= rows; r++) {
              for (let c = r === currentRow ? currentColumn : 1; c <= columns; c++) {
                for (
                  let l = r === currentRow && c === currentColumn ? currentLevel : 1;
                  l <= effectiveStackHeight;
                  l++
                ) {
                  const key = `${r}-${c}-${l}`
                  if (!occupiedSpaces.has(key)) {
                    nextSpace = [r, c, l]
                    // Mark this space as occupied for subsequent iterations
                    occupiedSpaces.add(key)
                    break
                  }
                }
                if (nextSpace) break
              }
              if (nextSpace) break
            }

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
              color: customerBoxColor,
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

        // Show success toast
        toast({
          title: "Boxes Added",
          description: `Successfully added ${newBoxes.length} boxes.`,
          duration: 3000,
        })

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
    [boxes, log, setBoxes, setLog, validateBoxData],
  )

  return { addBoxes, findNextAvailableSpace }
}

