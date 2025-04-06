"use client"

import type React from "react"
import { memo } from "react"
import { Button } from "@/components/ui/button"

interface SaveButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  children?: React.ReactNode
  boxCount?: number | null | { count: number } // Added to handle different types
}

// If this component exists, we should memoize it
const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  children,
  boxCount, // We don't use this directly, but it might be passed as a prop
}) => {
  // We don't render boxCount directly, so no normalization needed here
  return (
    <Button onClick={onClick} className="w-full" size="lg" disabled={disabled || isLoading}>
      {isLoading ? "Saving..." : children || "Save"}
    </Button>
  )
}

// Export as memoized component to prevent unnecessary re-renders
export default memo(SaveButton)

