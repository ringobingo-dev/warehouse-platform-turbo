"use client"

import type React from "react"

import { useState, useImperativeHandle, forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoomLayoutEditor } from "@/components/room-layout-editor"
import { StepSection } from "./step-section"

interface DoorConfig {
  wall: "front" | "back" | "left" | "right"
  offset: number
  width: number
}

interface CorridorConfig {
  wall: "front" | "back" | "left" | "right"
  width: number
}

interface StorageConfig {
  rows: {
    count: number
    startWall: "front" | "back"
  }
  columns: {
    count: number
  }
  stackHeight: number
  leftSide?: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  rightSide?: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
}

interface RoomSaveFormProps {
  roomShape: string
  length: number
  width: number
  doorConfig: DoorConfig
  corridorConfig: CorridorConfig
  storageConfig: StorageConfig
  leftSideLength: number
  leftSideWidth: number
  rightSideLength: number
  rightSideWidth: number
  leftSideName: string
  rightSideName: string
  leftSideConfigured: boolean
  rightSideConfigured: boolean
  roomDescription: string
  setRoomDescription: (value: string) => void
  roomStatus: string
  setRoomStatus: (value: string) => void
  calculateFloorArea: () => number
  calculateTotalPositions: () => number
  getMaxStackHeight: () => number
  onSave: () => void
  isValid?: boolean
  ref?: React.Ref<{
    handleSave: () => Promise<void>
  }>
}

export const RoomSaveForm = forwardRef<{ handleSave: () => Promise<void> }, RoomSaveFormProps>(
  (
    {
      roomShape,
      length,
      width,
      doorConfig,
      corridorConfig,
      storageConfig,
      leftSideLength,
      leftSideWidth,
      rightSideLength,
      rightSideWidth,
      leftSideName,
      rightSideName,
      leftSideConfigured,
      rightSideConfigured,
      roomDescription,
      setRoomDescription,
      roomStatus,
      setRoomStatus,
      calculateFloorArea,
      calculateTotalPositions,
      getMaxStackHeight,
      onSave,
      isValid = true,
    },
    ref,
  ) => {
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
      if (!isValid) return

      setIsSaving(true)
      try {
        await onSave()
      } catch (error) {
        console.error("Error saving room:", error)
      } finally {
        setIsSaving(false)
      }
    }

    // Expose the handleSave method to parent components
    useImperativeHandle(ref, () => ({
      handleSave,
    }))

    return (
      <div className="w-full max-w-none full-width-container">
        {/* Layout Editor */}
        <StepSection title="Room Layout">
          <div className="w-full">
            <RoomLayoutEditor
              roomShape={roomShape}
              length={length}
              width={width}
              doorConfig={doorConfig}
              corridorConfig={corridorConfig}
              storageConfig={storageConfig}
              leftSideLength={leftSideLength}
              leftSideWidth={leftSideWidth}
              rightSideLength={rightSideLength}
              rightSideWidth={rightSideWidth}
              leftSideName={leftSideName}
              rightSideName={rightSideName}
              leftSideConfigured={leftSideConfigured}
              rightSideConfigured={rightSideConfigured}
            />
          </div>
        </StepSection>

        {/* Room Information */}
        <StepSection title="Room Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Room Description */}
            <div className="space-y-2 w-full">
              <Label htmlFor="room-description" className="text-base">
                Room Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="room-description"
                className="min-h-[100px] w-full"
                placeholder="Enter a detailed description of this room..."
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Provide any additional details about this room that might be helpful
              </p>
            </div>

            {/* Room Status */}
            <div className="space-y-2 w-full">
              <Label htmlFor="room-status" className="text-base">
                Room Status
              </Label>
              <Select value={roomStatus} onValueChange={setRoomStatus}>
                <SelectTrigger id="room-status" className="h-12 w-full">
                  <SelectValue placeholder="Select room status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Set the current operational status of this room</p>
            </div>
          </div>
        </StepSection>

        {/* Storage Capacity Section */}
        <StepSection title="Storage Capacity">
          {roomShape === "split-side" ? (
            <>
              {/* Split-side room capacity display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
                {/* Left Side (EAST) Capacity */}
                <div className="border rounded-lg p-4 bg-muted/10 w-full">
                  <h5 className="font-medium text-base border-b pb-2 mb-4">{leftSideName} Side Capacity</h5>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="border rounded-lg p-3 w-full">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Storage Positions</span>
                        <p className="text-xl font-bold mt-1">
                          {storageConfig.leftSide?.rows.count! * storageConfig.leftSide?.columns.count!}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {storageConfig.leftSide?.rows.count} rows × {storageConfig.leftSide?.columns.count} columns
                        </p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 w-full">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Floor Area</span>
                        <p className="text-xl font-bold mt-1">{leftSideLength * leftSideWidth} m²</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {leftSideLength}m × {leftSideWidth}m
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border rounded-lg p-3 w-full">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total Volume Capacity</span>
                      <p className="text-xl font-bold mt-1">
                        {storageConfig.leftSide?.rows.count! *
                          storageConfig.leftSide?.columns.count! *
                          storageConfig.leftSide?.stackHeight!}{" "}
                        positions
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        With {storageConfig.leftSide?.stackHeight} levels stacking height
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side (WEST) Capacity */}
                <div className="border rounded-lg p-4 bg-muted/10 w-full">
                  <h5 className="font-medium text-base border-b pb-2 mb-4">{rightSideName} Side Capacity</h5>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="border rounded-lg p-3 w-full">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Storage Positions</span>
                        <p className="text-xl font-bold mt-1">
                          {storageConfig.rightSide?.rows.count! * storageConfig.rightSide?.columns.count!}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {storageConfig.rightSide?.rows.count} rows × {storageConfig.rightSide?.columns.count} columns
                        </p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 w-full">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Floor Area</span>
                        <p className="text-xl font-bold mt-1">{rightSideLength * rightSideWidth} m²</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {rightSideLength}m × {rightSideWidth}m
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border rounded-lg p-3 w-full">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total Volume Capacity</span>
                      <p className="text-xl font-bold mt-1">
                        {storageConfig.rightSide?.rows.count! *
                          storageConfig.rightSide?.columns.count! *
                          storageConfig.rightSide?.stackHeight!}{" "}
                        positions
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        With {storageConfig.rightSide?.stackHeight} levels stacking height
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Combined Capacity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="border rounded-lg p-4 w-full">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Total Storage Positions</span>
                    <p className="text-2xl font-bold mt-2">{calculateTotalPositions()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Combined floor positions across both sides</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 w-full">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Total Floor Area</span>
                    <p className="text-2xl font-bold mt-2">{calculateFloorArea()} m²</p>
                    <p className="text-xs text-muted-foreground mt-1">Combined usable floor space</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 w-full">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Total Volume Capacity</span>
                    <p className="text-2xl font-bold mt-2">
                      {storageConfig.leftSide?.rows.count! *
                        storageConfig.leftSide?.columns.count! *
                        storageConfig.leftSide?.stackHeight! +
                        storageConfig.rightSide?.rows.count! *
                          storageConfig.rightSide?.columns.count! *
                          storageConfig.rightSide?.stackHeight!}{" "}
                      positions
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Total 3D storage capacity</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Original layout for non-split-side rooms
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="border rounded-lg p-4 w-full">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Storage Positions</span>
                  <p className="text-2xl font-bold mt-2">{calculateTotalPositions()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on configured rows and columns</p>
                </div>
              </div>

              <div className="border rounded-lg p-4 w-full">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Floor Area</span>
                  <p className="text-2xl font-bold mt-2">{calculateFloorArea()} m²</p>
                  <p className="text-xs text-muted-foreground mt-1">Total usable floor space</p>
                </div>
              </div>

              <div className="border rounded-lg p-4 w-full">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Max Stack Height</span>
                  <p className="text-2xl font-bold mt-2">{getMaxStackHeight()} levels</p>
                  <p className="text-xs text-muted-foreground mt-1">Maximum vertical storage capacity</p>
                </div>
              </div>
            </div>
          )}
        </StepSection>

        {/* Removed the redundant "Save Room Configuration" button */}
      </div>
    )
  },
)

RoomSaveForm.displayName = "RoomSaveForm"

