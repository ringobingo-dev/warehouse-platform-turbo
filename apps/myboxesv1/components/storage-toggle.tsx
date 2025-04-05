"use client"

import { useStorage } from "@/utils/storage/storage-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function StorageToggle() {
  const { storageType, setStorageType, isLoading } = useStorage()
  const [showWarning, setShowWarning] = useState(false)

  const handleToggleChange = () => {
    // Show warning before changing storage type
    setShowWarning(true)
  }

  const confirmChange = () => {
    setStorageType(storageType === "localStorage" ? "fileSystem" : "localStorage")
    setShowWarning(false)
    // Reload the page to ensure clean state
    window.location.reload()
  }

  const cancelChange = () => {
    setShowWarning(false)
  }

  if (isLoading) {
    return <div className="p-4 border rounded-md animate-pulse">Loading storage settings...</div>
  }

  return (
    <div className="mb-6 p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Storage Method</h3>
          <p className="text-sm text-muted-foreground">Choose where to store room and box data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="storage-toggle" className={storageType === "localStorage" ? "font-bold" : ""}>
            Local
          </Label>
          <Switch id="storage-toggle" checked={storageType === "fileSystem"} onCheckedChange={handleToggleChange} />
          <Label htmlFor="storage-toggle" className={storageType === "fileSystem" ? "font-bold" : ""}>
            Server
          </Label>
        </div>
      </div>

      {showWarning && (
        <Alert variant="warning" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            <p>
              Changing storage method will reset your current session. Data from one storage system is not automatically
              transferred to the other.
            </p>
            <div className="flex justify-end space-x-2 mt-2">
              <Button onClick={cancelChange} variant="outline" size="sm">
                Cancel
              </Button>
              <Button onClick={confirmChange} variant="destructive" size="sm">
                Continue
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-2 text-xs text-muted-foreground">
        Current storage:{" "}
        <span className="font-medium">
          {storageType === "localStorage" ? "Browser Local Storage" : "Server File System"}
        </span>
      </div>
    </div>
  )
}

