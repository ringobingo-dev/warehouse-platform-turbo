"use client"

import React, { useMemo } from "react"
import * as THREE from "three"
import { Box } from "../../types/Box"
import { ROOM_DIMENSIONS } from "../../config/constants"

interface TestBoxModelProps {
  box: Box
  color: string
  rows: number
  columns: number
  levels: number
  onClick?: () => void
  onHover?: (isHovered: boolean) => void
}

export const TestBoxModel: React.FC<TestBoxModelProps> = ({
  box,
  color,
  rows,
  columns,
  levels,
  onClick,
  onHover
}) => {
  const halfSize = ROOM_DIMENSIONS.FLOOR_SIZE / 2
  const rowSpacing = ROOM_DIMENSIONS.FLOOR_SIZE / rows
  const columnSpacing = ROOM_DIMENSIONS.FLOOR_SIZE / columns
  const levelSpacing = ROOM_DIMENSIONS.HEIGHT / levels

  const position: [number, number, number] = [
    (box.column - 1) * columnSpacing - halfSize + columnSpacing / 2,
    (box.level - 1) * levelSpacing + levelSpacing / 2,
    (box.row - 1) * rowSpacing - halfSize + rowSpacing / 2
  ]

  const material = useMemo(() => (
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8
    })
  ), [color])

  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => onHover?.(true)}
      onPointerOut={() => onHover?.(false)}
    >
      <boxGeometry args={[columnSpacing * 0.8, levelSpacing * 0.8, rowSpacing * 0.8]} />
      <primitive object={material} />
    </mesh>
  )
} 