"use client"

/**
 * TestView3D Component
 * Matches the original 3D view implementation for consistent room presentation
 */

import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import { Suspense, useEffect, useMemo } from "react"
import * as THREE from "three"

// Constants for room appearance
const ROOM_STYLE = {
  WALL_COLOR: "#f5f5dc", // Beige color for walls
  FLOOR_COLOR: "#d3d3d3", // Light gray for floor
  GRID_COLOR: "#666666", // Darker gray for grid lines
  ROOM_SIZE: 20,
  WALL_HEIGHT: 15,
  WALL_OPACITY: 0.8
}

// Interfaces matching the original implementation
interface Box {
  size: "rectangle" | "square"
  row: number
  column: number
  level: number
  color: string
  highlighted: boolean
  varietyName: string
  grade: string
  loadingDate: string
}

interface TestView3DProps {
  rows: number
  columns: number
  levels: number
  boxes: Box[]
  boxColor: string
  isFiltered: boolean
  visualizationMode: "basic" | "enhanced" | "realistic"
  refreshKey: number
}

// Constants for room dimensions and visualization
const ROOM_DIMENSIONS = {
  FLOOR_SIZE: 20,
  ROOM_HEIGHT: 10,
  BOX_SPACING: 0.1, // Gap between boxes
  BOX_BASE_SIZE: {
    SQUARE: [1, 1.2, 1] as [number, number, number],
    RECTANGLE: [2, 1.2, 1] as [number, number, number]
  }
}

const COLORS = {
  BACKGROUND: "#f0f0f0",
  FLOOR: "#ffffff",
  GRID: "rgba(0, 0, 255, 0.3)"
}

function WallLabel({ text, position, rotation }: { text: string; position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <Text
      position={position}
      rotation={rotation || [0, 0, 0]}
      fontSize={2}
      color="#333333"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )
}

function Room() {
  const halfSize = ROOM_STYLE.ROOM_SIZE / 2
  const wallHeight = ROOM_STYLE.WALL_HEIGHT

  // Wall material
  const wallMaterial = useMemo(() => (
    new THREE.MeshStandardMaterial({
      color: ROOM_STYLE.WALL_COLOR,
      transparent: true,
      opacity: ROOM_STYLE.WALL_OPACITY,
      side: THREE.DoubleSide
    })
  ), [])

  return (
    <group>
      {/* Back Wall */}
      <mesh position={[0, wallHeight/2, -halfSize]} material={wallMaterial}>
        <planeGeometry args={[ROOM_STYLE.ROOM_SIZE, wallHeight]} />
      </mesh>
      <WallLabel text="Back Wall" position={[0, wallHeight - 2, -halfSize + 0.1]} />

      {/* Left Wall */}
      <mesh position={[-halfSize, wallHeight/2, 0]} rotation={[0, Math.PI/2, 0]} material={wallMaterial}>
        <planeGeometry args={[ROOM_STYLE.ROOM_SIZE, wallHeight]} />
      </mesh>
      <WallLabel 
        text="Left Wall" 
        position={[-halfSize + 0.1, wallHeight - 2, 0]}
        rotation={[0, Math.PI/2, 0]}
      />

      {/* Right Wall */}
      <mesh position={[halfSize, wallHeight/2, 0]} rotation={[0, -Math.PI/2, 0]} material={wallMaterial}>
        <planeGeometry args={[ROOM_STYLE.ROOM_SIZE, wallHeight]} />
      </mesh>
      <WallLabel 
        text="Right Wall" 
        position={[halfSize - 0.1, wallHeight - 2, 0]}
        rotation={[0, -Math.PI/2, 0]}
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[ROOM_STYLE.ROOM_SIZE, ROOM_STYLE.ROOM_SIZE]} />
        <meshStandardMaterial color={ROOM_STYLE.FLOOR_COLOR} />
      </mesh>
    </group>
  )
}

/**
 * Calculate box position based on room configuration
 */
function calculateBoxPosition(
  row: number,
  column: number,
  level: number,
  totalRows: number,
  totalColumns: number
): [number, number, number] {
  // Center the grid and account for box spacing
  const xOffset = -(totalColumns * (ROOM_DIMENSIONS.BOX_BASE_SIZE.SQUARE[0] + ROOM_DIMENSIONS.BOX_SPACING)) / 2
  const zOffset = -(totalRows * (ROOM_DIMENSIONS.BOX_BASE_SIZE.SQUARE[2] + ROOM_DIMENSIONS.BOX_SPACING)) / 2
  
  return [
    xOffset + column * (ROOM_DIMENSIONS.BOX_BASE_SIZE.SQUARE[0] + ROOM_DIMENSIONS.BOX_SPACING),
    level * (ROOM_DIMENSIONS.BOX_BASE_SIZE.SQUARE[1] + ROOM_DIMENSIONS.BOX_SPACING),
    zOffset + row * (ROOM_DIMENSIONS.BOX_BASE_SIZE.SQUARE[2] + ROOM_DIMENSIONS.BOX_SPACING)
  ]
}

/**
 * Box Component
 * Renders a single box with proper positioning and material
 */
function BoxMesh({ box, position }: { box: Box; position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, box.size === "rectangle" ? 2 : 1]} />
      <meshStandardMaterial 
        color={box.color} 
        opacity={box.highlighted ? 0.8 : 1}
        transparent={box.highlighted}
      />
    </mesh>
  )
}

/**
 * Scene Component
 * Renders the complete room environment with proper scaling and grid
 */
function Scene({ boxes, visualizationMode }: { boxes: Box[]; visualizationMode: string }) {
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color("#ffffff")
  }, [scene])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} />
      
      {/* Room and Grid */}
      <Room />
      <gridHelper 
        args={[ROOM_STYLE.ROOM_SIZE, 20, ROOM_STYLE.GRID_COLOR, ROOM_STYLE.GRID_COLOR]} 
        position={[0, 0.01, 0]}
      />
      
      {/* Boxes */}
      {boxes.map((box, index) => (
        <BoxMesh
          key={index}
          box={box}
          position={[box.row * 1.2, box.level * 1.2, box.column * 1.2]}
        />
      ))}
    </>
  )
}

/**
 * Main TestView3D Component
 * Matches the original implementation's configuration
 */
export default function TestView3D({
  boxes,
  visualizationMode,
  refreshKey,
  ...props
}: TestView3DProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene boxes={boxes} visualizationMode={visualizationMode} />
          <OrbitControls 
            enableDamping={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={5}
            maxDistance={40}
          />
          <PerspectiveCamera
            makeDefault
            position={[15, 10, 15]}
            fov={45}
            near={0.1}
            far={1000}
          />
        </Suspense>
      </Canvas>
    </div>
  )
} 