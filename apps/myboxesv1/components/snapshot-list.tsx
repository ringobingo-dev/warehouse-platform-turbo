"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Save, FileJson, Search, Calendar, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Snapshot } from "@/types/Box"

interface SnapshotListProps {
  snapshots: Snapshot[]
  onSaveSnapshot: () => void
  currentBoxes: any[]
  currentLog: any[]
}

export const SnapshotList = React.memo(({ snapshots, onSaveSnapshot, currentBoxes, currentLog }: SnapshotListProps) => {
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleShowJson = useCallback(() => {
    setIsJsonDialogOpen(true)
  }, [])

  const copyToClipboard = (text: string) => {
    if (!navigator?.clipboard) {
      console.error("Clipboard API not available")
      return false
    }

    try {
      navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }
  }

  const handleDownloadSnapshot = useCallback((snapshot: Snapshot) => {
    try {
      // Create a JSON string of the snapshot
      const snapshotJson = JSON.stringify(snapshot, null, 2)

      // Create a blob from the JSON
      const blob = new Blob([snapshotJson], { type: "application/json" })

      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a temporary link element
      const link = document.createElement("a")
      link.href = url

      // Generate filename based on snapshot name and timestamp
      const timestamp = new Date(snapshot.id).toISOString().split("T")[0]
      const safeName = snapshot.name?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "snapshot"
      link.download = `${safeName}_${timestamp}.json`

      // Append link to body, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while downloading the snapshot.")
    }
  }, [])

  const currentSnapshotJson = useMemo(
    () =>
      JSON.stringify(
        {
          boxes: currentBoxes,
          log: currentLog,
        },
        null,
        2,
      ),
    [currentBoxes, currentLog],
  )

  const filteredSnapshots = useMemo(() => {
    if (!searchTerm) return snapshots

    return snapshots.filter((snapshot) => snapshot.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [snapshots, searchTerm])

  const renderSnapshots = useMemo(
    () =>
      filteredSnapshots.map((snapshot, index) => {
        // Determine if this is an automatic snapshot
        const isAutoSnapshot =
          snapshot.name && (snapshot.name.startsWith("add_") || snapshot.name.startsWith("remove_"))

        // Format the display name
        let displayName = snapshot.name || `Snapshot ${index + 1}`
        if (isAutoSnapshot) {
          // Extract operation type and customer name
          const parts = snapshot.name.split("_")
          const operation = parts[0].charAt(0).toUpperCase() + parts[0].slice(1) // Capitalize first letter
          const customer = parts.length > 1 ? parts[1] : "Unknown"
          displayName = `${operation} - ${customer}`
        }

        // Format date
        const snapshotDate = new Date(snapshot.id)
        const formattedDate = snapshotDate.toLocaleDateString()
        const formattedTime = snapshotDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        return (
          <div
            key={snapshot.id}
            className={`flex items-center justify-between p-4 rounded-md mb-2 snapshot-item ${isAutoSnapshot ? "bg-blue-50 border-blue-100" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-md ${isAutoSnapshot ? "bg-blue-100" : "bg-gray-100"}`}>
                {isAutoSnapshot ? (
                  <Calendar className="h-5 w-5 text-blue-600" />
                ) : (
                  <Save className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <span className="font-medium text-gray-900">{displayName}</span>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {formattedDate} at {formattedTime} • {snapshot.boxes.length} boxes
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDownloadSnapshot(snapshot)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )
      }),
    [filteredSnapshots, handleDownloadSnapshot],
  )

  return (
    <Card className="card">
      <CardHeader className="card-header">
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5 text-blue-600" />
          Snapshots
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content">
        {error && (
          <Alert variant="destructive" className="mb-4 alert">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Button onClick={onSaveSnapshot} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button onClick={handleShowJson} variant="outline" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            JSON
          </Button>

          <div className="relative flex-1 ml-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search snapshots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredSnapshots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Save className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No snapshots found</p>
            <p className="text-sm">
              {snapshots.length === 0
                ? "Save the current state to create your first snapshot"
                : "Try adjusting your search term"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">{renderSnapshots}</div>
        )}
      </CardContent>

      <Dialog open={isJsonDialogOpen} onOpenChange={setIsJsonDialogOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>Current Snapshot JSON</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[60vh] w-full text-sm font-mono">
              {currentSnapshotJson}
            </pre>
            <Button
              onClick={() => copyToClipboard(currentSnapshotJson)}
              className="absolute top-2 right-2 h-8 px-2 text-xs"
              variant="secondary"
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
})

SnapshotList.displayName = "SnapshotList"

