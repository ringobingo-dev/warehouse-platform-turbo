"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddBoxesTab } from "@/components/maintenance/add-boxes-tab"
import { RemoveBoxesTab } from "@/components/maintenance/remove-boxes-tab"
import { Plus, Trash2 } from "lucide-react"
import { useBoxContext } from "@/context/BoxContext"
import { RoomInfo } from "@/components/room-info"
import { StandardRoomView } from "@/components/standard-room-view"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllRoomsFromLocalStorage } from "@/lib/client-storage-utils"
import { useToast } from "@/components/ui/use-toast"
import { ensureMock3DRoomsExist } from "@/utils/mockRoomGenerator"
import { useRoomBoxes } from "@/hooks/useRoomBoxes"

// TODO: Review for Stage 1 completeness
// This file likely contains @/ imports that need to be updated with deeply nested paths
// deeply nested — consider moving to shared lib
export default function MaintenancePage() {
  const { rows, columns, levels, boxes, getRoomCapacity } = useBoxContext()
  const [activeTab, setActiveTab] = useState("add")
  const [refreshKey, setRefreshKey] = useState(0)
  const [availableRooms, setAvailableRooms] = useState<Array<{ id: string; name: string; displayName?: string }>>([])
  const { toast } = useToast()

  // Use our new hook for room-specific box management
  const { selectedRoomId, changeRoom, isLoaded } = useRoomBoxes()

  // Use a ref to track if rooms have been loaded
  const roomsLoadedRef = useRef(false)

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  // Load available 3D rooms - only once
  useEffect(() => {
    // Skip if we've already loaded rooms
    if (roomsLoadedRef.current) return

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
          const formattedRooms = rooms3D.map((room: any) => ({
            id: room.id,
            name: room.roomName || room.name || `Room ${room.id}`,
            displayName: room.sideType
              ? `${room.roomName || room.name} (${room.sideType} Side)`
              : room.name && (room.name.includes("EAST") || room.name.includes("WEST"))
                ? room.roomName || room.name
                : room.roomName || room.name || `Room ${room.id}`,
          }))

          setAvailableRooms(formattedRooms)

          // Set the first room as selected by default if none is selected
          if (!selectedRoomId && rooms3D.length > 0) {
            changeRoom(rooms3D[0].id)
          }

          // Mark rooms as loaded
          roomsLoadedRef.current = true
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
  }, [toast]) // Remove selectedRoomId and changeRoom from dependencies

  const handleRoomChange = (roomId: string) => {
    // Skip if it's the same room
    if (roomId === selectedRoomId) return

    // Use our room-specific change function
    changeRoom(roomId)

    // Trigger a refresh of the view
    setRefreshKey((prev) => prev + 1)
  }

  // Show loading state while room data is being loaded
  if (!isLoaded) {
    return <div className="w-full px-4 py-6">Loading room data...</div>
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Box Maintenance</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Room:</span>
          <Select value={selectedRoomId} onValueChange={handleRoomChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.displayName || room.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No 3D rooms available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <RoomInfo
          rows={rows}
          columns={columns}
          levels={levels}
          totalBoxes={boxes.length}
          capacity={getRoomCapacity()}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add">
                <Plus className="mr-2 h-4 w-4" />
                Add Boxes
              </TabsTrigger>
              <TabsTrigger value="remove">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Boxes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <AddBoxesTab onRefresh={handleRefresh} />
            </TabsContent>
            <TabsContent value="remove">
              <RemoveBoxesTab onRefresh={handleRefresh} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2">
          <StandardRoomView
            refreshKey={refreshKey}
            onRefresh={handleRefresh}
            roomId={selectedRoomId}
            boxCount={boxes.length}
          />
        </div>
      </div>
    </div>
  )
}

