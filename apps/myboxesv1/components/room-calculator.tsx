"use client"

import type React from "react"
import { useState } from "react"
import { calculateRoomVolume, calculateRoomFloorArea, calculateRoomWallArea } from "@/lib/shared/room-calculations"

interface RoomCalculatorProps {
  initialLength?: number
  initialWidth?: number
  initialHeight?: number
}

const RoomCalculator: React.FC<RoomCalculatorProps> = ({ initialLength = 10, initialWidth = 8, initialHeight = 3 }) => {
  const [length, setLength] = useState<number>(initialLength)
  const [width, setWidth] = useState<number>(initialWidth)
  const [height, setHeight] = useState<number>(initialHeight)

  const volume = calculateRoomVolume(length, width, height)
  const floorArea = calculateRoomFloorArea(length, width)
  const wallArea = calculateRoomWallArea(length, width, height)

  return (
    <div>
      <h2>Room Calculator</h2>
      <div>
        <label htmlFor="length">Length (m):</label>
        <input type="number" id="length" value={length} onChange={(e) => setLength(Number(e.target.value))} />
      </div>
      <div>
        <label htmlFor="width">Width (m):</label>
        <input type="number" id="width" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
      </div>
      <div>
        <label htmlFor="height">Height (m):</label>
        <input type="number" id="height" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
      </div>

      <div>
        <h3>Results:</h3>
        <p>Volume: {volume} m³</p>
        <p>Floor Area: {floorArea} m²</p>
        <p>Wall Area: {wallArea} m²</p>
      </div>
    </div>
  )
}

export default RoomCalculator

