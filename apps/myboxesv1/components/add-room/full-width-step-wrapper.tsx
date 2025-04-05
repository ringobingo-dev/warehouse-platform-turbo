import type React from "react"

interface FullWidthStepWrapperProps {
  children: React.ReactNode
}

export function FullWidthStepWrapper({ children }: FullWidthStepWrapperProps) {
  return <div className="w-full max-w-none">{children}</div>
}

