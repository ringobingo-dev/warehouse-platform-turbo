"use client"

import { useEffect, useRef } from "react"

interface RoomLayoutVisualizationProps {
  roomShape: string
  length: number
  width: number
  doorConfig: {
    wall: string
    offset: number
    width: number
  }
  corridorConfig: {
    wall: string
    width: number
  }
  storageConfig: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  leftSideName?: string
  rightSideName?: string
}

export function RoomLayoutVisualization({
  roomShape,
  length,
  width,
  doorConfig,
  corridorConfig,
  storageConfig,
  leftSideName = "Left Side",
  rightSideName = "Right Side",
}: RoomLayoutVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas dimensions to match container size
    const resizeCanvas = () => {
      const containerRect = container.getBoundingClientRect()
      canvas.width = containerRect.width
      canvas.height = containerRect.height
      drawRoom()
    }

    // Initial resize
    resizeCanvas()

    // Add resize listener
    window.addEventListener("resize", resizeCanvas)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Redraw when props change
  useEffect(() => {
    drawRoom()
  }, [roomShape, length, width, doorConfig, corridorConfig, storageConfig, leftSideName, rightSideName])

  const drawRoom = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate room dimensions based on aspect ratio
    const roomAspectRatio = width / length
    const canvasAspectRatio = canvas.width / canvas.height

    // Calculate dimensions to fit the canvas while maintaining aspect ratio
    let scaledWidth, scaledHeight, offsetX, offsetY

    // Use a more consistent approach to scaling
    const padding = 40 // Padding for labels
    const availableWidth = canvas.width - padding * 2
    const availableHeight = canvas.height - padding * 2

    if (roomAspectRatio > canvasAspectRatio) {
      // Room is wider than canvas (relative to height)
      scaledWidth = availableWidth
      scaledHeight = scaledWidth / roomAspectRatio
      offsetX = padding
      offsetY = (canvas.height - scaledHeight) / 2
    } else {
      // Room is taller than canvas (relative to width)
      scaledHeight = availableHeight
      scaledWidth = scaledHeight * roomAspectRatio
      offsetX = (canvas.width - scaledWidth) / 2
      offsetY = padding
    }

    // Draw room outline
    ctx.strokeStyle = "#3b82f6" // blue-500
    ctx.lineWidth = 2
    ctx.strokeRect(offsetX, offsetY, scaledWidth, scaledHeight)

    // Calculate scaled corridor width
    const scaledCorridorWidth =
      corridorConfig.width > 0
        ? corridorConfig.wall === "left" || corridorConfig.wall === "right"
          ? (corridorConfig.width / width) * scaledWidth
          : (corridorConfig.width / length) * scaledHeight
        : 0

    // Draw corridor if configured
    if (corridorConfig.width > 0) {
      ctx.fillStyle = "rgba(74, 222, 128, 0.2)" // green-400 with opacity
      ctx.strokeStyle = "#4ade80" // green-400
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 1

      if (corridorConfig.wall === "front") {
        ctx.fillRect(offsetX, offsetY + scaledHeight - scaledCorridorWidth, scaledWidth, scaledCorridorWidth)
        ctx.strokeRect(offsetX, offsetY + scaledHeight - scaledCorridorWidth, scaledWidth, scaledCorridorWidth)
      } else if (corridorConfig.wall === "back") {
        ctx.fillRect(offsetX, offsetY, scaledWidth, scaledCorridorWidth)
        ctx.strokeRect(offsetX, offsetY, scaledWidth, scaledCorridorWidth)
      } else if (corridorConfig.wall === "left") {
        ctx.fillRect(offsetX, offsetY, scaledCorridorWidth, scaledHeight)
        ctx.strokeRect(offsetX, offsetY, scaledCorridorWidth, scaledHeight)
      } else if (corridorConfig.wall === "right") {
        ctx.fillRect(offsetX + scaledWidth - scaledCorridorWidth, offsetY, scaledCorridorWidth, scaledHeight)
        ctx.strokeRect(offsetX + scaledWidth - scaledCorridorWidth, offsetY, scaledCorridorWidth, scaledHeight)
      }
      ctx.setLineDash([])
    }

    // Draw door
    ctx.fillStyle = "#4ade80" // green-400
    const doorOffset = doorConfig.offset / 100
    const scaledDoorWidth =
      doorConfig.wall === "left" || doorConfig.wall === "right"
        ? (doorConfig.width / length) * scaledHeight
        : (doorConfig.width / width) * scaledWidth

    if (doorConfig.wall === "front") {
      const doorX = offsetX + scaledWidth * doorOffset
      const doorY = offsetY + scaledHeight
      ctx.fillRect(doorX - scaledDoorWidth / 2, doorY - 5, scaledDoorWidth, 10)
    } else if (doorConfig.wall === "back") {
      const doorX = offsetX + scaledWidth * doorOffset
      const doorY = offsetY
      ctx.fillRect(doorX - scaledDoorWidth / 2, doorY - 5, scaledDoorWidth, 10)
    } else if (doorConfig.wall === "left") {
      const doorX = offsetX
      const doorY = offsetY + scaledHeight * doorOffset
      ctx.fillRect(doorX - 5, doorY - scaledDoorWidth / 2, 10, scaledDoorWidth)
    } else if (doorConfig.wall === "right") {
      const doorX = offsetX + scaledWidth
      const doorY = offsetY + scaledHeight * doorOffset
      ctx.fillRect(doorX - 5, doorY - scaledDoorWidth / 2, 10, scaledDoorWidth)
    }

    // Draw rows and columns if configured
    if (storageConfig.rows.count > 0 && storageConfig.columns.count > 0) {
      // Calculate available space for rows and columns (accounting for corridor)
      let availableWidth = scaledWidth
      let availableHeight = scaledHeight
      let gridOffsetX = offsetX
      let gridOffsetY = offsetY

      if (corridorConfig.wall === "left") {
        availableWidth -= scaledCorridorWidth
        gridOffsetX += scaledCorridorWidth
      } else if (corridorConfig.wall === "right") {
        availableWidth -= scaledCorridorWidth
      } else if (corridorConfig.wall === "back") {
        availableHeight -= scaledCorridorWidth
        gridOffsetY += scaledCorridorWidth
      } else if (corridorConfig.wall === "front") {
        availableHeight -= scaledCorridorWidth
      }

      // Calculate cell dimensions
      const cellWidth = availableWidth / storageConfig.columns.count
      const cellHeight = availableHeight / storageConfig.rows.count

      // Draw grid cells
      ctx.strokeStyle = "#3b82f6" // blue-500
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])

      for (let row = 0; row < storageConfig.rows.count; row++) {
        for (let col = 0; col < storageConfig.columns.count; col++) {
          // Calculate cell position
          const x = gridOffsetX + col * cellWidth
          const y = gridOffsetY + row * cellHeight

          // Draw cell
          ctx.strokeRect(x, y, cellWidth, cellHeight)

          // Add row and column numbers
          ctx.fillStyle = "#000"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          // Determine row number based on startWall
          let rowNumber
          if (storageConfig.rows.startWall === "front") {
            rowNumber = storageConfig.rows.count - row
          } else {
            rowNumber = row + 1
          }

          // Row number (adjust position as needed)
          if (col === 0) {
            ctx.textAlign = "right"
            ctx.fillText(`${rowNumber}`, gridOffsetX - 5, y + cellHeight / 2)
            ctx.textAlign = "center" // Reset for other text
          }

          // Column number (adjust position as needed)
          if (row === 0) {
            ctx.fillText(`${col + 1}`, x + cellWidth / 2, gridOffsetY - 10)
          }
        }
      }
      ctx.setLineDash([])
    }

    // Draw wall labels
    ctx.fillStyle = "#3b82f6" // blue-500
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Back wall
    ctx.fillText(`Back Wall (${width}m)`, offsetX + scaledWidth / 2, offsetY - 20)

    // Front wall
    ctx.fillText(`Front Wall (${width}m)`, offsetX + scaledWidth / 2, offsetY + scaledHeight + 20)

    // Left wall
    ctx.save()
    ctx.translate(offsetX - 20, offsetY + scaledHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(`Left Wall (${length}m)`, 0, 0)
    ctx.restore()

    // Right wall
    ctx.save()
    ctx.translate(offsetX + scaledWidth + 20, offsetY + scaledHeight / 2)
    ctx.rotate(Math.PI / 2)
    ctx.fillText(`Right Wall (${length}m)`, 0, 0)
    ctx.restore()

    // Draw dimensions on the room
    if (storageConfig.rows.count > 0 && storageConfig.columns.count > 0) {
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.fillText(
        `${storageConfig.rows.count} rows × ${storageConfig.columns.count} columns`,
        offsetX + scaledWidth / 2,
        offsetY + scaledHeight / 2,
      )
    }

    if (roomShape === "split-side") {
      // Update any labels or text that shows "Left Side" or "Right Side"
      // to use leftSideName and rightSideName instead
      ctx.save()
      ctx.translate(offsetX - 20, offsetY + scaledHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(`${leftSideName} (${length}m)`, 0, 0)
      ctx.restore()

      // Right wall
      ctx.save()
      ctx.translate(offsetX + scaledWidth + 20, offsetY + scaledHeight / 2)
      ctx.rotate(Math.PI / 2)
      ctx.fillText(`${rightSideName} (${length}m)`, 0, 0)
      ctx.restore()
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
    </div>
  )
}

// TODO: Review for Stage 1 completeness

