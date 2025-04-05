"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RoomDimensionsFormProps {
  roomDimensions: {
    length: number
    width: number
    height: number
  }
  onChange: (e: any) => void
  prevStep: () => void
  nextStep: () => void
}

const RoomDimensionsForm: React.FC<RoomDimensionsFormProps> = ({ roomDimensions, onChange, prevStep, nextStep }) => {
  return (
    <div className="w-full">
      {" "}
      {/* Changed from max-w-3xl mx-auto to w-full */}
      <Card>
        <CardHeader>
          <CardTitle>Room Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (m)</Label>
              <Input
                id="length"
                name="length"
                type="number"
                min="0"
                step="0.1"
                value={roomDimensions.length}
                onChange={onChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (m)</Label>
              <Input
                id="width"
                name="width"
                type="number"
                min="0"
                step="0.1"
                value={roomDimensions.width}
                onChange={onChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (m)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                min="0"
                step="0.1"
                value={roomDimensions.height}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="pt-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm text-gray-700">
                Total Volume: {(roomDimensions.length * roomDimensions.width * roomDimensions.height).toFixed(2)} m³
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoomDimensionsForm

