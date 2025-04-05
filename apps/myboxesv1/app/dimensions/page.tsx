"use client"

import { useEffect, useState } from "react"
import { useBoxContext } from "@/context/BoxContext"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Warehouse, Building2, Thermometer, ArrowRight, Calendar, Grid3x3, Layers } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

/**
 * @database PostgreSQL
 * @table rooms
 * @schema
 * - id: uuid PRIMARY KEY
 * - room_name: varchar(255) NOT NULL
 * - room_category: varchar(100) NOT NULL
 * - room_type: varchar(100) NOT NULL
 * - room_shape: varchar(100) NOT NULL
 * - length: decimal(10,2) NOT NULL
 * - width: decimal(10,2) NOT NULL
 * - rows_count: integer NOT NULL
 * - columns_count: integer NOT NULL
 * - levels: integer NOT NULL
 * - created_date: timestamp NOT NULL DEFAULT now()
 * - updated_date: timestamp NOT NULL DEFAULT now()
 * - user_id: uuid REFERENCES users(id)
 */
interface SavedRoom {
  id: string
  roomName: string
  roomCategory: string
  roomType: string
  roomShape: string
  length: number
  width: number
  rows: {
    count: number
  }
  columns: {
    count: number
  }
  levels: number
  createdDate: string
}

// Updated mock data with grade information
const mockBoxData = {
  "1": [
    // Cold Storage A
    { customer: "Acme Fruit Co.", variety: "Gala", grade: "Premium", count: 24 },
    { customer: "Acme Fruit Co.", variety: "Fuji", grade: "Standard", count: 18 },
    { customer: "Fresh Harvest Ltd.", variety: "Honeycrisp", grade: "Premium", count: 32 },
    { customer: "Green Fields Produce", variety: "Granny Smith", grade: "Fancy", count: 15 },
    { customer: "Sunny Valley Farms", variety: "Red Delicious", grade: "Standard", count: 20 },
  ],
  "2": [
    // Dry Storage B
    { customer: "Orchard Delights Inc.", variety: "Yellow Onions", grade: "Jumbo", count: 28 },
    { customer: "Green Fields Produce", variety: "Red Onions", grade: "Medium", count: 16 },
    { customer: "Fresh Harvest Ltd.", variety: "White Onions", grade: "Small", count: 22 },
  ],
  "3": [
    // Climate Controlled C
    { customer: "Sunny Valley Farms", variety: "Bing Cherries", grade: "A", count: 30 },
    { customer: "Acme Fruit Co.", variety: "Rainier Cherries", grade: "AA", count: 25 },
    { customer: "Orchard Delights Inc.", variety: "Black Cherries", grade: "B", count: 18 },
  ],
}

export default function DimensionsPage() {
  const { rows, columns, levels, boxes, getRoomCapacity } = useBoxContext()
  const router = useRouter()
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  // Load saved rooms from localStorage on component mount
  useEffect(() => {
    // TODO: Replace localStorage with API call to PostgreSQL database
    // API endpoint: GET /api/rooms
    // SST + OpenNext implementation:
    // 1. Create a new API route in app/api/rooms/route.ts
    // 2. Connect to PostgreSQL using Prisma or another ORM
    // 3. Fetch rooms associated with the current user
    const loadSavedRooms = () => {
      try {
        const savedRoomsData = localStorage.getItem("savedRooms")
        if (savedRoomsData) {
          const rooms = JSON.parse(savedRoomsData)
          setSavedRooms(rooms)
          if (rooms.length > 0) {
            setSelectedRoomId(rooms[0].id)
          }
        } else {
          // Add some example rooms if none exist
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
          setSavedRooms(exampleRooms)
          setSelectedRoomId(exampleRooms[0].id)
          localStorage.setItem("savedRooms", JSON.stringify(exampleRooms))
        }
      } catch (error) {
        console.error("Error loading saved rooms:", error)
      }
    }

    loadSavedRooms()
  }, [])

  const getRoomTypeIcon = (roomType: string) => {
    switch (roomType) {
      case "cold-storage":
        return <Thermometer className="h-5 w-5" />
      case "dry-storage":
        return <Warehouse className="h-5 w-5" />
      case "climate-controlled":
        return <Building2 className="h-5 w-5" />
      default:
        return <Warehouse className="h-5 w-5" />
    }
  }

  const getRoomTypeText = (roomType: string) => {
    switch (roomType) {
      case "cold-storage":
        return "Cold Storage"
      case "dry-storage":
        return "Dry Storage"
      case "climate-controlled":
        return "Climate Controlled"
      default:
        return "Unknown"
    }
  }

  const getRoomShapeText = (roomShape: string) => {
    switch (roomShape) {
      case "square":
        return "Square"
      case "rectangle":
        return "Rectangle"
      case "split-side":
        return "Split Side"
      default:
        return "Not specified"
    }
  }

  const getRoomCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      potatoes: "bg-amber-100 text-amber-800 border-amber-200",
      onions: "bg-purple-100 text-purple-800 border-purple-200",
      cherries: "bg-red-100 text-red-800 border-red-200",
      default: "bg-blue-100 text-blue-800 border-blue-200",
    }

    const color = colors[category] || colors.default

    return (
      <Badge variant="outline" className={`${color} capitalize`}>
        {category}
      </Badge>
    )
  }

  const getGradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      Premium: "bg-green-100 text-green-800 border-green-200",
      Standard: "bg-blue-100 text-blue-800 border-blue-200",
      Fancy: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Jumbo: "bg-amber-100 text-amber-800 border-amber-200",
      Medium: "bg-orange-100 text-orange-800 border-orange-200",
      Small: "bg-gray-100 text-gray-800 border-gray-200",
      A: "bg-green-100 text-green-800 border-green-200",
      AA: "bg-emerald-100 text-emerald-800 border-emerald-200",
      B: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }

    const color = colors[grade] || "bg-gray-100 text-gray-800 border-gray-200"

    return (
      <Badge variant="outline" className={`${color} text-xs`}>
        {grade}
      </Badge>
    )
  }

  const handleSelectRoom = (room: SavedRoom) => {
    setSelectedRoomId(room.id)
    // In a real app, this would load the room data into the context
    console.log("Selected room:", room)
  }

  const handleViewRoom = (room: SavedRoom) => {
    // Navigate to the 3D view for this room
    router.push("/3d-view")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const selectedRoom = savedRooms.find((room) => room.id === selectedRoomId)

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
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Available Rooms</h2>
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {savedRooms.map((room) => (
              <Card
                key={room.id}
                className={`w-full hover:shadow-md transition-shadow cursor-pointer border-2 ${
                  selectedRoomId === room.id ? "border-primary" : "border-transparent"
                }`}
                onClick={() => handleSelectRoom(room)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{room.roomName}</h3>
                      {getRoomCategoryBadge(room.roomCategory)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getRoomTypeIcon(room.roomType)}
                      <span>{getRoomTypeText(room.roomType)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Dimensions</div>
                        <div className="font-medium">
                          {room.length}m × {room.width}m
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Grid</div>
                        <div className="font-medium">
                          {room.rows.count} × {room.columns.count} × {room.levels}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Created</div>
                        <div className="font-medium">{formatDate(room.createdDate)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 hover:bg-primary hover:text-primary-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewRoom(room)
                        }}
                      >
                        View <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {savedRooms.length === 0 && (
              <div className="text-center p-8 border rounded-lg bg-muted/10 w-full">
                <p className="text-muted-foreground">No saved rooms found. Create a new room to get started.</p>
                <Button onClick={() => router.push("/add-room")} className="mt-4">
                  Add New Room
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Room Details - Right Side */}
        <div className="lg:col-span-7">
          {selectedRoom ? (
            <Card className="h-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{selectedRoom.roomName} Details</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Capacity</div>
                      <div className="font-medium">
                        {selectedRoom.rows.count * selectedRoom.columns.count * selectedRoom.levels} boxes
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Created</div>
                      <div className="font-medium">{formatDate(selectedRoom.createdDate)}</div>
                    </div>
                  </div>

                  {/* Customer Inventory Table */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Current Inventory</h3>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full min-w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-2 text-sm font-medium text-muted-foreground">Customer</th>
                            <th className="text-left p-2 text-sm font-medium text-muted-foreground">Variety</th>
                            <th className="text-left p-2 text-sm font-medium text-muted-foreground">Grade</th>
                            <th className="text-right p-2 text-sm font-medium text-muted-foreground">Box Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockBoxData[selectedRoom.id]?.map((item, index) => (
                            <tr key={index} className="border-b border-muted/30 hover:bg-muted/20">
                              <td className="p-2 text-sm">{item.customer}</td>
                              <td className="p-2 text-sm">{item.variety}</td>
                              <td className="p-2 text-sm">{getGradeBadge(item.grade)}</td>
                              <td className="p-2 text-sm text-right font-medium">{item.count}</td>
                            </tr>
                          ))}
                          {!mockBoxData[selectedRoom.id] || mockBoxData[selectedRoom.id].length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-sm text-muted-foreground">
                                No inventory data available
                              </td>
                            </tr>
                          ) : (
                            <tr className="bg-muted/20">
                              <td colSpan={3} className="p-2 text-sm font-medium">
                                Total
                              </td>
                              <td className="p-2 text-sm text-right font-bold">
                                {mockBoxData[selectedRoom.id]?.reduce((sum, item) => sum + item.count, 0) || 0}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Usage Summary */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Usage Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Space Utilization</span>
                        <span className="text-sm font-medium">
                          {mockBoxData[selectedRoom.id]?.reduce((sum, item) => sum + item.count, 0) || 0} /{" "}
                          {selectedRoom.rows.count * selectedRoom.columns.count * selectedRoom.levels} boxes
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(100, ((mockBoxData[selectedRoom.id]?.reduce((sum, item) => sum + item.count, 0) || 0) / (selectedRoom.rows.count * selectedRoom.columns.count * selectedRoom.levels)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t flex justify-end">
                <Button onClick={() => handleViewRoom(selectedRoom)}>View in 3D</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select a room to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

