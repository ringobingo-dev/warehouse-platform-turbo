"use client"

import React, { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { TestRoomEnvironment } from "./TestRoomEnvironment"
import { Box } from "../../types/Box"
import { useToast } from "../../components/ui/use-toast"
import { COLORS } from "../../config/constants"

interface TestThreeDViewClientProps {
  rows?: number
  columns?: number
  levels?: number
  boxColor?: string
  isFiltered?: boolean
  visualizationMode?: "basic" | "enhanced" | "realistic"
  boxes?: Box[]
}

export const TestThreeDViewClient: React.FC<TestThreeDViewClientProps> = ({
  rows = 8,
  columns = 12,
  levels = 4,
  boxColor = "#8B4513",
  isFiltered = false,
  visualizationMode = "enhanced",
  boxes = []
}) => {
  const { toast } = useToast()
  const [selectedBox, setSelectedBox] = useState<Box | null>(null)

  const handleBoxClick = (box: Box) => {
    setSelectedBox(box)
    toast({
      title: "Box Selected",
      description: `Selected box at position (${box.row}, ${box.column}, ${box.level})`,
      duration: 2000,
    })
  }

  const handleBoxHover = (box: Box | null) => {
    if (box) {
      console.log(`Hovering over box at position (${box.row}, ${box.column}, ${box.level})`)
    }
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          toneMapping: THREE.NoToneMapping,
          outputEncoding: THREE.LinearEncoding
        }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
        <Environment preset="city" />
        <TestRoomEnvironment
          rows={rows}
          columns={columns}
          levels={levels}
          boxColor={boxColor}
          isFiltered={isFiltered}
          visualizationMode={visualizationMode}
          boxes={boxes}
          onBoxClick={handleBoxClick}
          onBoxHover={handleBoxHover}
        />
      </Canvas>
    </div>
  )
} 