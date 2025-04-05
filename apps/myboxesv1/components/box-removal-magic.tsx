"use client"

import type React from "react"

import { useCallback } from "react"
import type { Box, LogEntry } from "@/types/Box"
import { toast } from "@/components/ui/use-toast"

interface BoxRemovalMagicProps {
  boxes: Box[]
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>
  log: LogEntry[]
  setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>
  validateBoxData: (boxes: Box[], log: LogEntry[]) => void
}

/**
 * BoxRemovalMagic component encapsulates the forklift-style box removal logic
 * This component implements a realistic warehouse removal pattern where boxes
 * are removed by grid location (column by column, row by row)
 */
export function BoxRemovalMagic({ boxes, setBoxes, log, setLog, validateBoxData }: BoxRemovalMagicProps) {
  /**
   * Removes boxes from the room based on the provided parameters.
   * This function finds boxes matching the specified criteria and removes them,
   * simulating a forklift driver's workflow by removing all boxes from a specific
   * grid location before moving to the next.
   *
   * @param {string} customerName - The name of the customer.
   * @param {string} varietyName - The name of the variety.
   * @param {string} gradeName - The name of the grade.
   * @param {number} count - The number of boxes to remove.
   * @param {"rectangle" | "square"} boxSize - The size of the boxes to remove.
   * @param {string} customerBoxColor - The color of the boxes to remove.
   * @returns {Box[]} An array of the removed boxes.
   */
  const removeBoxes = useCallback(
    (
      customerName: string,
      varietyName: string,
      gradeName: string,
      count: number,
      boxSize: "rectangle" | "square",
      customerBoxColor: string,
    ): Box[] => {
      try {
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
          return b.level - a.level // Then by level (descending, from top down) - CHANGED THIS LINE
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
          // Sort boxes within a location by level (descending - from top down)
          locationBoxes.sort((a, b) => b.level - a.level)
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

        // Log the removal operation
        console.log(`Removed ${finalBoxesToRemove.length} boxes using forklift-style removal logic`)
        console.log("Removal pattern:", locations.join(", "))

        // Show success toast
        toast({
          title: "Boxes Removed",
          description: `Successfully removed ${finalBoxesToRemove.length} boxes using forklift-style removal.`,
          duration: 3000,
        })

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
    [boxes, log, setBoxes, setLog, validateBoxData],
  )

  /**
   * Reapplies the last removed boxes to the room.
   * This function checks if the last action was a removal and if there are boxes to reapply.
   * It parses the locations from the log entry and creates new boxes at those locations.
   *
   * @param {number} columns - The total number of columns in the room.
   * @param {number} rows - The total number of rows in the room.
   * @returns {Box[]} An array of the reapplied boxes.
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

        // Show success toast
        toast({
          title: "Boxes Reapplied",
          description: `Successfully reapplied ${boxesToAdd.length} boxes.`,
          duration: 3000,
        })

        return boxesToAdd
      } catch (error) {
        console.error("Error in reapplyLastRemoved:", error)
        throw error
      }
    },
    [boxes, log, setBoxes, setLog],
  )

  return { removeBoxes, reapplyLastRemoved }
}

