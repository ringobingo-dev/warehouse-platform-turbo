"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useStorage } from "@/utils/storage/storage-context"
import { LocalStorageStrategy } from "@/utils/storage/local-storage-strategy"
import { FileBasedStrategy } from "@/utils/storage/file-based-strategy"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Helper function to get all room IDs from localStorage
function getAllRoomIdsFromLocalStorage(): string[] {
  const roomIds: string[] = []
  const prefix = "room-box-data-"

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      const roomId = key.substring(prefix.length)
      roomIds.push(roomId)
    }
  }

  return roomIds
}

export function StorageMigration() {
  const { storageType } = useStorage()
  const [isMigrating, setIsMigrating] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const migrateData = async () => {
    setIsMigrating(true)
    setProgress(0)

    try {
      // Determine source and target strategies
      const sourceStrategy = storageType === "localStorage" ? new LocalStorageStrategy() : new FileBasedStrategy()

      const targetStrategy = storageType === "localStorage" ? new FileBasedStrategy() : new LocalStorageStrategy()

      // Get all room IDs from source
      const roomIds = storageType === "localStorage" ? getAllRoomIdsFromLocalStorage() : [] // For file-based, we'd need a different approach

      if (roomIds.length === 0) {
        toast({
          title: "No Rooms Found",
          description: "No rooms found to migrate.",
          variant: "warning",
        })
        setIsMigrating(false)
        return
      }

      // Migrate each room
      for (let i = 0; i < roomIds.length; i++) {
        const roomId = roomIds[i]
        const roomData = await sourceStrategy.loadRoomBoxData(roomId)

        if (roomData) {
          await targetStrategy.saveRoomBoxData(
            roomId,
            roomData.boxes,
            roomData.log,
            roomData.snapshots,
            roomData.customerColorPreferences,
          )
        }

        // Update progress
        setProgress(Math.round(((i + 1) / roomIds.length) * 100))
      }

      toast({
        title: "Migration Complete",
        description: `Successfully migrated ${roomIds.length} rooms to ${storageType === "localStorage" ? "server storage" : "local storage"}`,
      })
    } catch (error) {
      console.error("Migration failed:", error)
      toast({
        title: "Migration Failed",
        description: "An error occurred during migration. See console for details.",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="mb-6 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">Data Migration</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Migrate your data from{" "}
        {storageType === "localStorage" ? "local storage to server storage" : "server storage to local storage"}.
      </p>

      {isMigrating && (
        <div className="mb-4">
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-center">{progress}% complete</p>
        </div>
      )}

      <Button onClick={migrateData} disabled={isMigrating} variant="outline">
        {isMigrating ? "Migrating..." : `Migrate to ${storageType === "localStorage" ? "Server" : "Local"} Storage`}
      </Button>
    </div>
  )
}

