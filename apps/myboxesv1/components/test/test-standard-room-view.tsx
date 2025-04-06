"use client"

import { useEffect, useState } from "react"
import { getAllRoomsFromLocalStorage } from "../../lib/client-storage-utils"
import TestResponsiveBoxView from "./test-responsive-box-view"

interface TestStandardRoomViewProps {
  refreshKey?: number
  onRefresh?: () => void
  roomId: string | null
  boxCount?: number
  className?: string
  hideControls?: boolean
  visualizationMode?: "basic" | "enhanced" | "realistic"
  is3DOnly?: boolean
  isSplitSide?: boolean
  sideType?: "EAST" | "WEST" | string
  roomName?: string
}

interface RoomData {
  id: string
  name: string
  rows: number
  columns: number
  levels: number
  sideType?: string
}

// Load room data from local storage
const loadRoomDataFromLocalStorage = (roomId: string): RoomData | null => {
  try {
    const allRooms = getAllRoomsFromLocalStorage()
    const room = allRooms.find((r: any) => r.id === roomId)
    
    if (!room) return null

    return {
      id: room.id,
      name: room.roomName || room.name || `Room ${room.id}`,
      rows: room.rows?.count || room.storageConfig?.rows?.count || 8,
      columns: room.columns?.count || room.storageConfig?.columns?.count || 12,
      levels: room.levels || 4,
      sideType: room.sideType ||
        (room.name && room.name.includes("EAST")
          ? "EAST"
          : room.name && room.name.includes("WEST")
            ? "WEST"
            : undefined)
    }
  } catch (error) {
    console.error("Error loading room data:", error)
    return null
  }
}

/**
 * TestStandardRoomView - A test implementation of the standardized 3D room visualization
 * 
 * This component matches the structure of the original StandardRoomView component,
 * providing a consistent interface for displaying 3D room visualizations.
 */
export default function TestStandardRoomView({
  refreshKey = 0,
  onRefresh,
  roomId,
  boxCount = 0,
  className = "",
  hideControls,
  visualizationMode = "enhanced",
  is3DOnly,
  isSplitSide,
  sideType,
  roomName,
}: TestStandardRoomViewProps) {
  const safeBoxCount = typeof boxCount === "number" ? boxCount : 0
  const boxCountString = String(safeBoxCount)
  const [roomData, setRoomData] = useState<RoomData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [componentKey, setComponentKey] = useState(0)

  useEffect(() => {
    setComponentKey((prevKey) => prevKey + 1)
    console.log("TestStandardRoomView refreshing with roomId:", roomId)

    if (roomId) {
      try {
        console.log("Attempting to load room data for ID:", roomId)
        const data = loadRoomDataFromLocalStorage(roomId)
        console.log("Loaded room data:", data)

        if (data?.sideType) {
          console.log(`Rendering ${data.sideType} side of split room`)
        }

        setRoomData(data)
        if (!data) {
          setError("Room not found")
        }
      } catch (error) {
        console.error("Error loading room data:", error)
        setError("Failed to load room data")
      }
    }
  }, [roomId, refreshKey, isSplitSide, sideType])

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className={className}>
      <TestResponsiveBoxView
        key={`room-view-${componentKey}`}
        refreshKey={refreshKey || 0}
        onRefresh={onRefresh || (() => {})}
        height="600px"
        showControls={!hideControls}
        fullWidth={true}
        roomId={roomId || undefined}
        boxCount={boxCountString}
        visualizationMode={visualizationMode}
        isSplitSide={isSplitSide}
        sideType={sideType as "EAST" | "WEST" | undefined}
        roomName={roomName || roomId || undefined}
        rows={roomData?.rows || 8}
        columns={roomData?.columns || 12}
        levels={roomData?.levels || 4}
      />
    </div>
  )
} 