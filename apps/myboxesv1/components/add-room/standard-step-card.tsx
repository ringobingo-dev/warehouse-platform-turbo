import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface StandardStepCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
  className?: string
}

export function StandardStepCard({ title, description, children, footer, className }: StandardStepCardProps) {
  return (
    <Card className={`w-full flex flex-col ${className || ""}`}>
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full p-0 sm:p-6 flex-grow overflow-auto min-h-[600px]">
        <div className="w-full h-full px-6 sm:px-0">{children}</div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6 flex-shrink-0">{footer}</CardFooter>
    </Card>
  )
}

