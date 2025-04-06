"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import RoomLayout2D from "./RoomLayout2D"

interface RoomCreationModuleProps {
  onClose: () => void
  initialData?: Room
  onSave?: (updatedRoom: Room) => void
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
    wall: "front" | "left" | "right" | "back"
    offset: number
  }
  corridor: {
    wall: "front" | "left" | "right" | "back"
    width: number
  }
  rows: {
    count: number
    startWall: "left" | "right"
  }
  columns: {
    count: number
  }
  stackHeight: number
}

export default function RoomCreationModule({ onClose, initialData, onSave }: RoomCreationModuleProps) {
  const [step, setStep] = useState(1)
  const [roomData, setRoomData] = useState<Room>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    createdAt: initialData?.createdAt || new Date().toISOString().split("T")[0],
    category: initialData?.category || "",
    type: initialData?.type || "",
    shape: initialData?.shape || "rectangle",
    dimensions: initialData?.dimensions || {
      length: 0,
      width: 0,
    },
    doorPosition: initialData?.doorPosition || {
      wall: "front",
      offset: 50,
    },
    corridor: initialData?.corridor || {
      wall: "front",
      width: 0,
    },
    rows: initialData?.rows || {
      count: 0,
      startWall: "left",
    },
    columns: initialData?.columns || {
      count: 0,
    },
    stackHeight: initialData?.stackHeight || 1,
  })

  useEffect(() => {
    if (initialData) {
      setRoomData(initialData)
    }
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRoomData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setRoomData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step === 1 && !isStep1Valid()) {
      alert("Please fill in all required fields before proceeding.")
      return
    }
    setStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(roomData)
    }
    onClose()
  }

  const isStep1Valid = () => {
    return (
      roomData.name !== "" &&
      roomData.category !== "" &&
      roomData.type !== "" &&
      roomData.shape !== "" &&
      roomData.dimensions.length > 0 &&
      roomData.dimensions.width > 0
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input id="name" name="name" value={roomData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Room Category</Label>
                <Select
                  name="category"
                  value={roomData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Potatoes">Potatoes</SelectItem>
                    <SelectItem value="Cherries">Cherries</SelectItem>
                    <SelectItem value="Onions">Onions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Room Type</Label>
                <Select
                  name="type"
                  value={roomData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold_storage">Cold Storage</SelectItem>
                    <SelectItem value="dry_storage">Dry Storage</SelectItem>
                    <SelectItem value="climate_controlled">Climate Controlled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  value={roomData.createdAt}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (m)</Label>
                  <Input
                    type="number"
                    id="length"
                    name="length"
                    value={roomData.dimensions.length}
                    onChange={(e) =>
                      setRoomData((prev) => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, length: Math.floor(Number(e.target.value)) },
                      }))
                    }
                    min="1"
                    step="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (m)</Label>
                  <Input
                    type="number"
                    id="width"
                    name="width"
                    value={roomData.dimensions.width}
                    onChange={(e) =>
                      setRoomData((prev) => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, width: Math.floor(Number(e.target.value)) },
                      }))
                    }
                    min="1"
                    step="1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shape">Room Shape</Label>
                <Select
                  name="shape"
                  value={roomData.shape}
                  onValueChange={(value) => handleSelectChange("shape", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="L-shaped">L-shaped</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="T-shaped">T-shaped</SelectItem>
                    <SelectItem value="U-shaped">U-shaped</SelectItem>
                    <SelectItem value="custom">Custom Shape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(roomData.shape === "L-shaped" ||
                roomData.shape === "T-shaped" ||
                roomData.shape === "U-shaped" ||
                roomData.shape === "custom") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondLength">Second Length (m)</Label>
                    <Input
                      type="number"
                      id="secondLength"
                      name="secondLength"
                      value={roomData.dimensions.secondLength || 0}
                      onChange={(e) =>
                        setRoomData((prev) => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, secondLength: Number(e.target.value) },
                        }))
                      }
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondWidth">Second Width (m)</Label>
                    <Input
                      type="number"
                      id="secondWidth"
                      name="secondWidth"
                      value={roomData.dimensions.secondWidth || 0}
                      onChange={(e) =>
                        setRoomData((prev) => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, secondWidth: Number(e.target.value) },
                        }))
                      }
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Define Room Layout</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-full aspect-[21/9]">
                <RoomLayout2D
                  dimensions={roomData.dimensions}
                  shape={roomData.shape}
                  unit="m"
                  doorPosition={roomData.doorPosition}
                  corridor={roomData.corridor}
                  rows={roomData.rows}
                  columns={roomData.columns}
                  stackHeight={roomData.stackHeight}
                  padding={20}
                  horizontalLabels={true}
                  shrinkKey={true}
                  showDimensionsInKey={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doorWall">Door Wall</Label>
                <Select
                  name="doorWall"
                  value={roomData.doorPosition.wall}
                  onValueChange={(value) =>
                    setRoomData((prev) => ({ ...prev, doorPosition: { ...prev.doorPosition, wall: value } }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select door wall" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doorOffset">Door Offset (%)</Label>
                <Input
                  type="number"
                  id="doorOffset"
                  name="doorOffset"
                  value={roomData.doorPosition.offset}
                  onChange={(e) =>
                    setRoomData((prev) => ({
                      ...prev,
                      doorPosition: { ...prev.doorPosition, offset: Math.min(91, Number(e.target.value)) },
                    }))
                  }
                  min="0"
                  max="91"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corridorWall">Corridor Wall</Label>
                <Select
                  name="corridorWall"
                  value={roomData.corridor.wall}
                  onValueChange={(value) =>
                    setRoomData((prev) => ({ ...prev, corridor: { ...prev.corridor, wall: value } }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select corridor wall" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="corridorWidth">Corridor Width (m)</Label>
                <Input
                  type="number"
                  id="corridorWidth"
                  name="corridorWidth"
                  value={roomData.corridor.width}
                  onChange={(e) =>
                    setRoomData((prev) => ({
                      ...prev,
                      corridor: { ...prev.corridor, width: Math.floor(Number(e.target.value)) },
                    }))
                  }
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Define Storage Layout</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-full aspect-[21/9]">
                <RoomLayout2D
                  dimensions={roomData.dimensions}
                  shape={roomData.shape}
                  unit="m"
                  doorPosition={roomData.doorPosition}
                  corridor={roomData.corridor}
                  rows={roomData.rows}
                  columns={roomData.columns}
                  stackHeight={roomData.stackHeight}
                  padding={20}
                  horizontalLabels={true}
                  shrinkKey={true}
                  showDimensionsInKey={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rowCount">Number of Rows</Label>
                <Input
                  type="number"
                  id="rowCount"
                  name="rowCount"
                  value={roomData.rows.count}
                  onChange={(e) =>
                    setRoomData((prev) => ({ ...prev, rows: { ...prev.rows, count: Number(e.target.value) } }))
                  }
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rowStartWall">Start Wall for Rows</Label>
                <Select
                  name="rowStartWall"
                  value={roomData.rows.startWall}
                  onValueChange={(value) =>
                    setRoomData((prev) => ({ ...prev, rows: { ...prev.rows, startWall: value } }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select start wall" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="columnCount">Number of Columns</Label>
                <Input
                  type="number"
                  id="columnCount"
                  name="columnCount"
                  value={roomData.columns.count}
                  onChange={(e) => setRoomData((prev) => ({ ...prev, columns: { count: Number(e.target.value) } }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stackHeight">Stack Height</Label>
                <Input
                  type="number"
                  id="stackHeight"
                  name="stackHeight"
                  value={roomData.stackHeight}
                  onChange={(e) => setRoomData((prev) => ({ ...prev, stackHeight: Number(e.target.value) }))}
                  min="1"
                />
              </div>
            </div>
            <h4 className="text-md font-medium mt-6">Additional Layout Options</h4>
            <p className="text-sm text-muted-foreground">
              Customize additional layout options for your room here. This section can be expanded with more specific
              controls as needed.
            </p>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Room Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="w-full aspect-[21/9]">
                <RoomLayout2D
                  dimensions={roomData.dimensions}
                  shape={roomData.shape}
                  unit="m"
                  doorPosition={roomData.doorPosition}
                  corridor={roomData.corridor}
                  rows={roomData.rows}
                  columns={roomData.columns}
                  stackHeight={roomData.stackHeight}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-md font-semibold">Room Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Room Name</Label>
                  <p className="text-sm mt-1">{roomData.name}</p>
                </div>
                <div>
                  <Label>Room Type</Label>
                  <p className="text-sm mt-1">{roomData.type}</p>
                </div>
                <div>
                  <Label>Dimensions</Label>
                  <p className="text-sm mt-1">
                    {roomData.dimensions.length}m × {roomData.dimensions.width}m
                  </p>
                </div>
                <div>
                  <Label>Corridor</Label>
                  <p className="text-sm mt-1">
                    {roomData.corridor.wall} wall, {roomData.corridor.width}m wide
                  </p>
                </div>
                <div>
                  <Label>Storage Layout</Label>
                  <p className="text-sm mt-1">
                    {roomData.rows.count} rows, {roomData.columns.count} columns, {roomData.stackHeight} high
                  </p>
                </div>
                <div>
                  <Label>Storage Capacity</Label>
                  <p className="text-sm mt-1">
                    {roomData.rows.count * roomData.columns.count * roomData.stackHeight} boxes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Room" : "Create New Room"} - Step {step} of 4
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[600px] overflow-y-auto">{renderStepContent()}</CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
        </div>
        <div className="space-x-2">
          {initialData && (
            <Button
              variant="destructive"
              onClick={() => {
                // TODO: Implement delete confirmation and logic
                console.log("Delete room:", initialData.id)
                onClose()
              }}
            >
              Delete Room
            </Button>
          )}
          {step < 4 ? <Button onClick={handleNext}>Next</Button> : <Button onClick={handleSave}>Save Room</Button>}
        </div>
      </CardFooter>
    </Card>
  )
}

