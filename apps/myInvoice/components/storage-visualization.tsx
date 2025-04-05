"use client"

import { useEffect, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Box, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for storage boxes
const generateBoxes = (count: number) => {
  const boxes = []
  const roomWidth = 10
  const roomDepth = 10
  const roomHeight = 3

  for (let i = 0; i < count; i++) {
    const size = [0.5 + Math.random() * 1.5, 0.5 + Math.random() * 1, 0.5 + Math.random() * 1.5]

    const position = [Math.random() * roomWidth - roomWidth / 2, size[1] / 2, Math.random() * roomDepth - roomDepth / 2]

    boxes.push({
      id: `box-${i}`,
      position,
      size,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      customer: i % 3 === 0 ? "Acme Inc." : i % 3 === 1 ? "Globex Corp" : "Stark Industries",
    })
  }

  return boxes
}

function Room() {
  const roomWidth = 10
  const roomDepth = 10
  const roomHeight = 3

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth, roomHeight, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[0, roomHeight / 2, roomDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth, roomHeight, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomDepth, roomHeight, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomDepth, roomHeight, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </group>
  )
}

function StorageBoxes({ boxes, highlightCustomer }: { boxes: any[]; highlightCustomer: string | null }) {
  const [hoveredBox, setHoveredBox] = useState<string | null>(null)
  const [selectedBox, setSelectedBox] = useState<string | null>(null)

  return (
    <group>
      {boxes.map((box) => {
        const isHighlighted = highlightCustomer ? box.customer === highlightCustomer : false
        const isHovered = hoveredBox === box.id
        const isSelected = selectedBox === box.id

        return (
          <group key={box.id}>
            <Box
              position={box.position}
              args={box.size}
              onPointerOver={() => setHoveredBox(box.id)}
              onPointerOut={() => setHoveredBox(null)}
              onClick={() => setSelectedBox(isSelected ? null : box.id)}
            >
              <meshStandardMaterial
                color={box.color}
                opacity={isHighlighted || !highlightCustomer ? 1 : 0.3}
                transparent={true}
                emissive={isHovered || isSelected ? "#ffffff" : "#000000"}
                emissiveIntensity={isHovered ? 0.2 : isSelected ? 0.5 : 0}
              />
            </Box>
            {(isHovered || isSelected) && (
              <Text
                position={[box.position[0], box.position[1] + box.size[1] / 2 + 0.3, box.position[2]]}
                fontSize={0.2}
                color="#000000"
                anchorX="center"
                anchorY="bottom"
              >
                {`${box.id} - ${box.customer}`}
              </Text>
            )}
          </group>
        )
      })}
    </group>
  )
}

function Scene({ boxes, highlightCustomer }: { boxes: any[]; highlightCustomer: string | null }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(8, 8, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <Room />
      <StorageBoxes boxes={boxes} highlightCustomer={highlightCustomer} />
      <OrbitControls />
      <Environment preset="warehouse" />
    </>
  )
}

export function StorageVisualization({ invoiceId }: { invoiceId: string }) {
  const [boxes] = useState(() => generateBoxes(20))
  const [highlightCustomer, setHighlightCustomer] = useState<string | null>(null)
  const [view, setView] = useState("3d")

  const customers = [...new Set(boxes.map((box) => box.customer))]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <Tabs value={view} onValueChange={setView} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="3d">3D View</TabsTrigger>
            <TabsTrigger value="top">Top View</TabsTrigger>
            <TabsTrigger value="front">Front View</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button
            variant={highlightCustomer === null ? "default" : "outline"}
            size="sm"
            onClick={() => setHighlightCustomer(null)}
          >
            All Customers
          </Button>
          {customers.map((customer) => (
            <Button
              key={customer}
              variant={highlightCustomer === customer ? "default" : "outline"}
              size="sm"
              onClick={() => setHighlightCustomer(customer)}
            >
              {customer}
            </Button>
          ))}
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-lg border">
        <Canvas shadows>
          <Scene boxes={boxes} highlightCustomer={highlightCustomer} />
        </Canvas>
        <Card className="absolute bottom-4 left-4 w-64">
          <CardContent className="p-3">
            <div className="text-sm">
              <p className="font-medium">Storage Statistics</p>
              <p className="text-xs text-muted-foreground">Invoice: {invoiceId}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Total Boxes:</span>
                  <span>{boxes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Volume:</span>
                  <span>
                    {boxes.reduce((acc, box) => acc + box.size[0] * box.size[1] * box.size[2], 0).toFixed(2)} m³
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Utilization:</span>
                  <span>78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

