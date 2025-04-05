"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function RoomLayoutPreview({ roomData, className }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const renderLayout = () => {
      const container = containerRef.current
      const isSplitSide = roomData.shape === "Split Side"

      // Clear previous content
      container.innerHTML = ""

      // Create layout container with proper padding for labels
      const layoutContainer = document.createElement("div")
      layoutContainer.className = "relative w-full h-full"
      layoutContainer.style.padding = "40px" // Add padding for wall labels
      container.appendChild(layoutContainer)

      // Create the room visualization
      const roomElement = document.createElement("div")
      roomElement.className = "w-full h-[400px] border border-blue-400 relative"
      layoutContainer.appendChild(roomElement)

      // Add wall labels with proper positioning
      const backWallLabel = document.createElement("div")
      backWallLabel.className = "absolute top-0 left-0 w-full text-center -translate-y-8 text-blue-600 font-medium"
      backWallLabel.textContent = "Back Wall"
      layoutContainer.appendChild(backWallLabel)

      const frontWallLabel = document.createElement("div")
      frontWallLabel.className = "absolute bottom-0 left-0 w-full text-center translate-y-8 text-blue-600 font-medium"
      frontWallLabel.textContent = "Front Wall"
      layoutContainer.appendChild(frontWallLabel)

      const leftWallLabel = document.createElement("div")
      leftWallLabel.className = "absolute top-1/2 left-0 -translate-x-8 -translate-y-1/2 text-blue-600 font-medium"
      leftWallLabel.textContent = "Left Wall"
      layoutContainer.appendChild(leftWallLabel)

      const rightWallLabel = document.createElement("div")
      rightWallLabel.className = "absolute top-1/2 right-0 translate-x-8 -translate-y-1/2 text-blue-600 font-medium"
      rightWallLabel.textContent = "Right Wall"
      layoutContainer.appendChild(rightWallLabel)

      // Add corridor if present
      if (roomData.corridor?.position) {
        const corridorElement = document.createElement("div")
        corridorElement.className = "absolute bg-yellow-200"

        if (roomData.corridor.position === "Center") {
          corridorElement.className += " top-0 left-1/2 h-full w-[60px] -translate-x-1/2"
        } else if (roomData.corridor.position === "Left") {
          corridorElement.className += " top-0 left-0 h-full w-[60px]"
        } else if (roomData.corridor.position === "Right") {
          corridorElement.className += " top-0 right-0 h-full w-[60px]"
        }

        roomElement.appendChild(corridorElement)
      }

      // Add grid lines and numbering for split side
      if (isSplitSide) {
        // Create grid container
        const eastSide = document.createElement("div")
        eastSide.className = "absolute top-0 left-0 h-full w-[calc(50%-30px)] border-r border-dashed border-blue-300"
        roomElement.appendChild(eastSide)

        const westSide = document.createElement("div")
        westSide.className = "absolute top-0 right-0 h-full w-[calc(50%-30px)] border-l border-dashed border-blue-300"
        roomElement.appendChild(westSide)

        // Add grid lines for East side
        if (roomData.eastSide?.rows && roomData.eastSide?.columns) {
          createGrid(eastSide, roomData.eastSide.rows, roomData.eastSide.columns, "east")
        }

        // Add grid lines for West side
        if (roomData.westSide?.rows && roomData.westSide?.columns) {
          createGrid(westSide, roomData.westSide.rows, roomData.westSide.columns, "west")
        }
      } else {
        // Add grid lines for standard room
        if (roomData.rows && roomData.columns) {
          createGrid(roomElement, roomData.rows, roomData.columns)
        }
      }
    }

    const createGrid = (container, rows, columns, side = "standard") => {
      const width = container.clientWidth
      const height = container.clientHeight
      const cellWidth = width / columns
      const cellHeight = height / rows

      // Create row lines and numbers
      for (let i = 0; i <= rows; i++) {
        const rowLine = document.createElement("div")
        rowLine.className = "absolute left-0 w-full border-t border-blue-200"
        rowLine.style.top = `${i * cellHeight}px`
        container.appendChild(rowLine)

        if (i < rows) {
          const rowLabel = document.createElement("div")
          rowLabel.className = "absolute -left-6 text-xs text-blue-600 flex items-center justify-center w-5 h-5"
          rowLabel.style.top = `${(i * cellHeight) + (cellHeight / 2) - 10}px`

          // For west side, number from right to left
          if (side === "west") {
            rowLabel.textContent = `${rows - i}`
          } else {
            rowLabel.textContent = `${i + 1}`
          }

          container.appendChild(rowLabel)
        }
      }

      // Create column lines and numbers
      for (let j = 0; j <= columns; j++) {
        const colLine = document.createElement("div")
        colLine.className = "absolute top-0 h-full border-l border-blue-200"
        colLine.style.left = `${j * cellWidth}px`
        container.appendChild(colLine)

        if (j < columns) {
          const colLabel = document.createElement("div")
          colLabel.className = "absolute -top-6 text-xs text-blue-600 flex items-center justify-center w-5 h-5"
          colLabel.style.left = `${(j * cellWidth) + (cellWidth / 2) - 10}px`

          // For west side, number from right to left
          if (side === "west") {
            colLabel.textContent = `${columns - j}`
          } else {
            colLabel.textContent = `${j + 1}`
          }

          container.appendChild(colLabel)
        }
      }
    }

    renderLayout()

    // Re-render on window resize
    const handleResize = () => renderLayout()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [roomData])

  return <div ref={containerRef} className={cn("w-full min-h-[500px]", className)} aria-label="Room layout preview" />
}

