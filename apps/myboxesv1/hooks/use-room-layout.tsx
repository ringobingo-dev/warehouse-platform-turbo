// moved to shared folder for reuse and NX prep
"use client"

import { useState, useEffect } from "react"
import {
  type RoomConfig,
  calculateRoomVolume,
  calculateRoomFloorArea,
  calculateRoomWallArea,
} from "@/lib/shared/room-calculations"

interface RoomLayout {
  width: number
  length: number
  height: number
  area: number
  volume: number
  wallArea?: number
}

/**
 * A hook that calculates and returns the layout dimensions of a room
 * @param roomConfig The room configuration object
 * @returns An object containing the calculated dimensions, area, and volume
 */
export function useRoomLayout(roomConfig: RoomConfig | null): RoomLayout {
  const [layout, setLayout] = useState<RoomLayout>({
    width: 0,
    length: 0,
    height: 0,
    area: 0,
    volume: 0,
  })

  useEffect(() => {
    if (!roomConfig) return

    const width = roomConfig.width || 0
    const length = roomConfig.length || 0
    const height = roomConfig.height || 0
    const area = calculateRoomFloorArea(roomConfig)
    const volume = calculateRoomVolume(roomConfig)
    const wallArea = calculateRoomWallArea(roomConfig)

    setLayout({
      width,
      length,
      height,
      area,
      volume,
      wallArea,
    })
  }, [roomConfig])

  return layout
}

