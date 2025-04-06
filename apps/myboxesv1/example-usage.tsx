"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvailableRoomsTable, type SavedRoom } from "@/components/available-rooms-table"

// Example data - replace with your data source
const exampleRooms: SavedRoom[] = [
  {
    id: "1",
    roomName: "Cold Storage A",
    roomCategory: "potatoes",
    roomType: "cold-storage",
    roomShape: "rectangle",
    length: 15,
    width: 10,
    rows: { count: 8 },
    columns: { count: 12 },
    levels: 4,
    createdDate: new Date().toISOString(),
  },
  {
    id: "2",
    roomName: "Dry Storage B",
    roomCategory: "onions",
    roomType: "dry-storage",
    roomShape: "square",
    length: 12,
    width: 12,
    rows: { count: 10 },
    columns: { count: 10 },
    levels: 3,
    createdDate: new Date().toISOString(),
  },
  {
    id: "3",
    roomName: "Climate Controlled C",
    roomCategory: "cherries",
    roomType: "climate-controlled",
    roomShape: "rectangle",
    length: 20,
    width: 15,
    rows: { count: 15 },
    columns: { count: 20 },
    levels: 5,
    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function RoomsPage() {
  const router = useRouter()
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  // Load saved rooms on component mount
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    setSavedRooms(exampleRooms)
    if (exampleRooms.length > 0) {
      setSelectedRoomId(exampleRooms[0].id)
    }
  }, [])

  const handleSelectRoom = (room: SavedRoom) => {
    setSelectedRoomId(room.id)
    // In a real app, this would load the room data into the context
    console.log("Selected room:", room)
  }

  const handleViewRoom = (room: SavedRoom) => {
    // Navigate to the 3D view for this room
    router.push(`/3d-view?roomId=${room.id}`)
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-2xl font-bold">My Rooms</h1>
        <Button onClick={() => router.push("/add-room")} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Room
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Room List - Left Side */}
        <div className="lg:col-span-5">
          <AvailableRoomsTable
            rooms={savedRooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
            onViewRoom={handleViewRoom}
          />
        </div>

        {/* Room Details - Right Side */}
        <div className="lg:col-span-7">
          {/* Your room details component would go here */}
          <div className="border rounded-lg p-6 h-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedRoomId ? `Room ${selectedRoomId} Details` : "Select a room to view details"}
            </h2>
            {/* Room details content */}
          </div>
        </div>
      </div>
    </div>
  )
}

