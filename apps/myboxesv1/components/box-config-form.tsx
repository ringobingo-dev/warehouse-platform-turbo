"use client"

import type React from "react"

import { useState } from "react"
// Updated import to use shared Button component
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// moved to shared folder for reuse and NX prep

interface BoxConfigFormProps {
  onSubmit: (boxData: any) => void
  initialData?: any
  isLoading?: boolean
}

export function BoxConfigForm({ onSubmit, initialData = {}, isLoading = false }: BoxConfigFormProps) {
  const { toast } = useToast()
  const [boxData, setBoxData] = useState({
    name: initialData.name || "",
    width: initialData.width || 1,
    height: initialData.height || 1,
    depth: initialData.depth || 1,
    customer: initialData.customer || "",
    variety: initialData.variety || "",
    grade: initialData.grade || "",
    ...initialData,
  })

  const handleChange = (field: string, value: any) => {
    setBoxData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!boxData.name) {
      toast({
        title: "Validation Error",
        description: "Box name is required",
        variant: "destructive",
      })
      return
    }

    // Validate dimensions
    if (boxData.width <= 0 || boxData.height <= 0 || boxData.depth <= 0) {
      toast({
        title: "Validation Error",
        description: "All dimensions must be greater than zero",
        variant: "destructive",
      })
      return
    }

    onSubmit(boxData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData.id ? "Edit" : "Add"} Box</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="box-name">Box Name</Label>
            <Input
              id="box-name"
              value={boxData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter box name"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="box-width">Width (m)</Label>
              <Input
                id="box-width"
                type="number"
                value={boxData.width}
                onChange={(e) => handleChange("width", Number(e.target.value))}
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box-height">Height (m)</Label>
              <Input
                id="box-height"
                type="number"
                value={boxData.height}
                onChange={(e) => handleChange("height", Number(e.target.value))}
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box-depth">Depth (m)</Label>
              <Input
                id="box-depth"
                type="number"
                value={boxData.depth}
                onChange={(e) => handleChange("depth", Number(e.target.value))}
                min="0.1"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="box-customer">Customer</Label>
            <Select value={boxData.customer} onValueChange={(value) => handleChange("customer", value)}>
              <SelectTrigger id="box-customer">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer-a">Customer A</SelectItem>
                <SelectItem value="customer-b">Customer B</SelectItem>
                <SelectItem value="customer-c">Customer C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="box-variety">Variety</Label>
              <Select value={boxData.variety} onValueChange={(value) => handleChange("variety", value)}>
                <SelectTrigger id="box-variety">
                  <SelectValue placeholder="Select variety" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="variety-a">Variety A</SelectItem>
                  <SelectItem value="variety-b">Variety B</SelectItem>
                  <SelectItem value="variety-c">Variety C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="box-grade">Grade</Label>
              <Select value={boxData.grade} onValueChange={(value) => handleChange("grade", value)}>
                <SelectTrigger id="box-grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-a">Grade A</SelectItem>
                  <SelectItem value="grade-b">Grade B</SelectItem>
                  <SelectItem value="grade-c">Grade C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onSubmit(null)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {initialData.id ? "Update" : "Add"} Box
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

