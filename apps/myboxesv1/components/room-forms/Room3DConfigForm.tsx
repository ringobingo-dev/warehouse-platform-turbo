"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import BoxViewer from "../box-viewer"
import { Textarea } from "@/components/ui/textarea"
import { debounce } from "lodash"

interface Room3DConfigFormProps {
  onSave: () => void
  roomData: any
  onRoomDataChange: (data: any) => void
  boxCount?: number | null | { count: number } // Updated to handle different types
  isSaving?: boolean
}

const Room3DConfigForm: React.FC<Room3DConfigFormProps> = ({
  onSave,
  roomData,
  onRoomDataChange,
  boxCount = 0, // Default to 0
  isSaving = false,
}) => {
  // Local state for description
  const [description, setDescription] = useState(roomData.description || "")

  // Normalize boxCount to ensure it's always a number
  const normalizedBoxCount =
    typeof boxCount === "object" && boxCount !== null
      ? boxCount.count || 0 // Extract count if it's an object
      : typeof boxCount === "number"
        ? boxCount
        : 0 // Use the number or default to 0

  // Create a debounced update function that only triggers after typing stops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((newDescription: string) => {
      onRoomDataChange({
        ...roomData,
        description: newDescription,
      })
    }, 500),
    [roomData, onRoomDataChange],
  )

  // Handle description changes without immediately updating parent state
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setDescription(newValue)
    debouncedUpdate(newValue)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BoxViewer
            roomData={roomData}
            boxCount={normalizedBoxCount}
            // other props
          />
        </div>
        <div className="space-y-6">
          {/* Room Description input with fixed height container */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Room Description
            </label>
            <div className="min-h-[120px]">
              <Textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="min-h-[100px] w-full"
              />
            </div>
          </div>

          {/* Other configuration controls */}
          <div className="space-y-4">{/* Various controls */}</div>

          {/* Save 3D Room button in a fixed height container */}
          <div className="h-[50px]">
            <Button onClick={onSave} className="w-full" size="lg" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save 3D Room"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Room3DConfigForm

