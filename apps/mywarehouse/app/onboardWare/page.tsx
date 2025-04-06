"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Edit, Plus, CuboidIcon as Cube } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import RoomCreationModule from "@/components/RoomCreationModule"

interface CompanyProfile {
  name: string
  website: string
  about: string
  email: string
  industry: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
}

interface WarehouseProfile {
  name: string
  type: string
  address: string
  city: string
  state: string
  zipCode: string
  totalSize: number
  yearBuilt: number
  facilities: string[]
}

interface Room {
  id: string
  name: string
  createdAt: string
  category: string
  type: string
  shape: string
  dimensions: {
    length: number
    width: number
    secondLength?: number
    secondWidth?: number
  }
  doorPosition: {
    wall: string
    offset: number
  }
  corridor: {
    wall: string
    width: number
  }
  rows: {
    count: number
    startWall: string
  }
  columns: {
    count: number
  }
  stackHeight: number
}

export default function OnboardWarePage() {
  const [companyProfile] = useState<CompanyProfile>({
    name: "Acme Storage Solutions",
    website: "www.acmestorage.com",
    about:
      "Leading provider of agricultural storage solutions with over 10 years of experience in maintaining product quality and freshness.",
    email: "contact@acmestorage.com",
    industry: "Agricultural Storage",
    address: "123 Warehouse Drive",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    phone: "(555) 123-4567",
  })

  const [warehouseProfile] = useState<WarehouseProfile>({
    name: "Main Facility",
    type: "Climate Controlled",
    address: "456 Storage Lane",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    totalSize: 50000,
    yearBuililt: 2018,
    facilities: ["Loading Docks", "Refrigeration", "Humidity Control", "Security System"],
  })

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Cold Storage A",
      createdAt: "2024-01-11",
      category: "Refrigerated",
      type: "cold_storage",
      shape: "rectangle",
      dimensions: { length: 40, width: 30 },
      doorPosition: { wall: "front", offset: 50 },
      corridor: { wall: "front", width: 3 },
      rows: { count: 5, startWall: "left" },
      columns: { count: 8 },
      stackHeight: 3,
    },
    {
      id: "2",
      name: "Dry Storage B",
      createdAt: "2024-01-15",
      category: "Standard",
      type: "dry_storage",
      shape: "L-shaped",
      dimensions: { length: 50, width: 40, secondLength: 20, secondWidth: 30 },
      doorPosition: { wall: "left", offset: 30 },
      corridor: { wall: "left", width: 4 },
      rows: { count: 6, startWall: "right" },
      columns: { count: 10 },
      stackHeight: 4,
    },
    {
      id: "3",
      name: "Climate Control C",
      createdAt: "2024-01-20",
      category: "Climate Controlled",
      type: "climate_controlled",
      shape: "rectangle",
      dimensions: { length: 45, width: 35 },
      doorPosition: { wall: "front", offset: 50 },
      corridor: { wall: "front", width: 3 },
      rows: { count: 4, startWall: "left" },
      columns: { count: 9 },
      stackHeight: 3,
    },
    {
      id: "4",
      name: "Freezer Unit 1",
      createdAt: "2024-01-25",
      category: "Deep Freeze",
      type: "freezer",
      shape: "rectangle",
      dimensions: { length: 30, width: 25 },
      doorPosition: { wall: "front", offset: 50 },
      corridor: { wall: "front", width: 2 },
      rows: { count: 3, startWall: "left" },
      columns: { count: 6 },
      stackHeight: 2,
    },
    {
      id: "5",
      name: "Bulk Storage Hall",
      createdAt: "2024-02-01",
      category: "Standard",
      type: "bulk_storage",
      shape: "rectangle",
      dimensions: { length: 80, width: 60 },
      doorPosition: { wall: "front", offset: 50 },
      corridor: { wall: "front", width: 5 },
      rows: { count: 10, startWall: "left" },
      columns: { count: 12 },
      stackHeight: 5,
    },
    {
      id: "6",
      name: "Humidity Controlled Room",
      createdAt: "2024-02-05",
      category: "Climate Controlled",
      type: "humidity_controlled",
      shape: "rectangle",
      dimensions: { length: 35, width: 30 },
      doorPosition: { wall: "front", offset: 50 },
      corridor: { wall: "front", width: 3 },
      rows: { count: 4, startWall: "left" },
      columns: { count: 7 },
      stackHeight: 3,
    },
    {
      id: "7",
      name: "Quarantine Area",
      createdAt: "2024-02-10",
      category: "Isolated",
      type: "quarantine",
      shape: "rectangle",
      dimensions: { length: 20, width: 15 },
      doorPosition: { wall: "front", offset: 50 },
      corridor: { wall: "front", width: 2 },
      rows: { count: 2, startWall: "left" },
      columns: { count: 5 },
      stackHeight: 2,
    },
    {
      id: "8",
      name: "High-Value Goods Vault",
      createdAt: "2024-02-15",
      category: "Secure",
      type: "secure",
      shape: "rectangle",
      dimensions: { length: 25, width: 20 },
      doorPosition: { wall: "front", offset: 50 },
      corridor: { wall: "front", width: 2 },
      rows: { count: 3, startWall: "left" },
      columns: { count: 4 },
      stackHeight: 2,
    },
  ])

  const [isRoomCreationOpen, setIsRoomCreationOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Warehouse Management</h1>

      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rooms">Room Management</TabsTrigger>
          <TabsTrigger value="profiles">Profile Information</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Room Creation</h2>
              <p className="text-sm text-muted-foreground">Manage your storage rooms and their configurations</p>
            </div>
            <Dialog open={isRoomCreationOpen} onOpenChange={setIsRoomCreationOpen}>
              <DialogTrigger asChild>
                <Button className="mt-2 md:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Room</DialogTitle>
                </DialogHeader>
                <RoomCreationModule onClose={() => setIsRoomCreationOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <p>Created: {room.createdAt}</p>
                        <p>Category: {room.category}</p>
                        <p>Type: {room.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingRoom(room)
                              setIsRoomCreationOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          // TODO: Implement 3D visualization logic
                          console.log(`Opening 3D visualization for room ${room.id}`)
                        }}
                        title="Open 3D Visualization"
                      >
                        <Cube className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium">Dimensions:</span> {room.dimensions.length}m ×{" "}
                      {room.dimensions.width}m
                      {room.dimensions.secondLength &&
                        ` + ${room.dimensions.secondLength}m × ${room.dimensions.secondWidth}m`}
                    </div>
                    <div>
                      <span className="font-medium">Shape:</span> {room.shape}
                    </div>
                    <div>
                      <span className="font-medium">Door:</span> {room.doorPosition.wall} wall,{" "}
                      {room.doorPosition.offset}% offset
                    </div>
                    <div>
                      <span className="font-medium">Corridor:</span> {room.corridor.wall} wall, {room.corridor.width}m
                      wide
                    </div>
                    <div>
                      <span className="font-medium">Storage:</span> {room.rows.count} rows, {room.columns.count}{" "}
                      columns, {room.stackHeight} high
                    </div>
                    <div>
                      <span className="font-medium">Capacity:</span>{" "}
                      {room.rows.count * room.columns.count * room.stackHeight} boxes
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profiles">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <CardTitle>Company Profile</CardTitle>
                  <CardDescription>Your company information and details</CardDescription>
                </div>
                <Button variant="outline" size="icon" className="mt-2 md:mt-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <p className="text-sm mt-1">{companyProfile.name}</p>
                  </div>
                  <div>
                    <Label>Website</Label>
                    <p className="text-sm mt-1">{companyProfile.website}</p>
                  </div>
                </div>
                <div>
                  <Label>About</Label>
                  <p className="text-sm mt-1">{companyProfile.about}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email Address</Label>
                    <p className="text-sm mt-1">{companyProfile.email}</p>
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <p className="text-sm mt-1">{companyProfile.industry}</p>
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <p className="text-sm mt-1">
                    {companyProfile.address}, {companyProfile.city}, {companyProfile.state} {companyProfile.zipCode}
                  </p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm mt-1">{companyProfile.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <CardTitle>Warehouse Profile</CardTitle>
                  <CardDescription>Your warehouse facility information</CardDescription>
                </div>
                <Button variant="outline" size="icon" className="mt-2 md:mt-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Warehouse Name</Label>
                    <p className="text-sm mt-1">{warehouseProfile.name}</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <p className="text-sm mt-1">{warehouseProfile.type}</p>
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <p className="text-sm mt-1">
                    {warehouseProfile.address}, {warehouseProfile.city}, {warehouseProfile.state}{" "}
                    {warehouseProfile.zipCode}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Total Size (sq ft)</Label>
                    <p className="text-sm mt-1">{warehouseProfile.totalSize.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Year Built</Label>
                    <p className="text-sm mt-1">{warehouseProfile.yearBuilt}</p>
                  </div>
                </div>
                <div>
                  <Label>Available Facilities</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {warehouseProfile.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <Dialog
        open={isRoomCreationOpen}
        onOpenChange={(open) => {
          setIsRoomCreationOpen(open)
          if (!open) setEditingRoom(null)
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Create New Room"}</DialogTitle>
          </DialogHeader>
          <RoomCreationModule
            initialData={editingRoom}
            onClose={() => {
              setIsRoomCreationOpen(false)
              setEditingRoom(null)
            }}
            onSave={(updatedRoom) => {
              setRooms(rooms.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)))
              setIsRoomCreationOpen(false)
              setEditingRoom(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

