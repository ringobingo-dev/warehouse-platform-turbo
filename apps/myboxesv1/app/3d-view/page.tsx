"use client"

import { useState, useEffect } from "react"
// TODO: Review for Stage 1 completeness

// updated for NX-compatible pathing
import { useBoxContext } from "../../context/BoxContext"
// updated for NX-compatible pathing
// reused across multiple files — candidate for shared lib in NX
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
// updated for NX-compatible pathing
// reused across multiple files — candidate for shared lib in NX
import { Button } from "../../components/ui/button"
// updated for NX-compatible pathing
// reused across multiple files — candidate for shared lib in NX
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// updated for NX-compatible pathing
// reused across multiple files — candidate for shared lib in NX
import { useToast } from "../../components/ui/use-toast"
// updated for NX-compatible pathing
import { StandardRoomView } from "../../components/standard-room-view"
// updated for NX-compatible pathing
import { getAllRoomsFromLocalStorage } from "../../lib/client-storage-utils"
// updated for NX-compatible pathing
import { ensureMock3DRoomsExist } from "../../utils/mockRoomGenerator"
import { Maximize2, Minimize2, Info } from "lucide-react"

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

export default function ThreeDViewPage() {
  const { boxes, filteredBoxes } = useBoxContext()
  const displayBoxes = filteredBoxes.length > 0 ? filteredBoxes : boxes
  const { toast } = useToast()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [visualizationMode, setVisualizationMode] = useState<"basic" | "enhanced" | "realistic">("enhanced")
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  // Load available 3D rooms
  useEffect(() => {
    const loadRooms = () => {
      try {
        // Ensure mock 3D rooms exist if no 3D rooms are found
        const mockResult = ensureMock3DRoomsExist()
        if (mockResult.added) {
          toast({
            title: "Mock 3D Rooms Added",
            description: `Added ${mockResult.count} mock 3D rooms for demonstration`,
            duration: 3000,
          })
        }

        // Get all rooms from localStorage
        const allRooms = getAllRoomsFromLocalStorage()

        // Filter to include 3D rooms and split room sides
        const rooms3D = allRooms.filter((room) => {
          // Check if it's a 3D room
          const is3D = room.dataType === "3d" || room.version === "3D" || room.renderType === "3D"

          // Check if it's a split room side (EAST or WEST)
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
              // If it's a split side, add that to the name for clarity
              displayName: room.sideType
                ? `${room.roomName || room.name} (${room.sideType} Side)`
                : room.name && (room.name.includes("EAST") || room.name.includes("WEST"))
                  ? room.roomName || room.name
                  : room.roomName || room.name || `Room ${room.id}`,
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

          // Set the first room as selected by default if none is selected
          if (!selectedRoom) {
            setSelectedRoom(rooms3D[0].id)
          }
        } else {
          toast({
            title: "No 3D Rooms Found",
            description: "No 3D room data found in storage. This is unexpected as mock rooms should have been added.",
            variant: "destructive",
          })

          // Set empty array for available rooms
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setShowInfo(false)
  }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId)
    // In a real app, this would load the room data and boxes
    const selectedRoomData = availableRooms.find((room) => room.id === roomId)
    if (selectedRoomData) {
      toast({
        title: "Room Changed",
        description: `Switched to ${selectedRoomData.displayName || selectedRoomData.name}`,
        duration: 2000,
      })
    }
    // Trigger a refresh of the 3D view
    setRefreshKey((prev) => prev + 1)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Get the current room data
  const currentRoom = availableRooms.find((room) => room.id === selectedRoom)

  // Apply visualization mode to the context or pass it to the StandardRoomView
  useEffect(() => {
    // This would update a global context in a real implementation
    console.log(`Setting visualization mode to: ${visualizationMode}`)
    // Trigger a refresh when visualization mode changes
    setRefreshKey((prev) => prev + 1)
  }, [visualizationMode])

  return (
    <div className={`container mx-auto px-0 ${isFullscreen ? "fixed inset-0 z-50 p-4 bg-background" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">3D View</h1>
        <div className="flex gap-2">
          <Select value={selectedRoom} onValueChange={handleRoomChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select 3D Room" />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.displayName || room.name}
                    {room.isSplitSide && !room.displayName?.includes("Side") && ` (${room.sideType} Side)`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No 3D rooms available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select
            value={visualizationMode}
            onValueChange={(value: "basic" | "enhanced" | "realistic") => setVisualizationMode(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Visualization Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="enhanced">Enhanced</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={toggleInfo}>
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {availableRooms.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No 3D Rooms Available</h3>
              <p className="text-muted-foreground mb-4">
                You need to create and save 3D room data before you can view it here.
              </p>
              <Button asChild>
                <a href="/add-room">Create a Room</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {showInfo && !isFullscreen && currentRoom && (
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Room:</span> {currentRoom?.displayName || currentRoom?.name}
                  </div>
                  {currentRoom?.isSplitSide && (
                    <div>
                      <span className="font-medium">Side Type:</span> {currentRoom?.sideType} Side
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {currentRoom?.type
                      ? currentRoom.type
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Configuration:</span> {currentRoom?.rows}×{currentRoom?.columns}×
                    {currentRoom?.levels}
                  </div>
                  <div>
                    <span className="font-medium">Data Type:</span> {currentRoom?.dataType || "Unknown"}
                  </div>
                  <div>
                    <span className="font-medium">Version:</span> {currentRoom?.version || "Unknown"}
                  </div>
                  <div>
                    <span className="font-medium">Total Boxes:</span> {boxes.length}
                  </div>
                  <div>
                    <span className="font-medium">Filtered Boxes:</span> {filteredBoxes.length}
                  </div>
                  <div>
                    <span className="font-medium">Capacity:</span>{" "}
                    {currentRoom?.rows * currentRoom?.columns * currentRoom?.levels}
                  </div>
                  <div>
                    <span className="font-medium">Utilization:</span>{" "}
                    {Math.round(
                      (boxes.length / (currentRoom?.rows * currentRoom?.columns * currentRoom?.levels || 1)) * 100,
                    )}
                    %
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentRoom && (
            <div
              className={`${isFullscreen ? "fixed inset-0 z-50 p-4 bg-background" : "md:col-span-" + (showInfo ? "3" : "4")}`}
            >
              {isFullscreen && (
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Select value={selectedRoom} onValueChange={handleRoomChange}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select 3D Room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.displayName || room.name}
                          {room.isSplitSide && !room.displayName?.includes("Side") && ` (${room.sideType} Side)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <StandardRoomView
                refreshKey={refreshKey}
                onRefresh={handleRefresh}
                roomId={selectedRoom}
                boxCount={displayBoxes.length}
                className={`w-full ${isFullscreen ? "h-[calc(100vh-32px)]" : ""}`}
                // Pass these props to prevent duplicate controls in StandardRoomView
                hideControls={true}
                visualizationMode={visualizationMode}
                is3DOnly={true}
                isSplitSide={currentRoom.isSplitSide}
                sideType={currentRoom.sideType}
              />

              {isFullscreen && currentRoom && (
                <div className="absolute bottom-4 right-4 z-10">
                  <Card className="w-64">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">Room Information</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-3">
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">Room:</span> {currentRoom?.displayName || currentRoom?.name}
                        </div>
                        {currentRoom?.isSplitSide && (
                          <div>
                            <span className="font-medium">Side Type:</span> {currentRoom?.sideType} Side
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Configuration:</span> {currentRoom?.rows}×{currentRoom?.columns}
                          ×{currentRoom?.levels}
                        </div>
                        <div>
                          <span className="font-medium">Data Type:</span> {currentRoom?.dataType || "Unknown"}
                        </div>
                        <div>
                          <span className="font-medium">Total Boxes:</span> {boxes.length}
                        </div>
                        <div>
                          <span className="font-medium">Utilization:</span>{" "}
                          {Math.round(
                            (boxes.length / (currentRoom?.rows * currentRoom?.columns * currentRoom?.levels || 1)) *
                              100,
                          )}
                          %
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!isFullscreen && currentRoom && (
        <div className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Navigation Tips</h3>
                  <p className="text-xs text-muted-foreground">
                    Left-click and drag to rotate. Right-click and drag to pan. Scroll to zoom.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Box Count</h3>
                  <p className="text-xs">
                    Showing {displayBoxes.length} of {boxes.length} boxes
                    {filteredBoxes.length > 0 && ` (${filteredBoxes.length} filtered)`}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Visualization Mode</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {visualizationMode} -{" "}
                    {visualizationMode === "basic"
                      ? "Simple lighting and materials"
                      : visualizationMode === "enhanced"
                        ? "Improved lighting and shadows"
                        : "Realistic materials and advanced lighting"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

