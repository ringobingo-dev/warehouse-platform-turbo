// moved to shared folder for reuse and NX prep
"use client"

import { useState, useEffect } from "react"
import { type Box, calculateBoxVolume, calculateBoxSurfaceArea } from "@/lib/shared/box-calculations"

interface BoxDimensions {
  width: number
  height: number
  depth: number
  volume: number
  surfaceArea?: number
  diagonal?: number
}

/**
 * A hook that calculates and returns the dimensions of a box
 * @param box The box object containing dimension data
 * @returns An object containing the calculated dimensions and volume
 */
export function useBoxDimensions(box: Box | null): BoxDimensions {
  const [dimensions, setDimensions] = useState<BoxDimensions>({
    width: 0,
    height: 0,
    depth: 0,
    volume: 0,
  })

  useEffect(() => {
    if (!box) return

    const width = box.width || 0
    const height = box.height || 0
    const depth = box.depth || 0
    const volume = calculateBoxVolume(box)
    const surfaceArea = calculateBoxSurfaceArea(box)
    const diagonal = Math.sqrt(width * width + height * height + depth * depth)

    setDimensions({
      width,
      height,
      depth,
      volume,
      surfaceArea,
      diagonal,
    })
  }, [box])

  return dimensions
}

