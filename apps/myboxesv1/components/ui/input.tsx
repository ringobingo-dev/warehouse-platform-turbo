import type React from "react"
// moved to shared folder for reuse and NX prep
import { cn } from "../../lib/utils"
import { forwardRef } from "react"

// This component is used across multiple files and should be considered for a shared UI library
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

// TODO: Review for Stage 1 completeness
// possible duplicate — review for consolidation
// Original component kept for compatibility, consider using the shared version in components/shared/ui/input.tsx

