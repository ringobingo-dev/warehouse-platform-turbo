"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StandardStepCard } from "@/components/add-room/standard-step-card"
import { StepSection } from "@/components/add-room/step-section"
import { RoomLayoutVisualization } from "@/components/room-layout-visualization"

interface Step2RoomLayoutProps {
  handleBack: () => void
  handleNext: () => void
  isValid: boolean
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

export function Step2RoomLayout({
  handleBack,
  handleNext,
  isValid,
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
}: Step2RoomLayoutProps) {
  return (
    <main className="p-4 flex-1 flex flex-col overflow-hidden w-full max-w-full">
      <StandardStepCard
        title="Room Layout"
        description="Configure the layout of your storage room"
        footer={
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!isValid}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        }
      >
        <div className="space-y-6 w-full">
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
          {/* Other content */}
        </div>
      </StandardStepCard>
    </main>
  )
}

