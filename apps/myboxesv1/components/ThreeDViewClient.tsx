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

interface ThreeDViewClientProps {
  boxes: any[] // TODO: Replace with proper Box type
  visualizationMode: "basic" | "enhanced" | "realistic"
}

const ThreeDViewClient: React.FC<ThreeDViewClientProps> = ({ boxes, visualizationMode }) => {
  return (
    <Suspense fallback={<div>Loading 3D environment...</div>}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls />
        <Environment preset="warehouse" />
        <RoomEnvironment 
          boxes={boxes}
          visualizationMode={visualizationMode}
        />
      </Canvas>
    </Suspense>
  )
}

export default ThreeDViewClient 