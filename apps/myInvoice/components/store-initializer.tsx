"use client"

import type React from "react"

import { useInitializeStores } from "@/lib/hooks/useInitializeStores"
import { useEffect, useState } from "react"

interface StoreInitializerProps {
  children: React.ReactNode
}

export function StoreInitializer({ children }: StoreInitializerProps) {
  const { isInitialized, error } = useInitializeStores()
  const [showError, setShowError] = useState(false)

  // Show error after a delay to avoid flashing during normal initialization
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setShowError(true)
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      setShowError(false)
    }
  }, [error])

  if (!isInitialized && !showError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-foreground">Loading application...</p>
        </div>
      </div>
    )
  }

  if (showError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="mx-auto max-w-md rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <h2 className="mb-4 text-xl font-bold text-destructive">Application Error</h2>
          <p className="mb-6 text-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Refresh Application
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

