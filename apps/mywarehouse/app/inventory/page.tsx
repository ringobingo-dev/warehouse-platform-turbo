"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Folder, Box, Search, ChevronRight, ChevronDown } from "lucide-react"
import { AddInventoryModule } from "@/components/AddInventoryModule"
import InventoryTemplateDialog from "@/components/InventoryTemplateDialog"

interface InventoryItem {
  box_id: string
  customer_id: string
  logistics_id: string
  transport_id: string
  room_id_box_id: string
  action: string
  box_scan: string
  cost_per_day: number
  Grade: string
  Grower: string
  deliveryDate: string
  pickupDate?: string
  Type: string
  Variety: string
  weight: number
  Generation?: string
}

interface TemplateAttribute {
  name: string
  type: "text" | "select" | "date"
  isMandatory: boolean
  value: string | number | Date | null
  options?: string[]
}

const mockInventory: InventoryItem[] = [
  {
    box_id: "B001",
    customer_id: "C001",
    logistics_id: "L001",
    transport_id: "T001",
    room_id_box_id: "R001#B001",
    action: "Stored",
    box_scan: "Scanned",
    cost_per_day: 5.0,
    Grade: "A",
    Grower: "Farm Fresh Inc.",
    deliveryDate: "2023-06-01",
    pickupDate: "2023-06-15",
    Type: "Apples",
    Variety: "Gala",
    weight: 20.5,
    Generation: "Gen 1",
  },
  {
    box_id: "B002",
    customer_id: "C002",
    logistics_id: "L002",
    transport_id: "T002",
    room_id_box_id: "R001#B002",
    action: "In Transit",
    box_scan: "Not Scanned",
    cost_per_day: 4.5,
    Grade: "B",
    Grower: "Organic Farms Ltd.",
    deliveryDate: "2023-06-02",
    pickupDate: "2023-06-20",
    Type: "Oranges",
    Variety: "Valencia",
    weight: 22.0,
    Generation: "Gen 2",
  },
]

export default function InventoryPage() {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [collapsedRooms, setCollapsedRooms] = useState<{ [key: string]: boolean }>({
    "Room 1": false,
    "Room 2": false,
  })
  const [templates, setTemplates] = useState<{
    [key: string]: TemplateAttribute[]
  }>({
    Potatoes: [
      { name: "Variety", type: "text", isMandatory: true, value: "" },
      { name: "Type", type: "select", options: ["table", "seed"], isMandatory: true, value: "table" },
      { name: "Grade", type: "text", isMandatory: true, value: "" },
      { name: "Grower", type: "select", options: ["Grower 1", "Grower 2", "Grower 3"], isMandatory: true, value: "" },
      { name: "Delivery Date", type: "date", isMandatory: true, value: "" },
      { name: "Weight", type: "text", isMandatory: false, value: "" },
      { name: "Generation", type: "text", isMandatory: false, value: "" },
      { name: "Field Location", type: "text", isMandatory: false, value: "" },
    ],
  })

  const handleSaveTemplate = (templateName: string, attributes: TemplateAttribute[]) => {
    setTemplates((prev) => ({
      ...prev,
      [templateName]: attributes,
    }))
  }

  const filteredInventory = mockInventory.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => setIsTemplateDialogOpen(true)}>Inventory Template</Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roomView">Room View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">Rooms</h2>
                <div className="space-y-2">
                  {Object.entries(collapsedRooms).map(([room, isCollapsed]) => (
                    <div key={room}>
                      <div
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                        onClick={() => {
                          setSelectedRoom(room)
                          setCollapsedRooms((prev) => ({ ...prev, [room]: !prev[room] }))
                        }}
                      >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                        <Folder size={18} />
                        <span>{room}</span>
                      </div>
                      {!isCollapsed && (
                        <div className="ml-6 space-y-2 mt-2">
                          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                            <Box size={18} />
                            <span>Box Type A</span>
                          </div>
                          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                            <Box size={18} />
                            <span>Box Type B</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
            <ResizablePanel defaultSize={75}>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {selectedRoom ? `Inventory for ${selectedRoom}` : "All Inventory"}
                </h2>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <AddInventoryModule
                      onAddItem={(newItem) => {
                        // TODO: Implement logic to add the new item to the inventory
                        console.log("New item added:", newItem)
                      }}
                      onCreatePickupJob={(job) => {
                        // TODO: Implement logic to create a pickup job
                        console.log("New pickup job created:", job)
                      }}
                      savedTemplate={templates[selectedRoom || "Potatoes"] || []}
                      userId="current-user-id" // Replace with actual user ID
                      roomData={
                        selectedRoom
                          ? {
                              varieties: ["Variety A", "Variety B", "Variety C"], // Replace with actual varieties for the selected room
                              grades: ["Grade A", "Grade B", "Grade C"], // Replace with actual grades for the selected room
                            }
                          : undefined
                      }
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Variety</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Grower</TableHead>
                      <TableHead>Generation</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Pickup Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.box_id}>
                        <TableCell>{item.Type}</TableCell>
                        <TableCell>{item.Variety}</TableCell>
                        <TableCell>{item.Grade}</TableCell>
                        <TableCell>{item.Grower}</TableCell>
                        <TableCell>{item.Generation}</TableCell>
                        <TableCell>{item.action}</TableCell>
                        <TableCell>{item.deliveryDate}</TableCell>
                        <TableCell>{item.pickupDate || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        <TabsContent value="roomView">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">3D Room View</h2>
            <p>This section will display a 3D representation of where boxes are stored in the room.</p>
            {/* TODO: Implement 3D room view using Three.js or a similar library */}
          </div>
        </TabsContent>
      </Tabs>
      <InventoryTemplateDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        onSaveTemplate={handleSaveTemplate}
      />
    </div>
  )
}

