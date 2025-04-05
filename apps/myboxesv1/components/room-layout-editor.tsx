"use client"

import { useState } from "react"
import { RoomLayoutVisualization } from "@/components/room-layout-visualization"
import { SplitSideRoomVisualization } from "@/components/split-side-room-visualization"

interface DoorConfig {
  wall: "front" | "back" | "left" | "right"
  offset: number
  width: number
}

interface CorridorConfig {
  wall: "front" | "back" | "left" | "right"
  width: number
}

interface StorageConfig {
  rows: {
    count: number
    startWall: "front" | "back"
  }
  columns: {
    count: number
  }
  stackHeight: number
  leftSide?: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  rightSide?: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
}

interface RoomLayoutEditorProps {
  roomShape: string
  length: number
  width: number
  doorConfig: DoorConfig
  corridorConfig: CorridorConfig
  storageConfig: StorageConfig
  leftSideLength?: number
  leftSideWidth?: number
  rightSideLength?: number
  rightSideWidth?: number
  leftSideName?: string
  rightSideName?: string
  leftSideConfigured?: boolean
  rightSideConfigured?: boolean
}

export function RoomLayoutEditor({
  roomShape,
  length,
  width,
  doorConfig,
  corridorConfig,
  storageConfig,
  leftSideLength = 0,
  leftSideWidth = 0,
  rightSideLength = 0,
  rightSideWidth = 0,
  leftSideName = "EAST",
  rightSideName = "WEST",
  leftSideConfigured = false,
  rightSideConfigured = false,
}: RoomLayoutEditorProps) {
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-medium mb-4">Room Layout Visualization</h3>
      <div className="w-full h-[400px] min-h-[350px] bg-white rounded-md border overflow-hidden flex items-center justify-center">
        {roomShape === "split-side" ? (
          <SplitSideRoomVisualization
            leftSideLength={leftSideLength}
            leftSideWidth={leftSideWidth}
            rightSideLength={rightSideLength}
            rightSideWidth={rightSideWidth}
            leftSideName={leftSideName}
            rightSideName={rightSideName}
            doorConfig={doorConfig}
            corridorConfig={corridorConfig}
            storageConfig={storageConfig}
            leftSideConfig={storageConfig.leftSide!}
            rightSideConfig={storageConfig.rightSide!}
            leftSideConfigured={leftSideConfigured}
            rightSideConfigured={rightSideConfigured}
            showGrid={showGrid}
            showLabels={showLabels}
          />
        ) : (
          <RoomLayoutVisualization
            roomShape={roomShape}
            length={length}
            width={width}
            doorConfig={doorConfig}
            corridorConfig={corridorConfig}
            storageConfig={storageConfig}
            showGrid={showGrid}
            showLabels={showLabels}
          />
        )}
      </div>
    </div>
  )
}

