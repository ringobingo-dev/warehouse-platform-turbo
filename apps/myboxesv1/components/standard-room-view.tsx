"use client"

import { ResponsiveBoxView } from "./responsive-box-view"
import { useEffect, useState } from "react"

interface StandardRoomViewProps {
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
  sideType?: string
}

// Mock function to simulate loading room data from local storage
const loadRoomDataFromLocalStorage = (roomId: string): RoomData => {
  // Replace this with your actual data loading logic
  return { sideType: roomId === "splitRoom" ? "EAST" : undefined }
}

/**
 * StandardRoomView - A standardized 3D room visualization component
 *
 * This component provides a consistent interface for displaying 3D room visualizations
 * across the application. It wraps the ResponsiveBoxView component with standardized
 * configuration settings.
 *
 * @param refreshKey - A number that changes to trigger a refresh of the view
 * @param onRefresh - Function to call when the view needs to be refreshed
 * @param roomId - The ID of the room to display
 * @param boxCount - The number of boxes in the room (string or number)
 * @param className - Optional additional CSS classes
 * @param isSplitSide - Whether this is a side of a split room (EAST or WEST)
 * @param sideType - The type of side if this is a split room side
 */
export function StandardRoomView({
  refreshKey = 0,
  onRefresh,
  roomId,
  boxCount = 0,
  className = "",
  hideControls,
  visualizationMode,
  is3DOnly,
  isSplitSide,
  sideType,
  roomName,
}: StandardRoomViewProps) {
  // Ensure boxCount is always treated as a number
  const safeBoxCount = typeof boxCount === "number" ? boxCount : 0
  // Convert boxCount to string if it's a number
  const boxCountString = String(safeBoxCount)
  const [roomData, setRoomData] = useState<RoomData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [componentKey, setComponentKey] = useState(0)

  useEffect(() => {
    // Create a unique key when props change to force a complete remount
    setComponentKey((prevKey) => prevKey + 1)

    // Log when the component refreshes
    console.log("StandardRoomView refreshing with roomId:", roomId)

    if (roomId) {
      try {
        // Log that we're attempting to load the room
        console.log("Attempting to load room data for ID:", roomId)

        // Load the room data
        const roomData = loadRoomDataFromLocalStorage(roomId)
        console.log("Loaded room data:", roomData)

        // Check if it's a split room side
        if (roomData.sideType) {
          console.log(`Rendering ${roomData.sideType} side of split room`)
        }

        // Set the room data in state
        setRoomData(roomData)
      } catch (error) {
        console.error("Error loading room data:", error)
        setError("Failed to load room data")
      }
    }
  }, [roomId, refreshKey, isSplitSide, sideType])

  // If there's an error, show an error message
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className={className}>
      <ResponsiveBoxView
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
      />
    </div>
  )
}

