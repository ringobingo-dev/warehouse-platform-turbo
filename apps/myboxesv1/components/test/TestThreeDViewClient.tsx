"use client"

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { TestRoomEnvironment } from './test-room-environment'

interface TestThreeDViewClientProps {
  rows?: number
  columns?: number
  levels?: number
  boxColor?: string
  isFiltered?: boolean
  visualizationMode?: "basic" | "enhanced" | "realistic"
}

const TestThreeDViewClient: React.FC<TestThreeDViewClientProps> = ({ 
  rows = 8,
  columns = 12,
  levels = 4,
  boxColor = "#8B4513",
  isFiltered = false,
  visualizationMode = "enhanced"
}) => {
  return (
    <Suspense fallback={<div>Loading 3D environment...</div>}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [10, 8, 15], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
      >
        <PerspectiveCamera makeDefault position={[10, 8, 15]} fov={45} />
        <OrbitControls
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
        <Environment preset="warehouse" />
        <TestRoomEnvironment 
          rows={rows}
          columns={columns}
          levels={levels}
          boxColor={boxColor}
          isFiltered={isFiltered}
          visualizationMode={visualizationMode}
        />
      </Canvas>
    </Suspense>
  )
}

export default TestThreeDViewClient 

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { TestRoomEnvironment } from './test-room-environment'

interface TestThreeDViewClientProps {
  rows?: number
  columns?: number
  levels?: number
  boxColor?: string
  isFiltered?: boolean
  visualizationMode?: "basic" | "enhanced" | "realistic"
}

const TestThreeDViewClient: React.FC<TestThreeDViewClientProps> = ({ 
  rows = 8,
  columns = 12,
  levels = 4,
  boxColor = "#8B4513",
  isFiltered = false,
  visualizationMode = "enhanced"
}) => {
  return (
    <Suspense fallback={<div>Loading 3D environment...</div>}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [10, 8, 15], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
      >
        <PerspectiveCamera makeDefault position={[10, 8, 15]} fov={45} />
        <OrbitControls
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
        <Environment preset="warehouse" />
        <TestRoomEnvironment 
          rows={rows}
          columns={columns}
          levels={levels}
          boxColor={boxColor}
          isFiltered={isFiltered}
          visualizationMode={visualizationMode}
        />
      </Canvas>
    </Suspense>
  )
}

export default TestThreeDViewClient 