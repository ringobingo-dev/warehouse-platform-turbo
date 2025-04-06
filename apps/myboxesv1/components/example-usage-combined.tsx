"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AvailableRoomsTable, type SavedRoom as RoomType } from "./available-rooms-table"
import { RoomDetailsPanel } from "./room-details-panel"

// Example inventory data
const mockBoxData = {
  "1": [
    { customer: "Acme Fruit Co.", variety: "Gala", grade: "Premium", count: 24 },
    { customer: "Acme Fruit Co.", variety: "Fuji", grade: "Standard", count: 18 },
    { customer: "Fresh Harvest Ltd.", variety: "Honeycrisp", grade: "Premium", count: 32 },
    { customer: "Green Fields Produce", variety: "Granny Smith", grade: "Fancy", count: 15 },
    { customer: "Sunny Valley Farms", variety: "Red Delicious", grade: "Standard", count: 20 },
  ],
  "2": [
    { customer: "Orchard Delights Inc.", variety: "Yellow Onions", grade: "Jumbo", count: 28 },
    { customer: "Green Fields Produce", variety: "Red Onions", grade: "Medium", count: 16 },
    { customer: "Fresh Harvest Ltd.", variety: "White Onions", grade: "Small", count: 22 },
  ],
  "3": [
    { customer: "Sunny Valley Farms", variety: "Bing Cherries", grade: "A", count: 30 },
    { customer: "Acme Fruit Co.", variety: "Rainier Cherries", grade: "AA", count: 25 },
    { customer: "Orchard Delights Inc.", variety: "Black Cherries", grade: "B", count: 18 },
  ],
}

// Example rooms data
const exampleRooms: RoomType[] = [
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

export default function RoomsManagementPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<RoomType[]>(exampleRooms)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(rooms.length > 0 ? rooms[0].id : null)

  const handleSelectRoom = (room: RoomType) => {
    setSelectedRoomId(room.id)
  }

  const handleViewRoom = (room: RoomType) => {
    // Navigate to the 3D view for this room
    router.push(`/3d-view?roomId=${room.id}`)
  }

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || null

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-2xl font-bold">My Rooms</h1>
        <button
          onClick={() => router.push("/add-room")}
          className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
        >
          <span>Add New Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Room List - Left Side */}
        <div className="lg:col-span-5">
          <AvailableRoomsTable
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
            onViewRoom={handleViewRoom}
          />
        </div>

        {/* Room Details - Right Side */}
        <div className="lg:col-span-7">
          <RoomDetailsPanel selectedRoom={selectedRoom} inventoryData={mockBoxData} onViewRoom={handleViewRoom} />
        </div>
      </div>
    </div>
  )
}

