"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Check, ChevronLeft } from "lucide-react"
import { StandardStepCard } from "@/components/add-room/standard-step-card"

interface Step4PreviewProps {
  handleBack: () => void
  handleFinish: () => void
  isValid: boolean
  isSaving?: boolean
  boxCount?: number
}

const Step4Preview: React.FC<Step4PreviewProps> = ({
  handleBack,
  handleFinish,
  isValid,
  isSaving = false,
  boxCount = 0,
}) => {
  return (
    <StandardStepCard
      title="Preview"
      description="Preview your storage room before finalizing"
      footer={
        <div className="w-full flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={isSaving}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleFinish} disabled={!isValid || isSaving}>
            {isSaving ? "Saving..." : "Finish"}
            {!isSaving && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 w-full">
        {/* Only display box count if it's greater than 0 */}
        {boxCount > 0 && <p>Box Count: {boxCount}</p>}
        {/* Existing content */}
      </div>
    </StandardStepCard>
  )
}

export default Step4Preview

