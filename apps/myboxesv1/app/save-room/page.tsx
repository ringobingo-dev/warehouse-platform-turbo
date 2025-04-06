"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Warehouse, Building2, Thermometer, ArrowLeft, Save, Tag, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function SaveRoomPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Room details (from previous steps, would be passed via context or state in a real app)
  const [roomName, setRoomName] = useState("Cold Storage Room 1")
  const [roomCategory, setRoomCategory] = useState("potatoes")
  const [roomType, setRoomType] = useState("cold-storage")
  const [roomShape, setRoomShape] = useState("rectangle")
  const [length, setLength] = useState<number>(20)
  const [width, setWidth] = useState<number>(15)

  // Save room specific fields
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [status, setStatus] = useState("active")
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // For tag input and display
  const [tagInput, setTagInput] = useState("")
  const [tagList, setTagList] = useState<string[]>([])

  // Storage capacity calculations
  const rows = 10
  const columns = 8
  const stackHeight = 4
  const totalPositions = rows * columns
  const floorArea = length * width
  const maxStackHeight = stackHeight

  const handleAddTag = () => {
    if (tagInput.trim() && !tagList.includes(tagInput.trim())) {
      setTagList([...tagList, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSaveRoom = async () => {
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!description.trim()) {
        throw new Error("Room description is required")
      }

      // In a real app, this would save to your database
      console.log("Saving room with details:", {
        roomName,
        roomCategory,
        roomType,
        roomShape,
        length,
        width,
        description,
        tags: tagList,
        status,
        saveAsTemplate,
      })

      // Show success message
      toast({
        title: "Room Saved",
        description: `${roomName} has been saved successfully.`,
        duration: 3000,
      })

      // Navigate to the dimensions page to view the new room
      setTimeout(() => {
        router.push("/dimensions")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save room",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoomTypeIcon = () => {
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

  // Get room shape display text
  const getRoomShapeText = () => {
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Save Room</h1>

      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle>Room Configuration</CardTitle>
          <CardDescription>Add additional information about your room before saving</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 w-full">
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-primary">Room Configuration</h3>
              <p className="text-sm text-muted-foreground">Add additional information about your room before saving</p>
            </div>

            {/* Room Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Room Name</h4>
                <p className="font-medium">{roomName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Room Type</h4>
                <div className="flex items-center gap-2">
                  {getRoomTypeIcon()}
                  <p className="font-medium">
                    {roomType === "cold-storage"
                      ? "Cold Storage"
                      : roomType === "dry-storage"
                        ? "Dry Storage"
                        : "Climate Controlled"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Room Shape</h4>
                <p className="font-medium">{getRoomShapeText()}</p>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border rounded-lg">
              <h3 className="text-lg font-semibold p-4 border-b">Additional Information</h3>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-description" className="text-base">
                    Room Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="room-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Enter a detailed description of this room..."
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide any additional details about this room that might be helpful
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="room-tags" className="text-base">
                    Room Tags
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="room-tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter a tag and press Enter"
                      className="h-12 flex-1"
                    />
                    <Button type="button" onClick={handleAddTag} className="h-12">
                      <Tag className="h-4 w-4 mr-2" /> Add Tag
                    </Button>
                  </div>
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tagList.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">Tags help with searching and filtering rooms</p>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="room-status" className="text-base">
                    Room Status
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="room-status" className="h-12">
                      <SelectValue placeholder="Select room status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Set the current operational status of this room</p>
                </div>

                <div className="pt-4 border-t mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-template"
                      checked={saveAsTemplate}
                      onCheckedChange={(checked) => setSaveAsTemplate(checked as boolean)}
                    />
                    <Label htmlFor="save-template" className="text-base">
                      Save as Template
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Save this configuration as a template for future rooms
                  </p>
                </div>
              </div>
            </div>

            {/* Storage Capacity Section */}
            <div className="border rounded-lg">
              <h3 className="text-lg font-semibold p-4 border-b">Storage Capacity</h3>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground">Total Storage Positions</span>
                  <p className="text-2xl font-bold mt-2">{totalPositions}</p>
                </div>

                <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground">Floor Area</span>
                  <p className="text-2xl font-bold mt-2">{floorArea} m²</p>
                </div>

                <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground">Max Stack Height</span>
                  <p className="text-2xl font-bold mt-2">{maxStackHeight} levels</p>
                </div>
              </div>
            </div>

            {/* Documentation Section */}
            <div className="border rounded-lg">
              <h3 className="text-lg font-semibold p-4 border-b">Documentation</h3>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/10">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Room Layout Diagram</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate PDF
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/10">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Storage Capacity Report</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Confirmation Checklist */}
            <div className="border rounded-lg">
              <h3 className="text-lg font-semibold p-4 border-b">Confirmation Checklist</h3>
              <div className="p-4 space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="confirm-dimensions" />
                  <div>
                    <Label htmlFor="confirm-dimensions" className="text-base">
                      I confirm the room dimensions are correct
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Length: {length}m, Width: {width}m
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="confirm-layout" />
                  <div>
                    <Label htmlFor="confirm-layout" className="text-base">
                      I confirm the storage layout is correct
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {rows} rows × {columns} columns × {stackHeight} levels
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="confirm-access" />
                  <div>
                    <Label htmlFor="confirm-access" className="text-base">
                      I confirm the access configuration is correct
                    </Label>
                    <p className="text-sm text-muted-foreground">Door and corridor placement have been verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Layout
          </Button>
          <Button type="button" onClick={handleSaveRoom} size="lg" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> {isSubmitting ? "Saving..." : "Save Room"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

