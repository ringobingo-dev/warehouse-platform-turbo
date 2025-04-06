"use client"

/**
 * TEST PAGE: 3D View Implementation Test
 * 
 * This page implements a parallel testing environment for the 3D rendering system.
 * It preserves the core functionality of the existing implementation while
 * isolating it for testing purposes.
 * 
 * Current Implementation Structure:
 * - Uses the same visualization modes as the main app
 * - Preserves the box rendering logic
 * - Maintains the same camera and control settings
 * 
 * Key Components Preserved:
 * 1. Dynamic imports for SSR handling
 * 2. Box visualization modes (basic, enhanced, realistic)
 * 3. Room environment configuration
 * 
 * @see ResponsiveBoxView - Original implementation
 * @see RoomEnvironment - Core 3D rendering logic
 */

import { useState, useEffect } from "react"
import { useBoxContext } from "../../context/BoxContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Button } from "../../components/ui/button"
import { RefreshCw, Maximize2, Minimize2 } from "lucide-react"
import { useToast } from "../../components/ui/use-toast"
import { getAllRoomsFromLocalStorage } from "../../lib/client-storage-utils"
import { ensureMock3DRoomsExist } from "../../utils/mockRoomGenerator"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Component, ReactNode } from 'react'

// Simple ErrorBoundary component
class ErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Error in 3D component:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Dynamically import the 3D view component with no SSR
const TestThreeDViewClient = dynamic(
  () => import('@/components/test/TestThreeDViewClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Loading 3D environment...</p>
        </div>
      </div>
    )
  }
)

// Define the room data interface
interface Room {
  id: string
  name: string
  type: string
  category: string
  rows: number
  columns: number
  levels: number
  dataType?: string
  version?: string
  renderType?: string
  isSplitSide?: boolean
  parentRoomId?: string
  sideType?: "EAST" | "WEST" | string
}

interface Box {
  id: string
  roomId?: string
  row: number
  column: number
  level: number
  customerName: string
  customerNumber: string
  boxNumber: string
  status: string
  lastModified: string
  [key: string]: any
}

interface BoxContextType {
  boxes: Box[]
  filteredBoxes: Box[]
  customerBoxColor?: string
}

export default function ThreeDTestPage() {
  const boxContext = useBoxContext()
  const boxes = boxContext?.boxes || []
  const filteredBoxes = boxContext?.filteredBoxes || []
  const displayBoxes = filteredBoxes.length > 0 ? filteredBoxes : boxes
  const { toast } = useToast()

  const [visualizationMode, setVisualizationMode] = useState<"basic" | "enhanced" | "realistic">("enhanced")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])

  // Load available 3D rooms
  useEffect(() => {
    const loadRooms = () => {
      try {
        // Ensure mock 3D rooms exist
        const mockResult = ensureMock3DRoomsExist()
        if (mockResult.added) {
          toast({
            title: "Mock 3D Rooms Added",
            description: `Added ${mockResult.count} mock 3D rooms for testing`,
            duration: 3000,
          })
        }

        // Get all rooms from localStorage
        const allRooms = getAllRoomsFromLocalStorage()

        // Filter to include 3D rooms and split room sides
        const rooms3D = allRooms.filter((room: Room) => {
          const is3D = room.dataType === "3d" || room.version === "3D" || room.renderType === "3D"
          const isSplitSide =
            room.sideType === "EAST" ||
            room.sideType === "WEST" ||
            (room.name && (room.name.includes("EAST") || room.name.includes("WEST")))
          return is3D || isSplitSide
        })

        if (rooms3D.length > 0) {
          setAvailableRooms(
            rooms3D.map((room: any) => ({
              id: room.id,
              name: room.roomName || room.name || `Room ${room.id}`,
              type: room.roomType || room.type || "unknown",
              category: room.roomCategory || room.category || "unknown",
              rows: room.rows?.count || room.storageConfig?.rows?.count || 8,
              columns: room.columns?.count || room.storageConfig?.columns?.count || 12,
              levels: room.levels || 4,
              dataType: room.dataType || "unknown",
              version: room.version || "1.0",
              renderType: room.renderType || "unknown",
              isSplitSide:
                room.sideType === "EAST" ||
                room.sideType === "WEST" ||
                (room.name && (room.name.includes("EAST") || room.name.includes("WEST"))),
              parentRoomId: room.parentRoomId,
              sideType:
                room.sideType ||
                (room.name && room.name.includes("EAST")
                  ? "EAST"
                  : room.name && room.name.includes("WEST")
                    ? "WEST"
                    : undefined),
            })),
          )

          // Set the first room as selected by default
          if (!selectedRoom) {
            setSelectedRoom(rooms3D[0].id)
          }
        } else {
          toast({
            title: "No 3D Rooms Found",
            description: "No 3D room data found in storage. This is unexpected as mock rooms should have been added.",
            variant: "destructive",
          })
          setAvailableRooms([])
        }
      } catch (error) {
        console.error("Error loading 3D rooms:", error)
        toast({
          title: "Error Loading Rooms",
          description: "Failed to load 3D room data from storage.",
          variant: "destructive",
        })
        setAvailableRooms([])
      }
    }

    loadRooms()
  }, [toast, selectedRoom])

  useEffect(() => {
    if (boxes.length > 0) {
      toast({
        title: "Data Loaded",
        description: `Loaded ${boxes.length} boxes from storage`,
        duration: 3000,
      })
    }
  }, [boxes, toast])

  const handleRefresh = () => setRefreshKey(prev => prev + 1)
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId)
    const selectedRoomData = availableRooms.find((room) => room.id === roomId)
    if (selectedRoomData) {
      toast({
        title: "Room Changed",
        description: `Switched to ${selectedRoomData.name}`,
        duration: 2000,
      })
    }
    setRefreshKey((prev) => prev + 1)
  }

  // Get the current room data
  const currentRoom = availableRooms.find((room) => room.id === selectedRoom)

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <Select value={selectedRoom} onValueChange={handleRoomChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={visualizationMode} onValueChange={(value: any) => setVisualizationMode(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select visualization mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="enhanced">Enhanced</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center h-[600px] bg-white">
            <div className="flex flex-col items-center">
              <p className="text-red-600 font-semibold">Error loading 3D view</p>
              <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[600px] bg-white">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-600">Loading 3D environment...</p>
              </div>
            </div>
          }
        >
          {selectedRoom && (
            <TestThreeDViewClient
              key={refreshKey}
              roomId={selectedRoom}
              visualizationMode={visualizationMode}
              boxes={displayBoxes}
              isFiltered={filteredBoxes.length > 0}
              boxColor={boxContext?.customerBoxColor}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  )
} 