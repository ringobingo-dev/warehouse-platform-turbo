"use client"

import { useState } from "react"
import { useUIStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, colorTheme, error: uiError } = useUIStore()

  if (!isOpen) {
    return (
      <Button className="fixed bottom-4 right-4 z-50" size="sm" onClick={() => setIsOpen(true)}>
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-sm">Debug Panel</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-2">
          <div>
            <strong>UI State:</strong>
            <pre className="mt-1 rounded bg-muted p-2">
              {JSON.stringify(
                {
                  theme,
                  colorTheme,
                  error: uiError,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
          >
            Clear Storage & Reload
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              console.log("UI Store:", useUIStore.getState())
            }}
          >
            Log to Console
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

