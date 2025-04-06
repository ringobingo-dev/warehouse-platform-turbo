"use client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Square, RectangleVertical } from "lucide-react"
import { useBoxContext } from "@/context/BoxContext"
import { customers, varieties, grades } from "@/app/mockData"
import { toast } from "@/components/ui/use-toast"

interface AddBoxesTabProps {
  onRefresh?: () => void
}

export function AddBoxesTab({ onRefresh }: AddBoxesTabProps) {
  const {
    addBoxes,
    boxSize,
    setBoxSize,
    selectedCustomer,
    setSelectedCustomer,
    selectedVariety,
    setSelectedVariety,
    selectedGrade,
    setSelectedGrade,
    boxCount,
    setBoxCount,
    selectedRow,
    setSelectedRow,
    availableRows,
    loadingDate,
    setLoadingDate,
    customerBoxColor,
    setCustomerBoxColor,
  } = useBoxContext()

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

  const handleAddBoxes = async () => {
    try {
      // Get the actual customer, variety, and grade names from the selected IDs
      const selectedCustomerName = customers.find((c) => c.id.toString() === selectedCustomer)?.name || ""
      const selectedVarietyName = varieties.find((v) => v.id.toString() === selectedVariety)?.name || ""
      const selectedGradeName = grades.find((g) => g.id.toString() === selectedGrade)?.name || ""

      console.log("Adding boxes with data:", {
        customerName: selectedCustomerName,
        varietyName: selectedVarietyName,
        gradeName: selectedGradeName,
        boxCount,
        loadingDate,
        customerBoxColor,
      })

      await addBoxes(selectedCustomerName, selectedVarietyName, selectedGradeName)

      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error adding boxes:", error)
      toast({
        title: "Error",
        description: "Failed to add boxes. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Boxes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Box Shape Selection */}
        <div className="border-b pb-4">
          <Label className="mb-2 block">Box Shape</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={boxSize === "rectangle" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setBoxSize("rectangle")}
            >
              <RectangleVertical className="mr-2 h-4 w-4" />
              Rectangle Boxes
            </Button>
            <Button
              type="button"
              variant={boxSize === "square" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setBoxSize("square")}
            >
              <Square className="mr-2 h-4 w-4" />
              Square Boxes
            </Button>
          </div>
        </div>

        {/* Customer, Variety, Grade */}
        <div className="border-b pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customerName">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger id="customerName" className="mt-2">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="varietyName">
                Variety Name <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedVariety} onValueChange={setSelectedVariety}>
                <SelectTrigger id="varietyName" className="mt-2">
                  <SelectValue placeholder="Select variety" />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety.id} value={variety.id.toString()}>
                      {variety.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grade">
                Grade <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger id="grade" className="mt-2">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id.toString()}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Box Count and Loading Date */}
        <div className="border-b pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="boxCount">
                Number of Boxes <span className="text-red-500">*</span>
              </Label>
              <Input
                id="boxCount"
                type="number"
                min="1"
                value={boxCount}
                onChange={(e) => setBoxCount(e.target.value)}
                className="mt-2"
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
              />
            </div>
          </div>
        </div>

        {/* Starting Row and Box Color */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startingRow">
                Starting Row <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedRow || ""} onValueChange={setSelectedRow}>
                <SelectTrigger id="startingRow" className="mt-2">
                  <SelectValue placeholder="Select starting row" />
                </SelectTrigger>
                <SelectContent>
                  {availableRows.map((row) => (
                    <SelectItem key={row} value={row.toString()}>
                      Row {row}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="boxColor">Customer Box Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full border border-gray-200 ${
                      customerBoxColor === color.value ? "ring-2 ring-offset-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setCustomerBoxColor(color.value)}
                    aria-label={`Select ${color.name} color`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button className="flex-1" onClick={handleAddBoxes}>
          <Plus className="mr-2 h-4 w-4" />
          Add {Number.parseInt(boxCount) > 1 ? `${boxCount} Boxes` : "Box"}
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            toast({
              title: "Feature Under Development",
              description: "The Add Box Magic feature is currently under development.",
              duration: 3000,
            })
          }}
        >
          Add Box Magic
        </Button>
      </CardFooter>
    </Card>
  )
}

