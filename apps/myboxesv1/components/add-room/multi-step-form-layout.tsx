import type React from "react"
import { BoxProvider } from "@/contexts/BoxContext"

interface MultiStepFormLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function MultiStepFormLayout({ children, title, description }: MultiStepFormLayoutProps) {
  return (
    <BoxProvider>
      <div className="w-full max-w-5xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        <div className="w-full bg-background rounded-lg shadow-sm">{children}</div>
      </div>
    </BoxProvider>
  )
}

