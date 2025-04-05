import { cn } from "@/lib/utils"
import type React from "react"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function PageContainer({ children, className, fullWidth = false }: PageContainerProps) {
  return <div className={cn("p-4", fullWidth ? "max-w-full" : "max-w-[1600px] mx-auto", className)}>{children}</div>
}

