"use client"

import { useBoxContext } from "@/context/BoxContext"
import { SnapshotList } from "@/components/snapshot-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { useState, useEffect } from "react"

export function SnapshotListContainer() {
  const { snapshots, saveSnapshot, boxes, log } = useBoxContext()
  const [showAutoSaveInfo, setShowAutoSaveInfo] = useState(true)

  // Count automatic snapshots
  const autoSnapshotCount = snapshots.filter(
    (snapshot) => snapshot.name && (snapshot.name.startsWith("add_") || snapshot.name.startsWith("remove_")),
  ).length

  // Hide the info alert after 10 seconds
  useEffect(() => {
    if (showAutoSaveInfo) {
      const timer = setTimeout(() => setShowAutoSaveInfo(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [showAutoSaveInfo])

  return (
    <div className="w-full">
      {showAutoSaveInfo && autoSnapshotCount > 0 && (
        <Alert className="mb-4 bg-blue-50 border-blue-100 text-blue-800 alert">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 font-medium">Automatic Snapshots</AlertTitle>
          <AlertDescription className="text-blue-800">
            Snapshots are automatically created after each Add or Remove operation. You can download any snapshot as a
            JSON file for backup or sharing purposes. You have {autoSnapshotCount} automatic snapshots.
          </AlertDescription>
        </Alert>
      )}

      <SnapshotList snapshots={snapshots} onSaveSnapshot={saveSnapshot} currentBoxes={boxes} currentLog={log} />
    </div>
  )
}

