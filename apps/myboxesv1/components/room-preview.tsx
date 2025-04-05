"use client"

import { useEffect, useRef } from "react"

interface RoomPreviewProps {
  roomShape: string
  length: number
  width: number
  doorConfig: {
    wall: "front" | "back" | "left" | "right"
    offset: number
    width: number
  }
  corridorConfig: {
    wall: "front" | "back" | "left" | "right"
    width: number
  }
  storageConfig: {
    rows: {
      count: number
      startWall: "left" | "right"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  leftSideName?: string
  rightSideName?: string
}

export function RoomPreview({
  roomShape,
  length,
  width,
  doorConfig,
  corridorConfig,
  storageConfig,
  leftSideName = "Left Side",
  rightSideName = "Right Side",
}: RoomPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions and padding
    const padding = 60 // Increased padding for labels
    const availableWidth = canvas.width - padding * 2
    const availableHeight = canvas.height - padding * 2

    // Calculate scale to fit the room in the canvas
    const scaleX = availableWidth / width
    const scaleY = availableHeight / length
    const scale = Math.min(scaleX, scaleY)

    // Calculate scaled dimensions
    const scaledWidth = width * scale
    const scaledLength = length * scale
    const scaledCorridorWidth = corridorConfig.width * scale
    const scaledDoorWidth = doorConfig.width * scale

    // Draw room outline
    ctx.strokeStyle = "#3b82f6" // blue-500
    ctx.lineWidth = 2
    ctx.strokeRect(padding, padding, scaledWidth, scaledLength)

    // Draw corridor if configured
    if (corridorConfig.width > 0) {
      ctx.fillStyle = "rgba(74, 222, 128, 0.2)" // green-400 with opacity
      ctx.strokeStyle = "#4ade80" // green-400
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 1

      if (corridorConfig.wall === "front") {
        ctx.fillRect(padding, padding + scaledLength - scaledCorridorWidth, scaledWidth, scaledCorridorWidth)
        ctx.strokeRect(padding, padding + scaledLength - scaledCorridorWidth, scaledWidth, scaledCorridorWidth)
      } else if (corridorConfig.wall === "back") {
        ctx.fillRect(padding, padding, scaledWidth, scaledCorridorWidth)
        ctx.strokeRect(padding, padding, scaledWidth, scaledCorridorWidth)
      } else if (corridorConfig.wall === "left") {
        ctx.fillRect(padding, padding, scaledCorridorWidth, scaledLength)
        ctx.strokeRect(padding, padding, scaledCorridorWidth, scaledLength)
      } else if (corridorConfig.wall === "right") {
        ctx.fillRect(padding + scaledWidth - scaledCorridorWidth, padding, scaledCorridorWidth, scaledLength)
        ctx.strokeRect(padding + scaledWidth - scaledCorridorWidth, padding, scaledCorridorWidth, scaledLength)
      }
      ctx.setLineDash([])
    }

    // Draw door
    ctx.fillStyle = "#4ade80" // green-400
    const doorOffset = doorConfig.offset / 100

    if (doorConfig.wall === "front") {
      const doorX = padding + scaledWidth * doorOffset
      const doorY = padding + scaledLength
      ctx.fillRect(doorX - scaledDoorWidth / 2, doorY - 5, scaledDoorWidth, 10)
    } else if (doorConfig.wall === "back") {
      const doorX = padding + scaledWidth * doorOffset
      const doorY = padding
      ctx.fillRect(doorX - scaledDoorWidth / 2, doorY - 5, scaledDoorWidth, 10)
    } else if (doorConfig.wall === "left") {
      const doorX = padding
      const doorY = padding + scaledLength * doorOffset
      ctx.fillRect(doorX - 5, doorY - scaledDoorWidth / 2, 10, scaledDoorWidth)
    } else if (doorConfig.wall === "right") {
      const doorX = padding + scaledWidth
      const doorY = padding + scaledLength * doorOffset
      ctx.fillRect(doorX - 5, doorY - scaledDoorWidth / 2, 10, scaledDoorWidth)
    }

    // Draw rows and columns if configured
    if (storageConfig.rows.count > 0 && storageConfig.columns.count > 0) {
      // Calculate available space for rows and columns (accounting for corridor)
      const availableRowSpace =
        corridorConfig.wall === "left" || corridorConfig.wall === "right"
          ? scaledWidth - (corridorConfig.width > 0 ? scaledCorridorWidth : 0)
          : scaledWidth

      const availableColumnSpace =
        corridorConfig.wall === "front" || corridorConfig.wall === "back"
          ? scaledLength - (corridorConfig.width > 0 ? scaledCorridorWidth : 0)
          : scaledLength

      // Calculate cell dimensions
      const rowWidth = availableRowSpace / storageConfig.rows.count
      const columnHeight = availableColumnSpace / storageConfig.columns.count

      // Draw grid cells with labels
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#000"

      for (let row = 0; row < storageConfig.rows.count; row++) {
        for (let col = 0; col < storageConfig.columns.count; col++) {
          // Calculate cell position
          let x, y, cellX, cellY

          // Determine x position based on row start wall
          if (storageConfig.rows.startWall === "left") {
            x = padding + (corridorConfig.wall === "left" ? scaledCorridorWidth : 0) + row * rowWidth
          } else {
            x =
              padding + scaledWidth - (corridorConfig.wall === "right" ? scaledCorridorWidth : 0) - (row + 1) * rowWidth
          }

          // Invert column calculation to match 3D view
          y =
            padding +
            scaledLength -
            (corridorConfig.wall === "front" ? scaledCorridorWidth : 0) -
            (col + 1) * columnHeight

          // Draw cell border
          ctx.strokeStyle = "#3b82f6" // blue-500
          ctx.lineWidth = 1
          ctx.setLineDash([4, 4])
          ctx.strokeRect(x, y, rowWidth, columnHeight)
          ctx.setLineDash([])

          // Draw cell label (R1C1, R1C2, etc.)
          cellX = x + rowWidth / 2
          cellY = y + columnHeight / 2

          // Draw cell label with row and column numbers
          ctx.fillText(`R${row + 1}C${storageConfig.columns.count - col}`, cellX, cellY)
        }
      }
    }

    // Draw wall labels
    ctx.fillStyle = "#3b82f6" // blue-500
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Back wall
    ctx.fillText("Back Wall", padding + scaledWidth / 2, padding - 20)

    // Front wall
    ctx.fillText("Front Wall", padding + scaledWidth / 2, padding + scaledLength + 20)

    // Left wall
    ctx.save()
    ctx.translate(padding - 20, padding + scaledLength / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(leftSideName, 0, 0)
    ctx.restore()

    // Right wall
    ctx.save()
    ctx.translate(padding + scaledWidth + 20, padding + scaledLength / 2)
    ctx.rotate(Math.PI / 2)
    ctx.fillText(rightSideName, 0, 0)
    ctx.restore()

    // Draw dimensions
    ctx.fillStyle = "#000"
    ctx.font = "12px sans-serif"

    // Width dimension
    ctx.fillText(`${width}m`, padding + scaledWidth / 2, padding - 40)

    // Length dimension
    ctx.save()
    ctx.translate(padding - 40, padding + scaledLength / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(`${length}m`, 0, 0)
    ctx.restore()
  }, [roomShape, length, width, doorConfig, corridorConfig, storageConfig, leftSideName, rightSideName])

  return (
    <div className="w-full flex justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="border rounded-lg bg-white" />
    </div>
  )
}

// TODO: Review for Stage 1 completeness

