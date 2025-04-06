"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw } from "lucide-react"

export function ChunkErrorFallback() {
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Add a global handler for chunk loading errors
    const originalError = console.error

    console.error = (...args) => {
      const errorString = args.join(" ")
      if (errorString.includes("Loading chunk") && errorString.includes("failed")) {
        // Clear cache in localStorage to prevent persistent errors
        try {
          const cacheKeys = Object.keys(localStorage).filter((key) => key.startsWith("next-") || key.includes("chunk"))
          cacheKeys.forEach((key) => localStorage.removeItem(key))
        } catch (e) {
          // Ignore localStorage errors
        }
      }
      originalError(...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    // Clear cache and reload
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }
    window.location.reload()
  }

  return (
    <Alert variant="destructive" className="max-w-md mx-auto my-8">
      <AlertTitle className="text-lg">Chunk Loading Error</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">
          A JavaScript module failed to load. This could be due to network issues or a caching problem.
        </p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Reload Application
        </Button>
      </AlertDescription>
    </Alert>
  )
}

