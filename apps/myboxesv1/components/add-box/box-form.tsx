"use client"
import { useState } from "react"
import type React from "react"

import { Input } from "@/components/shared/ui/input"
import { Label } from "@/components/shared/ui/label"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/select"

interface BoxFormProps {
  onSubmit: (data: BoxData) => void
  isLoading?: boolean
}

interface BoxData {
  name: string
  type: string
  width: number
  height: number
  depth: number
  maxWeight: number
  material: string
}

export function BoxForm({ onSubmit, isLoading = false }: BoxFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [depth, setDepth] = useState(0)
  const [maxWeight, setMaxWeight] = useState(0)
  const [material, setMaterial] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      type,
      width,
      height,
      depth,
      maxWeight,
      material,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Box</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Name */}
            <div className="space-y-2">
              <Label htmlFor="box-name">Box Name</Label>
              <Input
                id="box-name"
                placeholder="Enter box name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Box Type */}
            <div className="space-y-2">
              <Label htmlFor="box-type">Box Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="box-type">
                  <SelectValue placeholder="Select box type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="cold-storage">Cold Storage</SelectItem>
                  <SelectItem value="fragile">Fragile</SelectItem>
                  <SelectItem value="heavy-duty">Heavy Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Box Width */}
            <div className="space-y-2">
              <Label htmlFor="box-width">Width (cm)</Label>
              <Input
                id="box-width"
                type="number"
                min="1"
                step="0.1"
                placeholder="Width in cm"
                value={width || ""}
                onChange={(e) => setWidth(Number(e.target.value))}
                required
              />
            </div>

            {/* Box Height */}
            <div className="space-y-2">
              <Label htmlFor="box-height">Height (cm)</Label>
              <Input
                id="box-height"
                type="number"
                min="1"
                step="0.1"
                placeholder="Height in cm"
                value={height || ""}
                onChange={(e) => setHeight(Number(e.target.value))}
                required
              />
            </div>

            {/* Box Depth */}
            <div className="space-y-2">
              <Label htmlFor="box-depth">Depth (cm)</Label>
              <Input
                id="box-depth"
                type="number"
                min="1"
                step="0.1"
                placeholder="Depth in cm"
                value={depth || ""}
                onChange={(e) => setDepth(Number(e.target.value))}
                required
              />
            </div>

            {/* Max Weight */}
            <div className="space-y-2">
              <Label htmlFor="max-weight">Max Weight (kg)</Label>
              <Input
                id="max-weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="Maximum weight in kg"
                value={maxWeight || ""}
                onChange={(e) => setMaxWeight(Number(e.target.value))}
                required
              />
            </div>

            {/* Material */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="material">Material</Label>
              <Select value={material} onValueChange={setMaterial} required>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select box material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardboard">Cardboard</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Box"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

