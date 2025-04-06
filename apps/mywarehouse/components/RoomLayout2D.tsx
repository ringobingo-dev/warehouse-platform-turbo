"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface RoomLayout2DProps {
  dimensions: {
    length: number
    width: number
    secondLength?: number
    secondWidth?: number
  }
  shape: string
  unit: "ft" | "m"
  doorPosition: {
    wall: "front" | "left" | "right" | "back"
    offset: number
  }
  corridor: {
    wall: "front" | "left" | "right" | "back"
    width: number
  }
  rows: {
    count: number
    startWall: "left" | "right"
  }
  columns: {
    count: number
  }
  stackHeight: number
  showDimensionsInKey?: boolean
}

const RoomLayout2D: React.FC<RoomLayout2DProps> = ({
  dimensions,
  shape,
  unit,
  doorPosition,
  corridor,
  rows,
  columns,
  stackHeight,
  showDimensionsInKey = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect()
        setSvgSize({ width, height })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const padding = 40
  const keyPadding = 10
  const keyWidth = 180
  const keyHeight = 150
  const keyMargin = 20
  const wallThickness = 4
  const labelOffset = 10
  const keyFontSize = 12

  const roomWidth = svgSize.width - padding * 2 - keyWidth - keyMargin * 2
  const roomHeight = svgSize.height - padding * 2
  const roomAspectRatio = dimensions.length / dimensions.width
  const svgAspectRatio = roomWidth / roomHeight

  let scaledLength: number, scaledWidth: number
  if (roomAspectRatio > svgAspectRatio) {
    scaledLength = roomWidth
    scaledWidth = roomWidth / roomAspectRatio
  } else {
    scaledWidth = roomHeight
    scaledLength = roomHeight * roomAspectRatio
  }

  const scaledCorridorWidth = (corridor.width / dimensions.length) * scaledLength

  const sizeRatio = (keyWidth * keyHeight) / (scaledLength * scaledWidth)

  const drawRoom = () => {
    const baseRect = (
      <rect
        x={padding}
        y={padding}
        width={scaledLength}
        height={scaledWidth}
        fill="none"
        stroke="black"
        strokeWidth={wallThickness}
      />
    )

    const doorWidth = 40
    const door = (() => {
      const offset = Math.min(91, doorPosition.offset) / 100
      switch (doorPosition.wall) {
        case "front":
          return (
            <line
              x1={padding + scaledLength * offset - doorWidth / 2}
              y1={padding + scaledWidth}
              x2={padding + scaledLength * offset + doorWidth / 2}
              y2={padding + scaledWidth}
              stroke="red"
              strokeWidth={wallThickness}
            />
          )
        case "left":
          return (
            <line
              x1={padding}
              y1={padding + scaledWidth * offset - doorWidth / 2}
              x2={padding}
              y2={padding + scaledWidth * offset + doorWidth / 2}
              stroke="red"
              strokeWidth={wallThickness}
            />
          )
        case "right":
          return (
            <line
              x1={padding + scaledLength}
              y1={padding + scaledWidth * offset - doorWidth / 2}
              x2={padding + scaledLength}
              y2={padding + scaledWidth * offset + doorWidth / 2}
              stroke="red"
              strokeWidth={wallThickness}
            />
          )
        case "back":
          return (
            <line
              x1={padding + scaledLength * offset - doorWidth / 2}
              y1={padding}
              x2={padding + scaledLength * offset + doorWidth / 2}
              y2={padding}
              stroke="red"
              strokeWidth={wallThickness}
            />
          )
        default:
          return null
      }
    })()

    const corridorRect = (() => {
      switch (corridor.wall) {
        case "front":
          return (
            <rect
              x={padding}
              y={padding + scaledWidth - scaledCorridorWidth}
              width={scaledLength}
              height={scaledCorridorWidth}
              fill="#f0f0f0"
              stroke="black"
              strokeWidth={1}
            />
          )
        case "left":
          return (
            <rect
              x={padding}
              y={padding}
              width={scaledCorridorWidth}
              height={scaledWidth}
              fill="#f0f0f0"
              stroke="black"
              strokeWidth={1}
            />
          )
        case "right":
          return (
            <rect
              x={padding + scaledLength - scaledCorridorWidth}
              y={padding}
              width={scaledCorridorWidth}
              height={scaledWidth}
              fill="#f0f0f0"
              stroke="black"
              strokeWidth={1}
            />
          )
        case "back":
          return (
            <rect
              x={padding}
              y={padding}
              width={scaledLength}
              height={scaledCorridorWidth}
              fill="#f0f0f0"
              stroke="black"
              strokeWidth={1}
            />
          )
        default:
          return null
      }
    })()

    const drawRows = () => {
      if (rows.count === 0) return null

      const availableWidth =
        scaledLength - (corridor.wall === "left" || corridor.wall === "right" ? scaledCorridorWidth : 0)
      const rowWidth = availableWidth / rows.count

      return Array.from({ length: rows.count + 1 }).map((_, index) => {
        let x
        if (rows.startWall === "left") {
          x = padding + (corridor.wall === "left" ? scaledCorridorWidth : 0) + rowWidth * index
        } else {
          x = padding + scaledLength - (corridor.wall === "right" ? scaledCorridorWidth : 0) - rowWidth * index
        }

        return (
          <line
            key={`row-${index}`}
            x1={x}
            y1={padding + (corridor.wall === "back" ? scaledCorridorWidth : 0)}
            x2={x}
            y2={padding + scaledWidth - (corridor.wall === "front" ? scaledCorridorWidth : 0)}
            stroke="#0066cc"
            strokeWidth={1.5}
            strokeDasharray="4,4"
          />
        )
      })
    }

    const drawColumns = () => {
      if (columns.count === 0) return null

      const availableHeight =
        scaledWidth - (corridor.wall === "front" || corridor.wall === "back" ? scaledCorridorWidth : 0)
      const columnHeight = availableHeight / columns.count

      return Array.from({ length: columns.count + 1 }).map((_, index) => {
        const y = padding + (corridor.wall === "back" ? scaledCorridorWidth : 0) + columnHeight * index

        return (
          <line
            key={`column-${index}`}
            x1={padding + (corridor.wall === "left" ? scaledCorridorWidth : 0)}
            y1={y}
            x2={padding + scaledLength - (corridor.wall === "right" ? scaledCorridorWidth : 0)}
            y2={y}
            stroke="#0066cc"
            strokeWidth={1.5}
            strokeDasharray="4,4"
          />
        )
      })
    }

    const wallLabels = (
      <>
        <text x={padding + scaledLength / 2} y={padding - labelOffset} textAnchor="middle" fontSize={12} fill="black">
          Back
        </text>
        <text
          x={padding + scaledLength / 2}
          y={padding + scaledWidth + labelOffset + 12}
          textAnchor="middle"
          fontSize={12}
          fill="black"
        >
          Front
        </text>
        <text x={padding - labelOffset} y={padding + scaledWidth / 2} textAnchor="end" fontSize={12} fill="black">
          Left
        </text>
        <text
          x={padding + scaledLength + labelOffset}
          y={padding + scaledWidth / 2}
          textAnchor="start"
          fontSize={12}
          fill="black"
        >
          Right
        </text>
      </>
    )

    const key = (
      <g transform={`translate(${svgSize.width - keyWidth - keyMargin}, ${keyMargin})`}>
        <rect x="0" y="0" width={keyWidth} height={keyHeight} fill="white" stroke="black" strokeWidth="1" />
        <text x={keyPadding} y={keyPadding + 12} fontSize={keyFontSize} fontWeight="bold">
          Key:
        </text>
        <line
          x1={keyPadding}
          y1={keyPadding + 20}
          x2={keyPadding + 20}
          y2={keyPadding + 20}
          stroke="#666"
          strokeWidth={1.5}
          strokeDasharray="4,4"
        />
        <text x={keyPadding + 25} y={keyPadding + 23} fontSize={keyFontSize}>
          Rows ({rows.count})
        </text>
        <line
          x1={keyPadding}
          y1={keyPadding + 35}
          x2={keyPadding + 20}
          y2={keyPadding + 35}
          stroke="#0066cc"
          strokeWidth={1.5}
          strokeDasharray="4,4"
        />
        <text x={keyPadding + 25} y={keyPadding + 38} fontSize={keyFontSize}>
          Columns ({columns.count})
        </text>
        <rect x={keyPadding} y={keyPadding + 45} width="20" height="10" fill="#f0f0f0" stroke="black" strokeWidth="1" />
        <text x={keyPadding + 25} y={keyPadding + 53} fontSize={keyFontSize}>
          Corridor ({corridor.width} {unit})
        </text>
        <text x={keyPadding} y={keyPadding + 68} fontSize={keyFontSize}>
          Stack Height: {stackHeight}
        </text>
        {showDimensionsInKey && (
          <text x={keyPadding} y={keyPadding + 83} fontSize={keyFontSize}>
            {dimensions.length.toFixed(2)} × {dimensions.width.toFixed(2)} {unit}
          </text>
        )}
        <text x={keyPadding} y={keyPadding + 98} fontSize={keyFontSize}>
          Key:Room ratio = 1:{(1 / sizeRatio).toFixed(2)}
        </text>
      </g>
    )

    return (
      <>
        {baseRect}
        {corridorRect}
        {drawRows()}
        {drawColumns()}
        {door}
        {wallLabels}
        {key}
      </>
    )
  }

  return (
    <div className="w-full h-full" style={{ aspectRatio: "16 / 9" }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {drawRoom()}
      </svg>
    </div>
  )
}

export default RoomLayout2D

