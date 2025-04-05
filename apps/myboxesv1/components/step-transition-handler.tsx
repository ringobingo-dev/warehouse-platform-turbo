"use client"

import type React from "react"

import { useEffect } from "react"

interface StepTransitionHandlerProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  targetStep: number
  triggerTransition: boolean
  onTransitionComplete?: () => void
}

export const StepTransitionHandler: React.FC<StepTransitionHandlerProps> = ({
  currentStep,
  setCurrentStep,
  targetStep,
  triggerTransition,
  onTransitionComplete,
}) => {
  useEffect(() => {
    if (triggerTransition) {
      // Only transition when explicitly triggered by a button press
      setCurrentStep(targetStep)

      if (onTransitionComplete) {
        onTransitionComplete()
      }
    }
  }, [triggerTransition, targetStep, setCurrentStep, onTransitionComplete])

  return null // This is a utility component with no UI
}

// Also export as default for backward compatibility
export default StepTransitionHandler

