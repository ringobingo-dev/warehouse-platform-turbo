"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Maximize2, Minimize2, BoxIcon, Thermometer, Droplets } from "lucide-react"

// This would come from your PostgreSQL database
interface Room {
  id: string
  name: string
  capacity: number
  usedCapacity: number
  temperature: number
  humidity: number
  dimensions: {
    width: number
    length: number
    height: number
  }
}

interface Box {
  id: string
  variety: string
  boxCount: number
  position: [number, number, number] // [x, y, z]
  dimensions: [number, number, number] // [width, height, depth]
  color: string
}

interface Warehouse {
  id: string
  name: string
  rooms: Room[]
}

interface RoomVisualizationProps {
  warehouses: Warehouse[]
  boxes: Record<string, Box[]> // roomId -> boxes
  initialWarehouseId?: string
  initialRoomId?: string
}

// Mock data for visualization - this would come from your database
const mockWarehouses: Warehouse[] = [
  {
    id: "wh-001",
    name: "Main Warehouse",
    rooms: [
      {
        id: "room-a101",
        name: "Room A101",
        capacity: 200,
        usedCapacity: 180,
        temperature: 4.5,
        humidity: 85,
        dimensions: {
          width: 10,
          length: 15,
          height: 4,
        },
      },
      {
        id: "room-a102",
        name: "Room A102",
        capacity: 150,
        usedCapacity: 90,
        temperature: 3.8,
        humidity: 82,
        dimensions: {
          width: 8,
          length: 12,
          height: 4,
        },
      },
    ],
  },
  {
    id: "wh-002",
    name: "East Warehouse",
    rooms: [
      {
        id: "room-c101",
        name: "Room C101",
        capacity: 250,
        usedCapacity: 150,
        temperature: 4.2,
        humidity: 84,
        dimensions: {
          width: 12,
          length: 18,
          height: 5,
        },
      },
    ],
  },
]

// Mock boxes data - this would come from your database
const mockBoxes: Record<string, Box[]> = {
  "room-a101": [
    {
      id: "box-001",
      variety: "Russet",
      boxCount: 60,
      position: [2, 0.5, 3],
      dimensions: [2, 1, 2],
      color: "#8B4513",
    },
    {
      id: "box-002",
      variety: "Yukon Gold",
      boxCount: 40,
      position: [5, 0.5, 3],
      dimensions: [1.5, 1, 1.5],
      color: "#DAA520",
    },
    {
      id: "box-003",
      variety: "Red",
      boxCount: 80,
      position: [3, 0.5, 7],
      dimensions: [3, 1, 2],
      color: "#A52A2A",
    },
  ],
  "room-a102": [
    {
      id: "box-004",
      variety: "Fingerling",
      boxCount: 30,
      position: [2, 0.5, 3],
      dimensions: [1, 1, 1],
      color: "#CD853F",
    },
    {
      id: "box-005",
      variety: "Purple",
      boxCount: 60,
      position: [4, 0.5, 5],
      dimensions: [2, 1, 2],
      color: "#800080",
    },
  ],
  "room-c101": [
    {
      id: "box-010",
      variety: "Russet",
      boxCount: 90,
      position: [3, 0.5, 4],
      dimensions: [3, 1, 3],
      color: "#8B4513",
    },
    {
      id: "box-011",
      variety: "Red",
      boxCount: 60,
      position: [7, 0.5, 6],
      dimensions: [2, 1, 2],
      color: "#A52A2A",
    },
  ],
}

// Room component that renders the 3D room with boxes
function Room({ room, boxes }: { room: Room; boxes: Box[] }) {
  const [hoveredBox, setHoveredBox] = useState<string | null>(null)
  const [selectedBox, setSelectedBox] = useState<string | null>(null)

  const { width, length, height } = room.dimensions

  return (
    <>
      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, 0, length / 2]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Room walls */}
      {/* Back wall */}
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Left wall */}
      <mesh position={[0, height / 2, length / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.1, height, length]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Right wall */}
      <mesh position={[width, height / 2, length / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.1, height, length]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Front wall */}
      <mesh position={[width / 2, height / 2, length]} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Boxes */}
      {boxes.map((box) => (
        <group key={box.id}>
          <mesh
            position={box.position}
            castShadow
            receiveShadow
            onPointerOver={() => setHoveredBox(box.id)}
            onPointerOut={() => setHoveredBox(null)}
            onClick={() => setSelectedBox(selectedBox === box.id ? null : box.id)}
            scale={[box.dimensions[0], box.dimensions[1], box.dimensions[2]]}
          >
            <boxGeometry />
            <meshStandardMaterial
              color={box.color}
              opacity={hoveredBox === box.id || selectedBox === box.id ? 1 : 0.8}
              transparent
              emissive={hoveredBox === box.id ? "#ffffff" : "#000000"}
              emissiveIntensity={hoveredBox === box.id ? 0.2 : 0}
            />
          </mesh>

          {/* Box label */}
          {(hoveredBox === box.id || selectedBox === box.id) && (
            <Html
              position={[box.position[0], box.position[1] + box.dimensions[1] + 0.5, box.position[2]]}
              center
              distanceFactor={10}
            >
              <div className="bg-white/90 dark:bg-black/90 p-2 rounded-md shadow-lg text-center pointer-events-none">
                <p className="font-medium">{box.variety}</p>
                <p className="text-sm">{box.boxCount} boxes</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  )
}

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export function RoomVisualization({
  warehouses = mockWarehouses,
  boxes = mockBoxes,
  initialWarehouseId,
  initialRoomId,
}: RoomVisualizationProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(
    initialWarehouseId || (warehouses.length > 0 ? warehouses[0].id : ""),
  )

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    initialRoomId || (warehouses.length > 0 && warehouses[0].rooms.length > 0 ? warehouses[0].rooms[0].id : ""),
  )

  const [viewMode, setViewMode] = useState<"3d" | "top" | "front">("3d")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Get the selected warehouse
  const selectedWarehouse = warehouses.find((w) => w.id === selectedWarehouseId)

  // Get the selected room
  const selectedRoom = selectedWarehouse?.rooms.find((r) => r.id === selectedRoomId)

  // Get boxes for the selected room
  const roomBoxes = selectedRoomId ? boxes[selectedRoomId] || [] : []

  // Update selected room when warehouse changes
  useEffect(() => {
    if (selectedWarehouse && selectedWarehouse.rooms.length > 0) {
      // Check if current room belongs to selected warehouse
      const roomBelongsToWarehouse = selectedWarehouse.rooms.some((r) => r.id === selectedRoomId)

      if (!roomBelongsToWarehouse) {
        setSelectedRoomId(selectedWarehouse.rooms[0].id)
      }
    }
  }, [selectedWarehouseId, selectedWarehouse, selectedRoomId])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const container = document.getElementById("visualization-container")

    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Camera position based on view mode and room dimensions
  const getCameraPosition = () => {
    if (!selectedRoom) return [10, 10, 10]

    const { width, length, height } = selectedRoom.dimensions

    switch (viewMode) {
      case "top":
        return [width / 2, height * 2, length / 2]
      case "front":
        return [width / 2, height / 2, length * 1.5]
      default: // 3d
        return [width * 1.2, height * 1.2, length * 1.2]
    }
  }

  // Camera target based on room dimensions
  const getCameraTarget = () => {
    if (!selectedRoom) return [0, 0, 0]

    const { width, length } = selectedRoom.dimensions
    return [width / 2, 0, length / 2]
  }

  if (!selectedWarehouse || !selectedRoom) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3D Room Visualization</CardTitle>
          <CardDescription>No warehouse or room selected</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <p className="text-muted-foreground">Please select a warehouse and room to view the 3D visualization</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id="visualization-container" className={isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>3D Room Visualization</CardTitle>
            <CardDescription>View your storage boxes in 3D space</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`p-0 ${isFullscreen ? "h-[calc(100vh-80px)]" : "h-[500px]"}`}>
        <div className="bg-muted p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  {selectedWarehouse.rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedRoom.temperature}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedRoom.humidity}%</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <BoxIcon className="h-3 w-3" />
                <span>
                  {selectedRoom.usedCapacity}/{selectedRoom.capacity}
                </span>
              </Badge>
            </div>
          </div>

          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "3d" | "top" | "front")}>
            <TabsList>
              <TabsTrigger value="3d">3D View</TabsTrigger>
              <TabsTrigger value="top">Top View</TabsTrigger>
              <TabsTrigger value="front">Front View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-full">
          <Canvas shadows>
            <Suspense fallback={<LoadingSpinner />}>
              <PerspectiveCamera
                makeDefault
                position={getCameraPosition()}
                fov={50}
                near={0.1}
                far={1000}
                lookAt={getCameraTarget()}
              />
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 10]}
                intensity={0.8}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              {selectedRoom && <Room room={selectedRoom} boxes={roomBoxes} />}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={viewMode === "3d"}
                target={getCameraTarget()}
              />
              <Environment preset="warehouse" />
            </Suspense>
          </Canvas>
        </div>
      </CardContent>
    </Card>
  )
}

