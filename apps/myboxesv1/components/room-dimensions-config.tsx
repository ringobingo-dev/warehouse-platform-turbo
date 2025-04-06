"use client"

import { useState, useEffect } from "react"
import { useBoxContext } from "@/context/BoxContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

interface RoomDimensionsConfigProps {
  onUpdateRoomDimensions: (dimensions: {
    rows: number
    columns: number
    levels: number
  }) => void
}

export default function RoomDimensionsConfig({ onUpdateRoomDimensions }: RoomDimensionsConfigProps) {
  const { rows, columns, levels, setRows, setColumns, setLevels } = useBoxContext()
  const { toast } = useToast()

  const [roomName, setRoomName] = useState("Cold Storage A")
  const [roomCategory, setRoomCategory] = useState("potatoes")
  const [roomType, setRoomType] = useState("cold-storage")
  const [roomShape, setRoomShape] = useState("rectangle")
  const [length, setLength] = useState(15)
  const [width, setWidth] = useState(10)
  const [rowCount, setRowCount] = useState(rows.count)
  const [columnCount, setColumnCount] = useState(columns.count)
  const [levelCount, setLevelCount] = useState(levels)

  // Update local state when context changes
  useEffect(() => {
    setRowCount(rows.count)
    setColumnCount(columns.count)
    setLevelCount(levels)
  }, [rows, columns, levels])

  const handleSaveRoom = () => {
    // In a real app, this would save to an API or database
    // For now, we'll simulate with localStorage
    try {
      const newRoom = {
        id: Date.now().toString(),
        roomName,
        roomCategory,
        roomType,
        roomShape,
        length,
        width,
        rows: { count: rowCount },
        columns: { count: columnCount },
        levels: levelCount,
        createdDate: new Date().toISOString(),
      }

      // Get existing rooms
      const savedRoomsData = localStorage.getItem("savedRooms")
      const savedRooms = savedRoomsData ? JSON.parse(savedRoomsData) : []

      // Add new room
      savedRooms.push(newRoom)

      // Save back to localStorage
      localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

      toast({
        title: "Room saved",
        description: `${roomName} has been saved successfully.`,
      })
    } catch (error) {
      console.error("Error saving room:", error)
      toast({
        title: "Error saving room",
        description: "There was a problem saving the room. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApplyChanges = () => {
    // Update the context
    setRows({ count: rowCount })
    setColumns({ count: columnCount })
    setLevels(levelCount)

    // Call the callback
    onUpdateRoomDimensions({
      rows: rowCount,
      columns: columnCount,
      levels: levelCount,
    })

    toast({
      title: "Room dimensions updated",
      description: "The room dimensions have been updated successfully.",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="w-full">
        <CardTitle>Room Dimensions Configuration</CardTitle>
        <CardDescription>Configure the dimensions of your storage room</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Tabs defaultValue="room-details" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="room-details" className="w-full">
              Room Details
            </TabsTrigger>
            <TabsTrigger value="grid-configuration" className="w-full">
              Grid Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="room-details" className="space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="roomName" className="w-full">
                  Room Name
                </Label>
                <Input
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="roomCategory" className="w-full">
                  Room Category
                </Label>
                <Select value={roomCategory} onValueChange={setRoomCategory}>
                  <SelectTrigger id="roomCategory" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="potatoes">Potatoes</SelectItem>
                    <SelectItem value="onions">Onions</SelectItem>
                    <SelectItem value="carrots">Carrots</SelectItem>
                    <SelectItem value="mixed">Mixed Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="roomType" className="w-full">
                  Room Type
                </Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger id="roomType" className="w-full">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="cold-storage">Cold Storage</SelectItem>
                    <SelectItem value="dry-storage">Dry Storage</SelectItem>
                    <SelectItem value="climate-controlled">Climate Controlled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="roomShape" className="w-full">
                  Room Shape
                </Label>
                <Select value={roomShape} onValueChange={setRoomShape}>
                  <SelectTrigger id="roomShape" className="w-full">
                    <SelectValue placeholder="Select room shape" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="split-side">Split Side</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="length" className="w-full">
                  Length (meters)
                </Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="width" className="w-full">
                  Width (meters)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="grid-configuration" className="space-y-4 w-full">
            <div className="grid grid-cols-1 gap-6 w-full">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <Label htmlFor="rowCount" className="w-full">
                    Rows: {rowCount}
                  </Label>
                  <Input
                    id="rowCount"
                    type="number"
                    value={rowCount}
                    onChange={(e) => setRowCount(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={20}
                  />
                </div>
                <Slider
                  id="rowSlider"
                  value={[rowCount]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => setRowCount(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <Label htmlFor="columnCount" className="w-full">
                    Columns: {columnCount}
                  </Label>
                  <Input
                    id="columnCount"
                    type="number"
                    value={columnCount}
                    onChange={(e) => setColumnCount(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={20}
                  />
                </div>
                <Slider
                  id="columnSlider"
                  value={[columnCount]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => setColumnCount(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <Label htmlFor="levelCount" className="w-full">
                    Levels: {levelCount}
                  </Label>
                  <Input
                    id="levelCount"
                    type="number"
                    value={levelCount}
                    onChange={(e) => setLevelCount(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={10}
                  />
                </div>
                <Slider
                  id="levelSlider"
                  value={[levelCount]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setLevelCount(value[0])}
                  className="w-full"
                />
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <Table className="w-full min-w-full">
                <TableCaption>Current room configuration</TableCaption>
                <TableHeader className="w-full">
                  <TableRow className="w-full">
                    <TableHead className="w-1/3">Parameter</TableHead>
                    <TableHead className="w-1/3">Value</TableHead>
                    <TableHead className="w-1/3">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full">
                  <TableRow className="w-full">
                    <TableCell>Rows</TableCell>
                    <TableCell>{rowCount}</TableCell>
                    <TableCell>Number of rows in the storage grid</TableCell>
                  </TableRow>
                  <TableRow className="w-full">
                    <TableCell>Columns</TableCell>
                    <TableCell>{columnCount}</TableCell>
                    <TableCell>Number of columns in the storage grid</TableCell>
                  </TableRow>
                  <TableRow className="w-full">
                    <TableCell>Levels</TableCell>
                    <TableCell>{levelCount}</TableCell>
                    <TableCell>Number of vertical levels for stacking</TableCell>
                  </TableRow>
                  <TableRow className="w-full">
                    <TableCell>Total Capacity</TableCell>
                    <TableCell>{rowCount * columnCount * levelCount} boxes</TableCell>
                    <TableCell>Maximum number of boxes that can be stored</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6 w-full">
          <Button variant="outline" onClick={handleSaveRoom} className="w-auto">
            Save Room
          </Button>
          <Button onClick={handleApplyChanges} className="w-auto">
            Apply Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// TODO: Review for Stage 1 completeness
// This file likely contains @/ imports that need to be updated
// possible duplicate — review for consolidation (with room-details-form.tsx)

