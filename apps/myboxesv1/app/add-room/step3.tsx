"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { RoomLayoutPreview } from "@/components/room-layout-preview"
import { createRoomDataObject } from "@/lib/storage-utils"

export default function Step3({ roomData, onSave }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Save to localStorage for backward compatibility
      const savedRooms = JSON.parse(localStorage.getItem("rooms") || "{}")
      const roomId = `room-${Date.now()}`
      savedRooms[roomId] = roomData
      localStorage.setItem("rooms", JSON.stringify(savedRooms))

      // Prepare data for S3 storage
      const roomDataForStorage = prepareRoomDataForStorage(roomData, roomId)

      // Save to S3 via API
      const response = await fetch("/api/storage/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomDataForStorage),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save room data to storage")
      }

      toast({
        title: "Room saved successfully",
        description: "Your room has been saved to storage and is ready to use.",
      })

      // Navigate to dimensions page
      router.push("/dimensions")
    } catch (error) {
      console.error("Error saving room:", error)
      toast({
        title: "Error saving room",
        description: error.message || "There was a problem saving your room to storage.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Function to prepare room data for S3 storage
  const prepareRoomDataForStorage = (data, id) => {
    // Map the room data to the format expected by the storage API
    const baseData = {
      id,
      roomName: data.name,
      roomCategory: data.category || "Standard",
      roomType: data.type,
      roomShape: data.shape,
      description: data.description || `${data.name} - ${data.type}`,
      tags: data.tags || ["storage", data.type.toLowerCase()],
      status: "active",
    }

    // Add split-side specific properties if applicable
    if (data.shape === "Split Side") {
      baseData.leftSideLength = data.eastSide.length
      baseData.leftSideWidth = data.eastSide.width
      baseData.rightSideLength = data.westSide.length
      baseData.rightSideWidth = data.westSide.width
      baseData.leftSideName = "East Side"
      baseData.rightSideName = "West Side"

      // Add storage configuration
      baseData.storageConfig = {
        leftSide: {
          rows: data.eastSide.rows,
          columns: data.eastSide.columns,
          levels: data.eastSide.stackHeight,
        },
        rightSide: {
          rows: data.westSide.rows,
          columns: data.westSide.columns,
          levels: data.westSide.stackHeight,
        },
      }
    } else {
      // Standard room properties
      baseData.length = data.length
      baseData.width = data.width
      baseData.rows = data.rows
      baseData.columns = data.columns
      baseData.levels = data.stackHeight
    }

    // Add door and corridor configuration
    baseData.doorConfig = {
      position: data.door?.position || "None",
      width: data.door?.width || 1,
    }

    baseData.corridorConfig = {
      position: data.corridor?.position || "None",
      width: data.corridor?.width || 1,
    }

    // Create the final data object for 2D storage
    return createRoomDataObject(baseData, "2d")
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Step 3: Preview and Confirm</h2>
        <p className="text-muted-foreground">Review your room configuration before saving</p>
      </div>

      {/* Blue info box - matches Step 2 styling */}
      <div className="w-full bg-blue-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-blue-700">Room Layout Configuration</h3>
        <p className="text-blue-600">
          Review your room configuration before saving. The grid shows row and column numbering.
        </p>
      </div>

      {/* Room summary - matches Step 2 styling */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Room Name</h4>
          <p className="font-medium">{roomData.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Room Type</h4>
          <div className="flex items-center">
            <span className="inline-block w-5 h-5 mr-2">🧊</span>
            <p className="font-medium">{roomData.type}</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Room Shape</h4>
          <p className="font-medium">{roomData.shape}</p>
        </div>
      </div>

      {/* Layout Editor section - matches Step 2 styling */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Layout Editor</h3>
        <div className="border rounded-md p-4 w-full">
          <RoomLayoutPreview roomData={roomData} className="w-full" />
        </div>
      </div>

      {/* Dimensions section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dimensions</h3>
        <div className="border rounded-md p-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            {roomData.shape === "Split Side" ? (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">East Side</h4>
                  <p>
                    Length: {roomData.eastSide.length}m × Width: {roomData.eastSide.width}m
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">West Side</h4>
                  <p>
                    Length: {roomData.westSide.length}m × Width: {roomData.westSide.width}m
                  </p>
                </div>
              </>
            ) : (
              <div>
                <p>
                  Length: {roomData.length}m × Width: {roomData.width}m
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuration</h3>
        <div className="border rounded-md p-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Corridor</h4>
              <p>{roomData.corridor?.position || "None"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Door</h4>
              <p>{roomData.door?.position || "None"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Storage configuration section */}
      {roomData.shape === "Split Side" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Storage Configuration</h3>
          <div className="border rounded-md p-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">East Side</h4>
                <p>
                  Rows: {roomData.eastSide.rows}, Columns: {roomData.eastSide.columns}, Stack Height:{" "}
                  {roomData.eastSide.stackHeight}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">West Side</h4>
                <p>
                  Rows: {roomData.westSide.rows}, Columns: {roomData.westSide.columns}, Stack Height:{" "}
                  {roomData.westSide.stackHeight}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
          Back
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Room"}
        </Button>
      </div>
    </div>
  )
}

