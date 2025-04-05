"use client"

import type React from "react"
import { useState } from "react"
import { calculateBoxVolume, calculateBoxSurfaceArea } from "@/lib/shared/box-calculations"

interface BoxCalculatorProps {
  initialLength?: number
  initialWidth?: number
  initialHeight?: number
}

const BoxCalculator: React.FC<BoxCalculatorProps> = ({ initialLength = 0, initialWidth = 0, initialHeight = 0 }) => {
  const [length, setLength] = useState<number>(initialLength)
  const [width, setWidth] = useState<number>(initialWidth)
  const [height, setHeight] = useState<number>(initialHeight)
  const [volume, setVolume] = useState<number>(calculateBoxVolume(length, width, height))
  const [surfaceArea, setSurfaceArea] = useState<number>(calculateBoxSurfaceArea(length, width, height))

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = Number.parseFloat(e.target.value) || 0
    setLength(newLength)
    setVolume(calculateBoxVolume(newLength, width, height))
    setSurfaceArea(calculateBoxSurfaceArea(newLength, width, height))
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number.parseFloat(e.target.value) || 0
    setWidth(newWidth)
    setVolume(calculateBoxVolume(length, newWidth, height))
    setSurfaceArea(calculateBoxSurfaceArea(length, newWidth, height))
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number.parseFloat(e.target.value) || 0
    setHeight(newHeight)
    setVolume(calculateBoxVolume(length, width, newHeight))
    setSurfaceArea(calculateBoxSurfaceArea(length, width, newHeight))
  }

  return (
    <div>
      <h2>Box Calculator</h2>
      <div>
        <label htmlFor="length">Length:</label>
        <input type="number" id="length" value={length} onChange={handleLengthChange} />
      </div>
      <div>
        <label htmlFor="width">Width:</label>
        <input type="number" id="width" value={width} onChange={handleWidthChange} />
      </div>
      <div>
        <label htmlFor="height">Height:</label>
        <input type="number" id="height" value={height} onChange={handleHeightChange} />
      </div>
      <div>
        <p>Volume: {volume}</p>
        <p>Surface Area: {surfaceArea}</p>
      </div>
    </div>
  )
}

export default BoxCalculator

