"use client"

/**
 * ThreeDViewClient.tsx
 * 
 * This is a client-only component that handles the Three.js rendering.
 * It's separated from the main page to prevent SSR issues with troika-worker-utils.
 * 
 * IMPORTANT: This component should only be imported using dynamic import with ssr: false
 * 
 * Original code from room-environment.tsx has been adapted here to ensure
 * all Three.js related code runs exclusively on the client side.
 */

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { RoomEnvironment } from './room-environment'
import type { VisualBox } from '@/context/BoxContext'
import type { Box } from '@/types/Box'

interface ThreeDViewClientProps {
  boxes: VisualBox[]
  visualizationMode: "basic" | "enhanced" | "realistic"
  rows: number
  columns: number
  levels: number
  boxColor: string
  isFiltered: boolean
}

// Helper function to convert VisualBox to Box
const convertVisualBoxToBox = (visualBox: VisualBox): Box => {
  const [row, column, level] = visualBox.position;
  return {
    row,
    column,
    level,
    customerName: visualBox.customerName,
    varietyName: visualBox.varietyName,
    grade: visualBox.grade,
    loadingDate: visualBox.loadingDate,
    color: visualBox.color,
    highlighted: visualBox.highlighted,
    size: visualBox.boxSize,
    logIndex: visualBox.logIndex
  };
};

const ThreeDViewClient: React.FC<ThreeDViewClientProps> = ({ 
  boxes, 
  visualizationMode,
  rows,
  columns,
  levels,
  boxColor,
  isFiltered
}) => {
  // Convert VisualBoxes to Boxes for RoomEnvironment
  const convertedBoxes = boxes.map(convertVisualBoxToBox);

  return (
    <Suspense fallback={<div>Loading 3D environment...</div>}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls />
        <Environment preset="warehouse" />
        <RoomEnvironment 
          boxes={convertedBoxes}
          visualizationMode={visualizationMode}
          rows={rows}
          columns={columns}
          levels={levels}
          boxColor={boxColor}
          isFiltered={isFiltered}
        />
      </Canvas>
    </Suspense>
  )
}

export default ThreeDViewClient 