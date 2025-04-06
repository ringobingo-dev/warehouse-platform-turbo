"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useBoxContext } from "@/context/BoxContext"
import { customers, varieties, grades } from "@/app/mockData"
import { toast } from "@/components/ui/use-toast"

interface RemoveBoxesTabProps {
  onRefresh?: () => void
}

export function RemoveBoxesTab({ onRefresh }: RemoveBoxesTabProps) {
  const { boxes, removeBoxes, reapplyLastRemoved } = useBoxContext()
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedVariety, setSelectedVariety] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [boxCount, setBoxCount] = useState("1")
  const [selectedRow, setSelectedRow] = useState("")
  const [availableRows, setAvailableRows] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<{ customer: string; variety: string; grade: string } | null>(null)

  // Update available rows when selection changes
  useEffect(() => {
    if (selectedCustomer && selectedVariety && selectedGrade) {
      // Get the actual names from the mock data
      const customer = customers.find((c) => c.id.toString() === selectedCustomer)?.name
      const variety = varieties.find((v) => v.id.toString() === selectedVariety)?.name
      const grade = grades.find((g) => g.id.toString() === selectedGrade)?.name

      if (customer && variety && grade) {
        // Filter boxes based on selection using the actual names
        const filteredBoxes = boxes.filter(
          (box) => box.customerName === customer && box.varietyName === variety && box.grade === grade,
        )

        // Extract unique row numbers
        const rows = [...new Set(filteredBoxes.map((box) => box.row.toString()))].sort(
          (a, b) => Number.parseInt(a) - Number.parseInt(b),
        )

        setAvailableRows(rows)

        // Auto-select the first row if available
        if (rows.length > 0 && !rows.includes(selectedRow)) {
          setSelectedRow(rows[0])
        }
      }
    } else {
      setAvailableRows([])
      setSelectedRow("")
    }
  }, [selectedCustomer, selectedVariety, selectedGrade, boxes, selectedRow])

  const handleRemoveBoxes = () => {
    try {
      // Get the actual names from the mock data
      const customer = customers.find((c) => c.id.toString() === selectedCustomer)?.name
      const variety = varieties.find((v) => v.id.toString() === selectedVariety)?.name
      const grade = grades.find((g) => g.id.toString() === selectedGrade)?.name

      if (!customer || !variety || !grade) {
        throw new Error("Invalid selection data. Please check your selections.")
      }

      // Pass the selected values to the removeBoxes function
      removeBoxes(
        customer,
        variety,
        grade,
        Number.parseInt(boxCount),
        "rectangle", // You might want to make this selectable in the UI
        "#FF0000", // You might want to make this selectable in the UI
      )

      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error removing boxes:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove boxes",
        variant: "destructive",
      })
    }
  }

  const handleSelectGroup = (customer: string, variety: string, grade: string) => {
    if (customer && variety && grade) {
      const customerName = customers.find((c) => c.id.toString() === customer)?.name || ""
      const varietyName = varieties.find((v) => v.id.toString() === variety)?.name || ""
      const gradeName = grades.find((g) => g.id.toString() === grade)?.name || ""

      setSelectedGroup({
        customer: customerName,
        variety: varietyName,
        grade: gradeName,
      })
      setSelectedCustomer(customer)
      setSelectedVariety(variety)
      setSelectedGrade(grade)
    } else {
      setSelectedGroup(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Remove Boxes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedGroup && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-700 font-medium">Selected Group:</p>
              <p className="text-sm">
                Customer: <span className="font-medium">{selectedGroup.customer}</span> | Variety:{" "}
                <span className="font-medium">{selectedGroup.variety}</span> | Grade:{" "}
                <span className="font-medium">{selectedGroup.grade}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customerName" className="mb-2">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger id="customerName">
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
              <Label htmlFor="varietyName" className="mb-2">
                Variety Name <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedVariety} onValueChange={setSelectedVariety}>
                <SelectTrigger id="varietyName">
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
                <SelectTrigger id="grade">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="boxCount">Number of Boxes to Remove</Label>
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
              <Label htmlFor="rowSelect">Row Location</Label>
              <Select value={selectedRow} onValueChange={setSelectedRow} disabled={availableRows.length === 0}>
                <SelectTrigger id="rowSelect" className="mt-2">
                  <SelectValue placeholder="Select row" />
                </SelectTrigger>
                <SelectContent>
                  {availableRows.length > 0 ? (
                    availableRows.map((row) => (
                      <SelectItem key={row} value={row}>
                        Row {row}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No rows available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {availableRows.length === 0 && selectedCustomer && selectedVariety && selectedGrade && (
                <p className="text-sm text-muted-foreground mt-1">No boxes found for the selected criteria</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleRemoveBoxes}
            disabled={availableRows.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove {Number.parseInt(boxCount) > 1 ? `${boxCount} Boxes` : "Box"}
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              toast({
                title: "Feature Under Development",
                description: "The Remove Box Magic feature is currently under development.",
                duration: 3000,
              })
            }}
          >
            Remove Magic
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

