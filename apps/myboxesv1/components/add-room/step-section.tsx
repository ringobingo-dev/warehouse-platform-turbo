import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StepSectionProps {
  title?: string
  children: ReactNode
  className?: string
  visualizationMode?: boolean
}

export function StepSection({ title, children, className, visualizationMode = false }: StepSectionProps) {
  return <div className={cn("w-full", visualizationMode && "h-[400px] flex flex-col", className)}>{children}</div>
}

