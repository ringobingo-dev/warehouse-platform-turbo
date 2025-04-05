import type React from "react"

interface StepContainerProps {
  children: React.ReactNode
  currentStep?: number
}

export function StepContainer({ children, currentStep }: StepContainerProps) {
  // Check if we're in Step 4 based on the currentStep prop
  const isStep4 = currentStep === 4

  return <div className={`w-full ${isStep4 ? "full-width-container" : ""}`}>{children}</div>
}

