"use client"

import React, { useRef, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"
import { COLORS, ROOM_DIMENSIONS } from "../../config/constants"
import { TestBoxModel } from "./test-box-model"
import { Box } from "../../types/Box"

interface TestRoomEnvironmentProps {
  rows: number
  columns: number
  levels: number
  boxColor: string
  isFiltered: boolean
  visualizationMode: "basic" | "enhanced" | "realistic"
  boxes?: Box[]
  onBoxClick?: (box: Box) => void
  onBoxHover?: (box: Box | null) => void
}

export const TestRoomEnvironment: React.FC<TestRoomEnvironmentProps> = ({
  rows = 8,
  columns = 12,
  levels = 4,
  boxColor = "#8B4513",
  isFiltered = false,
  visualizationMode = "enhanced",
  boxes = [],
  onBoxClick,
  onBoxHover
}) => {
  const halfSize = ROOM_DIMENSIONS.FLOOR_SIZE / 2
  const wallHeight = ROOM_DIMENSIONS.HEIGHT
  const groupRef = useRef<THREE.Group>(null)

  // Create basic materials
  const wallMaterial = useMemo(() => (
    new THREE.MeshBasicMaterial({ 
      color: COLORS.WALL,
      side: THREE.DoubleSide 
    })
  ), [])

  const floorMaterial = useMemo(() => (
    new THREE.MeshBasicMaterial({ 
      color: COLORS.FLOOR,
      side: THREE.DoubleSide 
    })
  ), [])

  // Handle box hover
  const handleBoxHover = (box: Box | null) => {
    if (onBoxHover) onBoxHover(box)
  }

  return (
    <group ref={groupRef}>
      {/* Room walls */}
      <mesh position={[0, wallHeight/2, -halfSize]}>
        <boxGeometry args={[ROOM_DIMENSIONS.FLOOR_SIZE, wallHeight, 0.1]} />
        <primitive object={wallMaterial} />
      </mesh>
      <mesh position={[0, wallHeight/2, halfSize]}>
        <boxGeometry args={[ROOM_DIMENSIONS.FLOOR_SIZE, wallHeight, 0.1]} />
        <primitive object={wallMaterial} />
      </mesh>
      <mesh position={[-halfSize, wallHeight/2, 0]}>
        <boxGeometry args={[0.1, wallHeight, ROOM_DIMENSIONS.FLOOR_SIZE]} />
        <primitive object={wallMaterial} />
      </mesh>
      <mesh position={[halfSize, wallHeight/2, 0]}>
        <boxGeometry args={[0.1, wallHeight, ROOM_DIMENSIONS.FLOOR_SIZE]} />
        <primitive object={wallMaterial} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[ROOM_DIMENSIONS.FLOOR_SIZE, ROOM_DIMENSIONS.FLOOR_SIZE]} />
        <primitive object={floorMaterial} />
      </mesh>

      {/* Boxes */}
      {boxes.map((box) => (
        <TestBoxModel
          key={box.id}
          box={box}
          color={boxColor}
          rows={rows}
          columns={columns}
          levels={levels}
          onClick={() => onBoxClick?.(box)}
          onHover={(isHovered) => handleBoxHover(isHovered ? box : null)}
        />
      ))}

      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
    </group>
  )
} 