"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoomFeaturesFormProps {
  roomFeatures: {
    windows: number
    doors: number
    colorPalette: string
  }
  onChange: (e: any) => void
  prevStep: () => void
}

const RoomFeaturesForm: React.FC<RoomFeaturesFormProps> = ({ roomFeatures, onChange, prevStep }) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    onChange({ target: { name: e.target.name, value } })
  }

  const handleSelectChange = (value: string) => {
    onChange({ target: { name: "colorPalette", value } })
  }

  return (
    <div className="w-full">
      {" "}
      {/* Changed from max-w-3xl mx-auto to w-full */}
      <Card>
        <CardHeader>
          <CardTitle>Room Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windows">Number of Windows</Label>
              <Input
                id="windows"
                name="windows"
                type="number"
                min="0"
                value={roomFeatures.windows}
                onChange={handleNumberChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doors">Number of Doors</Label>
              <Input
                id="doors"
                name="doors"
                type="number"
                min="1"
                value={roomFeatures.doors}
                onChange={handleNumberChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="colorPalette">Color Palette</Label>
            <Select value={roomFeatures.colorPalette} onValueChange={handleSelectChange}>
              <SelectTrigger id="colorPalette">
                <SelectValue placeholder="Select a color palette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cool">Cool</SelectItem>
                <SelectItem value="vibrant">Vibrant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoomFeaturesForm

