import { toast } from "@/components/ui/use-toast"

export function handleError(error: unknown, fallbackMessage: string): void {
  console.error(error)
  const errorMessage = error instanceof Error ? error.message : fallbackMessage
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })
}

// possible duplicate — review for consolidation
// Original utility kept for compatibility, consider using the shared version in utils/shared/errorHandling.ts

