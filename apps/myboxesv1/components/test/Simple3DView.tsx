"use client"

/**
 * Simple3DView.tsx
 * 
 * A simplified Three.js component for testing SSR and rendering issues.
 * This component intentionally avoids complex features to isolate core rendering functionality.
 */

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

interface TestBox {
  position: [number, number, number]
  dimensions: [number, number, number]
  color: string
}

interface Simple3DViewProps {
  testBox: TestBox
}

function SimpleBox({ position, dimensions, color }: TestBox) {
  return (
    <mesh position={position}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Scene({ testBox }: Simple3DViewProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <SimpleBox {...testBox} />
      <OrbitControls />
    </>
  )
}

export default function Simple3DView({ testBox }: Simple3DViewProps) {
  return (
    <Suspense fallback={<div>Loading scene...</div>}>
      <Canvas>
        <Scene testBox={testBox} />
      </Canvas>
    </Suspense>
  )
} 