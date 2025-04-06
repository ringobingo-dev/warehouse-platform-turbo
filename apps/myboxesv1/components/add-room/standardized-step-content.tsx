import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StandardizedStepContentProps {
  children: ReactNode
  className?: string
}

export function StandardizedStepContent({ children, className }: StandardizedStepContentProps) {
  return <div className={cn("w-full max-w-none full-width-container", className)}>{children}</div>
}

