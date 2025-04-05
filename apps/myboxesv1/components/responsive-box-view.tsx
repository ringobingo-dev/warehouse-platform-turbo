"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei"
import { RoomEnvironment } from "@/components/room-environment"
import { useBoxContext } from "@/context/BoxContext"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResponsiveBoxViewProps {
  refreshKey: number
  onRefresh: () => void
  height?: string
  showControls?: boolean
  fullWidth?: boolean
  roomId?: string
  boxCount?: string
  visualizationMode?: "basic" | "enhanced" | "realistic"
  isSplitSide?: boolean
  sideType?: "EAST" | "WEST"
  roomName?: string
}

export function ResponsiveBoxView({
  refreshKey,
  onRefresh,
  height = "600px",
  showControls = true,
  fullWidth = false,
  roomId,
  boxCount,
  visualizationMode: propVisualizationMode,
  isSplitSide = false,
  sideType,
  roomName,
}: ResponsiveBoxViewProps) {
  const { rows, columns, levels, boxes, customerBoxColor, filteredBoxes } = useBoxContext()
  const [visualizationMode, setVisualizationMode] = useState<"basic" | "enhanced" | "realistic">(
    propVisualizationMode || "enhanced",
  )
  const [isFullscreen, setIsFullscreen] = useState(false)
  const controlsRef = useRef<any>(null)
  const [internalRefreshKey, setInternalRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Force a refresh when boxes change
  useEffect(() => {
    setInternalRefreshKey((prev) => prev + 1)
  }, [refreshKey, boxes, filteredBoxes])

  // Update visualization mode when prop changes
  useEffect(() => {
    if (propVisualizationMode) {
      setVisualizationMode(propVisualizationMode)
    }
  }, [propVisualizationMode])

  // Check if we have filtered boxes
  const hasFilteredBoxes = Array.isArray(filteredBoxes) && filteredBoxes.length > 0

  // Get the display boxes - ensure it's always an array
  const displayBoxes = hasFilteredBoxes ? filteredBoxes : Array.isArray(boxes) ? boxes : []

  // Calculate box count as a string - ensure it's always a string
  const boxCountString = typeof boxCount === "string" ? boxCount : String(displayBoxes.length)

  // Add logging to debug room rendering
  useEffect(() => {
    console.log("ResponsiveBoxView rendering with roomId:", roomId)
    if (isSplitSide) {
      console.log(`Rendering ${sideType} side of split room`)
    }
  }, [roomId, isSplitSide, sideType])

  // Update the title to show the room name instead of generic "3D Room View"
  const roomTitle = isSplitSide
    ? `${roomName || roomId} (${sideType} Side) (${boxCountString} boxes)${hasFilteredBoxes ? " - filtered view" : ""}`
    : `${roomName || "3D Room View"} (${boxCountString} boxes)${hasFilteredBoxes ? " - filtered view" : ""}`

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset?.()
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleManualRefresh = () => {
    setInternalRefreshKey((prev) => prev + 1)
    if (onRefresh) {
      onRefresh()
    }
  }

  // Simplified 3D scene component to reduce complexity
  const Scene = () => {
    return (
      <>
        <PerspectiveCamera makeDefault position={[10, 8, 15]} fov={45} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <RoomEnvironment
          rows={typeof rows === "number" ? rows : 5}
          columns={typeof columns === "number" ? columns : 5}
          levels={typeof levels === "number" ? levels : 3}
          boxes={displayBoxes}
          boxColor={customerBoxColor || "#8B4513"}
          isFiltered={hasFilteredBoxes}
          visualizationMode={visualizationMode}
        />

        <ContactShadows position={[0, -0.015, 0]} opacity={0.4} scale={20} blur={2} far={4} />
        <Environment preset="warehouse" />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
          target={[0, 2, 0]}
          makeDefault
        />
      </>
    )
  }

  return (
    <div
      className={`flex flex-col border rounded-lg bg-white w-full overflow-hidden
        ${isFullscreen ? "fixed inset-0 z-50 p-4 bg-background" : ""}`}
      style={{
        height: isFullscreen ? "100vh" : height,
        maxWidth: fullWidth ? "100%" : undefined,
      }}
    >
      {showControls && (
        <div className="p-3 border-b flex justify-between items-center">
          {/* Empty div to maintain layout with justify-between */}
          <div></div>
          <div className="flex items-center gap-2">
            <Select
              value={visualizationMode}
              onValueChange={(value: "basic" | "enhanced" | "realistic") => setVisualizationMode(value)}
            >
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue placeholder="Visualization Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="enhanced">Enhanced</SelectItem>
                <SelectItem value="realistic">Realistic</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleManualRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-600">Loading 3D view...</p>
            </div>
          </div>
        )}

        <Canvas
          shadows
          className="!absolute inset-0"
          style={{ width: "100%", height: "100%" }}
          onCreated={() => setIsLoading(false)}
        >
          <Scene />
        </Canvas>

        <div className="absolute bottom-4 left-4 z-10 flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={resetCamera}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (controlsRef.current) {
                controlsRef.current.zoomIn?.(1.2)
              }
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (controlsRef.current) {
                controlsRef.current.zoomOut?.(1.2)
              }
            }}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

