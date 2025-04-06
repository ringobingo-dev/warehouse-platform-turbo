"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Box, Text } from "@react-three/drei"
import type * as THREE from "three"

interface Room3DVisualizationProps {
  dimensions: {
    length: number
    width: number
    height: number
  }
  boxes?: {
    id: string
    position: [number, number, number]
    size: [number, number, number]
    color?: string
  }[]
}

function BoxMesh({
  position,
  size,
  color = "orange",
  id,
}: {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
  id: string
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const [hovered, setHover] = useState(false)

  useFrame(() => {
    if (mesh.current && hovered) {
      mesh.current.rotation.y += 0.01
    }
  })

  return (
    <Box
      ref={mesh}
      args={size}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial color={hovered ? "hotpink" : color} />
      <Text position={[0, size[1] / 2 + 0.1, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="bottom">
        {id}
      </Text>
    </Box>
  )
}

function RoomMesh({ dimensions }: { dimensions: Room3DVisualizationProps["dimensions"] }) {
  const { length, width, height } = dimensions

  return (
    <mesh position={[0, 0, 0]} receiveShadow>
      <boxGeometry args={[length, 0.1, width]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

export function Room3DVisualization({ dimensions, boxes = [] }: Room3DVisualizationProps) {
  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg">
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

        <RoomMesh dimensions={dimensions} />

        {boxes.map((box) => (
          <BoxMesh key={box.id} id={box.id} position={box.position} size={box.size} color={box.color} />
        ))}

        <OrbitControls />
        <gridHelper args={[30, 30]} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  )
}

