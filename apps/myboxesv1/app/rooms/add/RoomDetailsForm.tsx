"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoomDetailsFormProps {
  roomDetails: {
    name: string
    description: string
    category: string
  }
  onChange: (e: any) => void
  nextStep: () => void
}

const RoomDetailsForm: React.FC<RoomDetailsFormProps> = ({ roomDetails, onChange, nextStep }) => {
  return (
    <div className="w-full">
      {" "}
      {/* Changed from max-w-3xl mx-auto to w-full */}
      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input id="name" name="name" value={roomDetails.name} onChange={onChange} placeholder="Enter room name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={roomDetails.category}
              onValueChange={(value) => onChange({ target: { name: "category", value } })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="living">Living Room</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={roomDetails.description}
              onChange={onChange}
              placeholder="Enter room description"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoomDetailsForm

