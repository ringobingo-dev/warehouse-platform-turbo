"use client"

import { useState, useEffect, useRef } from "react"
import { useBoxContext } from "../../context/BoxContext"
import TestBoxRenderer from "./test-box-renderer"
import { OrbitControls } from "@react-three/drei"
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface TestResponsiveBoxViewProps {
  refreshKey: number
  onRefresh: () => void
  height?: string
  showControls?: boolean
  fullWidth?: boolean
  roomId?: string
  boxCount?: string
  visualizationMode?: "basic" | "enhanced" | "realistic"
  isSplitSide?: boolean
  sideType?: "EAST" | "WEST" | undefined
  roomName?: string
  rows?: number
  columns?: number
  levels?: number
}

interface Box {
  id: string
  position: [number, number, number]
  size: [number, number, number]
  color?: string
}

interface BoxContextType {
  boxes: Box[]
  customerBoxColor?: string
  filteredBoxes: Box[]
}

/**
 * TestResponsiveBoxView - A test implementation of the responsive box view
 * 
 * This component matches the structure of the original ResponsiveBoxView component,
 * handling the responsive layout and visualization modes for the 3D view.
 */
export default function TestResponsiveBoxView({
  refreshKey,
  onRefresh,
  height = "600px",
  showControls = true,
  fullWidth = false,
  roomId,
  boxCount = "0",
  visualizationMode = "enhanced",
  isSplitSide = false,
  sideType,
  roomName,
  rows = 8,
  columns = 12,
  levels = 4,
}: TestResponsiveBoxViewProps) {
  const { boxes = [], customerBoxColor, filteredBoxes = [] } = useBoxContext() as BoxContextType
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [internalRefreshKey, setInternalRefreshKey] = useState(0)
  const [cameraKey, setCameraKey] = useState(0)

  // Use filtered boxes if available, otherwise use all boxes
  const displayBoxes = filteredBoxes.length > 0 ? filteredBoxes : boxes
  const hasFilteredBoxes = filteredBoxes.length > 0
  const boxCountString = boxCount || String(displayBoxes.length)

  useEffect(() => {
    // Log room dimensions and state for debugging
    console.log("Room dimensions:", { rows, columns, levels })
    console.log("Room ID:", roomId)
    console.log("Box count:", boxCountString)
    console.log("Visualization mode:", visualizationMode)
    if (isSplitSide) {
      console.log(`Rendering ${sideType} side of split room`)
    }
  }, [roomId, rows, columns, levels, isSplitSide, sideType, boxCountString, visualizationMode])

  // Update internal refresh key when external key changes
  useEffect(() => {
    setInternalRefreshKey(refreshKey)
  }, [refreshKey])

  // Reset camera position by updating the key
  const resetCamera = () => {
    setCameraKey(prev => prev + 1)
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle manual refresh
  const handleManualRefresh = () => {
    setInternalRefreshKey((prev) => prev + 1)
    if (onRefresh) {
      onRefresh()
    }
  }

  // Update the title to show the room name and box count
  const roomTitle = isSplitSide
    ? `${roomName || roomId} (${sideType} Side) (${boxCountString} boxes)${hasFilteredBoxes ? " - filtered view" : ""}`
    : `${roomName || "3D Room View"} (${boxCountString} boxes)${hasFilteredBoxes ? " - filtered view" : ""}`

  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-auto"}`}>
      <TestBoxRenderer
        key={`room-view-${internalRefreshKey}-camera-${cameraKey}`}
        className="rounded-lg shadow-lg"
        height={parseInt(height) || 600}
        rows={rows}
        columns={columns}
        stackHeight={levels}
        boxColor={customerBoxColor || "#8B4513"}
        isFiltered={hasFilteredBoxes}
        visualizationMode={visualizationMode}
      />
      
      {showControls && (
        <div className="absolute bottom-4 left-4 space-y-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-sm">
            <h3 className="font-medium mb-1">Navigation Tips</h3>
            <p className="text-gray-600">
              Left-click and drag to rotate. Right-click and drag to pan. Scroll to zoom.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-sm">
            <h3 className="font-medium mb-1">Room Info</h3>
            <p className="text-gray-600">
              {roomTitle}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-sm">
            <h3 className="font-medium mb-1">Box Count</h3>
            <p className="text-gray-600">
              Showing {boxCountString} boxes
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-sm">
            <h3 className="font-medium mb-1">Visualization Mode</h3>
            <p className="text-gray-600">
              {visualizationMode === "enhanced" ? "Enhanced - Improved Lighting And Shadows" : visualizationMode}
            </p>
          </div>
        </div>
      )}

      {/* Camera reset button */}
      {showControls && (
        <button
          onClick={resetCamera}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 text-sm hover:bg-white/90 transition-colors"
        >
          Reset Camera
        </button>
      )}
    </div>
  )
} 