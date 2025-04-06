"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Warehouse,
  Box,
  Calendar,
  ArrowRight,
  Thermometer,
  Droplets,
  AlertCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageContainer } from "@/components/page-container"

// Mock data for warehouses
// NOTE: This will be replaced with data from PostgreSQL
const mockWarehouses = [
  {
    id: "wh-001",
    name: "Main Warehouse",
    location: "Twin Falls, ID",
    totalCapacity: 1000,
    usedCapacity: 650,
    rooms: [
      {
        id: "room-a101",
        name: "Room A101",
        capacity: 200,
        usedCapacity: 180,
        temperature: 4.5, // in Celsius
        humidity: 85, // percentage
        boxes: [
          {
            id: "box-001",
            grower: "Self",
            variety: "Russet",
            deliveryDate: "2023-09-15",
            boxCount: 60,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
          {
            id: "box-002",
            grower: "Self",
            variety: "Yukon Gold",
            deliveryDate: "2023-09-20",
            boxCount: 40,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
          {
            id: "box-003",
            grower: "Self",
            variety: "Red",
            deliveryDate: "2023-10-05",
            boxCount: 80,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
        ],
      },
      {
        id: "room-a102",
        name: "Room A102",
        capacity: 150,
        usedCapacity: 90,
        temperature: 3.8,
        humidity: 82,
        boxes: [
          {
            id: "box-004",
            grower: "Self",
            variety: "Fingerling",
            deliveryDate: "2023-10-10",
            boxCount: 30,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
          {
            id: "box-005",
            grower: "Self",
            variety: "Purple",
            deliveryDate: "2023-10-15",
            boxCount: 60,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
        ],
      },
      {
        id: "room-b201",
        name: "Room B201",
        capacity: 300,
        usedCapacity: 200,
        temperature: 5.2,
        humidity: 80,
        boxes: [
          {
            id: "box-006",
            grower: "Self",
            variety: "Russet",
            deliveryDate: "2023-11-01",
            boxCount: 120,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
          {
            id: "box-007",
            grower: "Self",
            variety: "Yukon Gold",
            deliveryDate: "2023-11-10",
            boxCount: 80,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
        ],
      },
      {
        id: "room-b202",
        name: "Room B202",
        capacity: 350,
        usedCapacity: 180,
        temperature: 4.0,
        humidity: 83,
        boxes: [
          {
            id: "box-008",
            grower: "Self",
            variety: "Red",
            deliveryDate: "2023-11-15",
            boxCount: 100,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
          {
            id: "box-009",
            grower: "Self",
            variety: "Fingerling",
            deliveryDate: "2023-11-20",
            boxCount: 80,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
        ],
      },
    ],
  },
  {
    id: "wh-002",
    name: "East Warehouse",
    location: "Burley, ID",
    totalCapacity: 800,
    usedCapacity: 400,
    rooms: [
      {
        id: "room-c101",
        name: "Room C101",
        capacity: 250,
        usedCapacity: 150,
        temperature: 4.2,
        humidity: 84,
        boxes: [
          {
            id: "box-010",
            grower: "Self",
            variety: "Russet",
            deliveryDate: "2023-10-01",
            boxCount: 90,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
          {
            id: "box-011",
            grower: "Self",
            variety: "Red",
            deliveryDate: "2023-10-10",
            boxCount: 60,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
        ],
      },
      {
        id: "room-c102",
        name: "Room C102",
        capacity: 200,
        usedCapacity: 100,
        temperature: 3.9,
        humidity: 81,
        boxes: [
          {
            id: "box-012",
            grower: "Self",
            variety: "Yukon Gold",
            deliveryDate: "2023-10-15",
            boxCount: 100,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
        ],
      },
      {
        id: "room-d201",
        name: "Room D201",
        capacity: 350,
        usedCapacity: 150,
        temperature: 4.5,
        humidity: 85,
        boxes: [
          {
            id: "box-013",
            grower: "Self",
            variety: "Russet",
            deliveryDate: "2023-11-05",
            boxCount: 150,
            status: "stored",
            notes: "Own harvest, not for invoicing",
          },
        ],
      },
    ],
  },
]

// Mock data for varieties
const mockVarieties = ["Russet", "Yukon Gold", "Red", "Fingerling", "Purple", "White", "Yellow"]

export default function StoragePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null)

  // Get all warehouses
  const warehouses = mockWarehouses

  // Get all rooms across all warehouses
  const allRooms = warehouses.flatMap((warehouse) => warehouse.rooms)

  // Get all boxes across all rooms
  const allBoxes = allRooms.flatMap((room) => room.boxes)

  // Filter boxes based on search query, selected warehouse, room, and variety
  const filteredBoxes = allBoxes.filter((box) => {
    const matchesSearch =
      box.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.grower.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesWarehouse = selectedWarehouse
      ? allRooms.find((room) => room.boxes.includes(box))?.id.startsWith(selectedWarehouse.split("-")[0])
      : true

    const matchesRoom = selectedRoom ? allRooms.find((room) => room.boxes.includes(box))?.id === selectedRoom : true

    const matchesVariety = selectedVariety ? box.variety === selectedVariety : true

    return matchesSearch && matchesWarehouse && matchesRoom && matchesVariety
  })

  // Get the room for a specific box
  const getRoomForBox = (boxId: string) => {
    return allRooms.find((room) => room.boxes.some((box) => box.id === boxId))
  }

  // Get the warehouse for a specific room
  const getWarehouseForRoom = (roomId: string) => {
    return warehouses.find((warehouse) => warehouse.rooms.some((room) => room.id === roomId))
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Storage Management"
        description="Manage your warehouse storage and boxes"
        actions={
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Box
            </Button>
            <Button variant="outline" asChild>
              <Link href="/storage/visualization">
                <Box className="mr-2 h-4 w-4" />
                3D Visualization
              </Link>
            </Button>
          </div>
        }
      />
      <PageContainer>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Warehouse Overview Cards */}
          {warehouses.map((warehouse) => (
            <Card key={warehouse.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Warehouse className="h-4 w-4 mr-2 text-muted-foreground" />
                  {warehouse.name}
                </CardTitle>
                <CardDescription>{warehouse.location}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span>
                      {warehouse.usedCapacity} / {warehouse.totalCapacity} boxes
                    </span>
                  </div>
                  <Progress value={(warehouse.usedCapacity / warehouse.totalCapacity) * 100} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href={`/storage?warehouse=${warehouse.id}`}>View Rooms</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Storage Boxes</h2>
            <p className="text-sm text-muted-foreground">Manage your own storage boxes (not for invoicing)</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search boxes..."
                className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Select onValueChange={(value) => setSelectedWarehouse(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Select onValueChange={(value) => setSelectedRoom(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      {allRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Select onValueChange={(value) => setSelectedVariety(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Variety" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Varieties</SelectItem>
                      {mockVarieties.map((variety) => (
                        <SelectItem key={variety} value={variety}>
                          {variety}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notice about self-storage */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Owner Storage</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                This section displays boxes owned by you (the warehouse owner). These boxes are not associated with
                customers and will not generate invoices.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Storage Boxes */}
        <div className="space-y-4">
          {filteredBoxes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No boxes found. Try adjusting your search or filters.
            </div>
          ) : (
            filteredBoxes.map((box) => {
              const room = getRoomForBox(box.id)
              const warehouse = room ? getWarehouseForRoom(room.id) : null

              return (
                <Card key={box.id} className="overflow-hidden">
                  <div className="bg-muted px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Box className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{box.variety} Potatoes</h3>
                        <p className="text-sm text-muted-foreground">{box.boxCount} boxes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Self Storage</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Box</DropdownMenuItem>
                          <DropdownMenuItem>Move Box</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove Box</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Warehouse className="h-4 w-4 text-muted-foreground" />
                          <span>Warehouse: {warehouse?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Box className="h-4 w-4 text-muted-foreground" />
                          <span>Room: {room?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Delivery Date: {new Date(box.deliveryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span>Temperature: {room?.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Droplets className="h-4 w-4 text-muted-foreground" />
                          <span>Humidity: {room?.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span>Status: {box.status.charAt(0).toUpperCase() + box.status.slice(1)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span>
                          <p className="text-muted-foreground mt-1">{box.notes}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* PostgreSQL Integration Note */}
        <div className="mt-8 p-4 border rounded-md bg-muted/30">
          <h3 className="font-medium mb-2">PostgreSQL Integration Note</h3>
          <p className="text-sm text-muted-foreground">
            This page will be integrated with PostgreSQL to fetch and manage warehouse storage data. The implementation
            will include:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>Fetching warehouse, room, and box data from the database</li>
            <li>Filtering and searching capabilities using SQL queries</li>
            <li>CRUD operations for managing boxes</li>
            <li>Real-time temperature and humidity monitoring</li>
          </ul>
          <div className="mt-4 text-sm">
            <p className="font-medium">Example PostgreSQL Query:</p>
            <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
              {`-- Query to get all self-storage boxes (not for invoicing)
SELECT b.*, r.name as room_name, r.temperature, r.humidity, w.name as warehouse_name
FROM boxes b
JOIN rooms r ON b.room_id = r.id
JOIN warehouses w ON r.warehouse_id = w.id
WHERE b.owner_id = $1 AND b.is_self_storage = true
ORDER BY b.delivery_date DESC;`}
            </pre>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

