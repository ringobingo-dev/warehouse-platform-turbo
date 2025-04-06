"use client"

import React from "react"
import { Box } from "../../types/Box"
import { ROOM_DIMENSIONS } from "../../config/constants"

interface TestBoxModelProps {
  box: Box
  color: string
  onClick?: () => void
  onHover?: (isHovered: boolean) => void
}

export const TestBoxModel: React.FC<TestBoxModelProps> = ({
  box,
  color,
  onClick,
  onHover
}) => {
  const halfSize = ROOM_DIMENSIONS.FLOOR_SIZE / 2
  const columnSpacing = ROOM_DIMENSIONS.FLOOR_SIZE / box.columns
  const rowSpacing = ROOM_DIMENSIONS.FLOOR_SIZE / box.rows
  const levelSpacing = ROOM_DIMENSIONS.HEIGHT / box.levels

  const x = (box.column - 1) * columnSpacing - halfSize + columnSpacing / 2
  const y = (box.level - 1) * levelSpacing + levelSpacing / 2
  const z = (box.row - 1) * rowSpacing - halfSize + rowSpacing / 2

  return (
    <mesh
      position={[x, y, z]}
      onClick={onClick}
      onPointerOver={() => onHover?.(true)}
      onPointerOut={() => onHover?.(false)}
    >
      <boxGeometry args={[columnSpacing * 0.8, levelSpacing * 0.8, rowSpacing * 0.8]} />
      <meshStandardMaterial
        color={color}
        metalness={0.1}
        roughness={0.5}
      />
    </mesh>
  )
} 