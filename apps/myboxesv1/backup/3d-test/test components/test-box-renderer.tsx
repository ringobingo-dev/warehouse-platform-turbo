"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Text } from "@react-three/drei"
import { EffectComposer, N8AO } from "@react-three/postprocessing"
import { Suspense, useRef, useMemo } from "react"
import * as THREE from "three"
import { COLORS, ROOM_DIMENSIONS, CANVAS_DIMENSIONS } from "../../config/constants"

// Constants for room appearance
const ROOM_STYLE = {
  WALL_COLOR: "#f5f5dc", // Beige color for walls
  FLOOR_COLOR: "#d3d3d3", // Light gray for floor
  GRID_COLOR: "#666666", // Darker gray for grid lines
  ROOM_SIZE: 20,
  WALL_HEIGHT: 15,
  WALL_OPACITY: 0.8
}

interface TestBoxRendererProps {
  className?: string
  height?: number
  rows?: number
  columns?: number
  stackHeight?: number
  boxColor?: string
  isFiltered?: boolean
  visualizationMode?: "basic" | "enhanced" | "realistic"
}

// Dynamically import the ThreeDViewClient component with SSR disabled
const TestThreeDViewClient = dynamic(() => import('./TestThreeDViewClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading 3D view...</p>
      </div>
    </div>
  )
})

function RoomEnvironment({
  rows = 8,
  columns = 12,
  levels = 4,
  boxColor = "#8B4513",
  isFiltered = false,
  visualizationMode = "enhanced"
}) {
  const halfSize = ROOM_DIMENSIONS.FLOOR_SIZE / 2
  const wallHeight = ROOM_DIMENSIONS.ROOM_HEIGHT
  const groupRef = useRef<THREE.Group>(null)
  const { scene, camera } = useThree()

  // Generate floor texture
  const floorTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = CANVAS_DIMENSIONS.WIDTH
    canvas.height = CANVAS_DIMENSIONS.HEIGHT
    const context = canvas.getContext("2d")
    if (context) {
      context.fillStyle = COLORS.FLOOR
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = "rgba(0, 0, 255, 0.5)"
      context.setLineDash([10, 10])
      context.lineWidth = 2

      // Draw columns
      for (let i = 0; i <= columns; i++) {
        const x = (i / columns) * canvas.width
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, canvas.height)
        context.stroke()
      }

      // Draw rows
      for (let i = 0; i <= rows; i++) {
        const y = (i / rows) * canvas.height
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(canvas.width, y)
        context.stroke()
      }
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [rows, columns])

  // Generate lighting based on visualization mode
  const lighting = useMemo(() => {
    switch (visualizationMode) {
      case "basic":
        return (
          <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
          </>
        )
      case "enhanced":
        return (
          <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
            <pointLight position={[-5, 10, -5]} intensity={0.5} />
            <spotLight position={[0, 15, 0]} angle={0.5} penumbra={0.5} intensity={0.5} castShadow />
          </>
        )
      case "realistic":
        return (
          <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-5, 10, -5]} intensity={0.5} />
            <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={0.8} castShadow />
          </>
        )
      default:
        return (
          <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
          </>
        )
    }
  }, [visualizationMode])

  return (
    <group ref={groupRef}>
      {/* Room walls */}
      <mesh position={[0, wallHeight/2, -halfSize]}>
        <boxGeometry args={[ROOM_DIMENSIONS.FLOOR_SIZE, wallHeight, 0.1]} />
        <meshStandardMaterial color={COLORS.WALL} />
      </mesh>
      <mesh position={[0, wallHeight/2, halfSize]}>
        <boxGeometry args={[ROOM_DIMENSIONS.FLOOR_SIZE, wallHeight, 0.1]} />
        <meshStandardMaterial color={COLORS.WALL} />
      </mesh>
      <mesh position={[-halfSize, wallHeight/2, 0]}>
        <boxGeometry args={[0.1, wallHeight, ROOM_DIMENSIONS.FLOOR_SIZE]} />
        <meshStandardMaterial color={COLORS.WALL} />
      </mesh>
      <mesh position={[halfSize, wallHeight/2, 0]}>
        <boxGeometry args={[0.1, wallHeight, ROOM_DIMENSIONS.FLOOR_SIZE]} />
        <meshStandardMaterial color={COLORS.WALL} />
      </mesh>

      {/* Floor with dynamic texture */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[ROOM_DIMENSIONS.FLOOR_SIZE, ROOM_DIMENSIONS.FLOOR_SIZE]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Wall labels */}
      <Text
        position={[0, wallHeight - 1, -halfSize + 0.1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Front
      </Text>
      <Text
        position={[0, wallHeight - 1, halfSize - 0.1]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Back
      </Text>
      <Text
        position={[-halfSize + 0.1, wallHeight - 1, 0]}
        rotation={[0, Math.PI/2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Left
      </Text>
      <Text
        position={[halfSize - 0.1, wallHeight - 1, 0]}
        rotation={[0, -Math.PI/2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Right
      </Text>

      {/* Room dimensions text */}
      <Text
        position={[0, wallHeight - 2, -halfSize + 0.1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`${rows}x${columns}x${levels}`}
      </Text>

      {lighting}
    </group>
  )
}

export default function TestBoxRenderer({
  className = "",
  height = 600,
  rows = 8,
  columns = 12,
  stackHeight = 4,
  boxColor = "#8B4513",
  isFiltered = false,
  visualizationMode = "enhanced"
}: TestBoxRendererProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate post-processing effects
  const postProcessing = useMemo(() => {
    switch (visualizationMode) {
      case "basic":
        return null
      case "enhanced":
        return (
          <EffectComposer>
            <N8AO intensity={1.5} color="black" aoRadius={2} aoSamples={5} />
          </EffectComposer>
        )
      case "realistic":
        return (
          <EffectComposer>
            <N8AO intensity={3} color="black" aoRadius={3} aoSamples={8} />
          </EffectComposer>
        )
      default:
        return null
    }
  }, [visualizationMode])

  if (!isClient) {
    return (
      <div className={className} style={{ height: `${height}px` }}>
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading 3D view...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ height: `${height}px` }}>
      <TestThreeDViewClient
        rows={rows}
        columns={columns}
        levels={stackHeight}
        boxColor={boxColor}
        isFiltered={isFiltered}
        visualizationMode={visualizationMode}
      />
    </div>
  )
} 