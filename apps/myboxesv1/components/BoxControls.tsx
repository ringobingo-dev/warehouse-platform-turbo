"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus, Sparkles, Square, RectangleVerticalIcon as Rectangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { AutocompleteInput } from "./AutocompleteInput"

const colorOptions = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#eab308" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Cyan", value: "#06b6d4" },
]

const gradeOptions = ["A", "B", "C", "Premium", "Standard", "Economy"]

// Mock customer data for demonstration
const customerSuggestions = [
  "Apple Orchards Inc.",
  "Berry Best Farms",
  "Citrus Grove Co.",
  "Delicious Fruits Ltd.",
  "Exotic Produce Suppliers",
  "Fresh Harvest Farms",
  "Green Valley Organics",
  "Harvest Moon Distributors",
  "Island Tropical Exports",
  "Juicy Fruits Co.",
  "Kiwi Farms International",
  "Lemon Tree Growers",
]

// Mock variety data for demonstration
const varietySuggestions = [
  "Ambrosia",
  "Braeburn",
  "Cortland",
  "Delicious Red",
  "Empire",
  "Fuji",
  "Gala",
  "Honeycrisp",
  "Idared",
  "Jonagold",
  "Macintosh",
  "Northern Spy",
  "Pink Lady",
  "Rome Beauty",
  "Spartan",
  "Winesap",
]

interface BoxControlsProps {
  mode: "add" | "remove"
  roomId: string
  onRefresh?: () => void
}

export function BoxControls({ mode, roomId, onRefresh }: BoxControlsProps) {
  const [customerName, setCustomerName] = useState("")
  const [varietyName, setVarietyName] = useState("")
  const [grade, setGrade] = useState("")
  const [loadingDate, setLoadingDate] = useState("")
  const [startingRow, setStartingRow] = useState(1)
  const [boxColor, setBoxColor] = useState("#3b82f6")
  const [numberOfBoxes, setNumberOfBoxes] = useState(1)
  const [stackHeight, setStackHeight] = useState(1)
  const [boxShape, setBoxShape] = useState("rectangle")

  const handleAction = () => {
    // Implementation for adding or removing boxes
    console.log(`${mode === "add" ? "Adding" : "Removing"} boxes with:`, {
      customerName,
      varietyName,
      grade,
      loadingDate,
      startingRow,
      boxColor,
      numberOfBoxes,
      stackHeight,
      boxShape,
      roomId,
    })

    if (onRefresh) {
      onRefresh()
    }
  }

  const handleIncludeMagic = () => {
    console.log("Including magic for boxes with:", {
      customerName,
      varietyName,
      grade,
      loadingDate,
      startingRow,
      boxColor,
      numberOfBoxes,
      stackHeight,
      boxShape,
      roomId,
    })

    // Add magic functionality here
    alert("Magic has been included! ✨")

    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        {/* New Row: Box Shape Selection */}
        <div className="border-b pb-4">
          <Label className="mb-2 block">Box Shape</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={boxShape === "rectangle" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setBoxShape("rectangle")}
            >
              <Rectangle className="mr-2 h-4 w-4" />
              Rectangle Boxes
            </Button>
            <Button
              type="button"
              variant={boxShape === "square" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setBoxShape("square")}
            >
              <Square className="mr-2 h-4 w-4" />
              Square Boxes
            </Button>
          </div>
        </div>

        {/* Row 1: Customer Name, Variety Name, Grade */}
        <div className="border-b pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customerName" className="mb-2">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <AutocompleteInput
                value={customerName}
                onChange={setCustomerName}
                onSelect={setCustomerName}
                suggestions={customerSuggestions}
                placeholder="Type to search customers"
                required
              />
            </div>

            <div>
              <Label htmlFor="varietyName" className="mb-2">
                Variety Name <span className="text-red-500">*</span>
              </Label>
              <AutocompleteInput
                value={varietyName}
                onChange={setVarietyName}
                onSelect={setVarietyName}
                suggestions={varietySuggestions}
                placeholder="Type to search varieties"
                required
              />
            </div>

            <div>
              <Label htmlFor="grade">
                Grade <span className="text-red-500">*</span>
              </Label>
              <Select value={grade} onValueChange={setGrade} required>
                <SelectTrigger id="grade" className="mt-2">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Row 2: Number of Boxes, Loading Date */}
        <div className="border-b pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numberOfBoxes" className="flex justify-between">
                <span>Number of Boxes</span>
                <span className="text-sm font-medium">{numberOfBoxes}</span>
              </Label>
              <Slider
                id="numberOfBoxes"
                min={1}
                max={100}
                step={1}
                value={[numberOfBoxes]}
                onValueChange={(value) => setNumberOfBoxes(value[0])}
                className="mt-4"
              />
            </div>

            <div>
              <Label htmlFor="loadingDate">
                Loading Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="loadingDate"
                type="date"
                value={loadingDate}
                onChange={(e) => setLoadingDate(e.target.value)}
                className="mt-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 3: Customer Box Color, Select Starting Row, Stack Height */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="boxColor">Customer Box Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={cn(
                      "h-8 w-8 rounded-full border border-gray-200",
                      boxColor === color.value && "ring-2 ring-offset-2 ring-black",
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setBoxColor(color.value)}
                    aria-label={`Select ${color.name} color`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="startingRow">Select Starting Row</Label>
              <Input
                id="startingRow"
                type="number"
                min={1}
                value={startingRow}
                onChange={(e) => setStartingRow(Number.parseInt(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="stackHeight" className="flex justify-between">
                <span>Stack Height</span>
                <span className="text-sm font-medium">{stackHeight}</span>
              </Label>
              <Slider
                id="stackHeight"
                min={1}
                max={10}
                step={1}
                value={[stackHeight]}
                onValueChange={(value) => setStackHeight(value[0])}
                className="mt-4"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={handleAction}>
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add {numberOfBoxes > 1 ? `${numberOfBoxes} Boxes` : "Box"}
              </>
            ) : (
              <>
                <Minus className="mr-2 h-4 w-4" />
                Remove {numberOfBoxes > 1 ? `${numberOfBoxes} Boxes` : "Box"}
              </>
            )}
          </Button>

          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleIncludeMagic}>
            <Sparkles className="mr-2 h-4 w-4" />
            Include Magic
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

