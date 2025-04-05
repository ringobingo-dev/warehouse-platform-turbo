"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StandardStepCard } from "@/components/add-room/standard-step-card"
import { Save, ChevronLeft } from "lucide-react"
import { StepSection } from "@/components/add-room/step-section"
import { RoomLayoutVisualization } from "@/components/room-layout-visualization"

interface Step3SaveRoomProps {
  handleBack: () => void
  handleSave: () => void
  isValid: boolean
  roomSaveFormRef?: React.RefObject<{
    handleSave: () => Promise<void>
  }>
  roomData?: {
    roomShape: string
    length: number
    width: number
    doorConfig: {
      wall: string
      offset: number
      width: number
    }
    corridorConfig: {
      wall: string
      width: number
    }
    storageConfig: {
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
}

const Step3SaveRoom: React.FC<Step3SaveRoomProps> = ({
  handleBack,
  handleSave,
  isValid,
  roomSaveFormRef,
  roomData = {
    roomShape: "rectangle",
    length: 10,
    width: 8,
    doorConfig: {
      wall: "front",
      offset: 50,
      width: 1,
    },
    corridorConfig: {
      wall: "front",
      width: 1.5,
    },
    storageConfig: {
      rows: {
        count: 3,
        startWall: "back",
      },
      columns: {
        count: 4,
      },
      stackHeight: 3,
    },
  },
}) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveClick = async () => {
    if (!isValid) return

    setIsSaving(true)
    try {
      // First call the room-save-form's handleSave function if available
      if (roomSaveFormRef?.current) {
        await roomSaveFormRef.current.handleSave()
      }

      // Then call this component's handleSave function
      await handleSave()
    } catch (error) {
      console.error("Error saving room:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="p-4 flex-1 flex flex-col overflow-hidden w-full max-w-full">
      <StandardStepCard
        title="Save Room"
        description="Review and save your storage room configuration"
        footer={
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={isSaving}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleSaveClick} disabled={!isValid || isSaving}>
              {isSaving ? "Saving..." : "Finalize 3D Room"}
              {!isSaving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <StepSection title="Room Layout Visualization" visualizationMode={true}>
            <RoomLayoutVisualization
              roomShape={roomData.roomShape}
              length={roomData.length}
              width={roomData.width}
              doorConfig={roomData.doorConfig}
              corridorConfig={roomData.corridorConfig}
              storageConfig={roomData.storageConfig}
            />
          </StepSection>
          {/* Room configuration summary content */}
          <p>Review your room configuration before saving.</p>
        </div>
      </StandardStepCard>
    </main>
  )
}

export default Step3SaveRoom

