"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"
import { ErrorBoundary } from "@/utils/dynamicImport"

interface BoxTemplate {
  id: string
  name: string
  width: number
  height: number
  depth: number
}

interface BoxViewerProps {
  width: number
  height: number
  depth: number
}

function Box({ width, height, depth }: BoxViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#e5d3b3" />
    </mesh>
  )
}

export function BoxViewer({ width, height, depth }: BoxViewerProps) {
  return (
    <ErrorBoundary>
      <div style={{ width: "100%", height: "400px" }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[3, 3, 3]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Box width={width} height={height} depth={depth} />
          <OrbitControls />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
export type { BoxTemplate }

