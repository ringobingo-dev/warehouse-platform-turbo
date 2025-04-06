"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
// This import uses a relative path to access a utility from the lib directory
import { cn } from "../../lib/utils"

// This component is used across multiple files and should be considered for a shared UI library
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

// TODO: Review for Stage 1 completeness
// possible duplicate — review for consolidation
// Original component kept for compatibility, consider using the shared version in components/shared/ui/label.tsx

