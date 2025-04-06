import type { Box, LogEntry, Snapshot } from "@/types/Box"
import type { StorageStrategy } from "./storage-strategy"

export class LocalStorageStrategy implements StorageStrategy {
  private ROOM_BOX_DATA_PREFIX = "room-box-data-"
  private SELECTED_ROOM_KEY = "selected-room-id"

  async saveRoomBoxData(
    roomId: string,
    boxes: Box[],
    log: LogEntry[] = [],
    snapshots: Snapshot[] = [],
    customerColorPreferences: Record<string, string> = {},
  ): Promise<void> {
    try {
      if (!roomId) {
        console.error("Cannot save box data: No room ID provided")
        return
      }

      const data = {
        boxes,
        log,
        snapshots,
        lastUpdated: Date.now(),
        customerColorPreferences,
      }

      localStorage.setItem(`${this.ROOM_BOX_DATA_PREFIX}${roomId}`, JSON.stringify(data))
      console.log(`[LocalStorage] Box data saved for room ${roomId}`, {
        boxCount: boxes.length,
        logCount: log.length,
        snapshotCount: snapshots.length,
      })
    } catch (error) {
      console.error(`[LocalStorage] Failed to save box data for room ${roomId}:`, error)
    }
  }

  async loadRoomBoxData(roomId: string): Promise<{
    boxes: Box[]
    log: LogEntry[]
    snapshots: Snapshot[]
    customerColorPreferences: Record<string, string>
  } | null> {
    try {
      if (!roomId) {
        console.error("Cannot load box data: No room ID provided")
        return null
      }

      const storedData = localStorage.getItem(`${this.ROOM_BOX_DATA_PREFIX}${roomId}`)
      if (!storedData) {
        console.log(`[LocalStorage] No box data found for room ${roomId}`)
        return {
          boxes: [],
          log: [],
          snapshots: [],
          customerColorPreferences: {},
        }
      }

      const parsedData = JSON.parse(storedData)
      console.log(`[LocalStorage] Box data loaded for room ${roomId}`, {
        boxCount: parsedData.boxes?.length || 0,
        logCount: parsedData.log?.length || 0,
        snapshotCount: parsedData.snapshots?.length || 0,
      })

      return {
        boxes: parsedData.boxes || [],
        log: parsedData.log || [],
        snapshots: parsedData.snapshots || [],
        customerColorPreferences: parsedData.customerColorPreferences || {},
      }
    } catch (error) {
      console.error(`[LocalStorage] Failed to load box data for room ${roomId}:`, error)
      return {
        boxes: [],
        log: [],
        snapshots: [],
        customerColorPreferences: {},
      }
    }
  }

  async saveSelectedRoom(roomId: string): Promise<void> {
    try {
      if (!roomId) {
        console.error("[LocalStorage] Cannot save selected room: No room ID provided")
        return
      }
      localStorage.setItem(this.SELECTED_ROOM_KEY, roomId)
      console.log(`[LocalStorage] Selected room saved: ${roomId}`)
    } catch (error) {
      console.error("[LocalStorage] Failed to save selected room:", error)
    }
  }

  async loadSelectedRoom(): Promise<string | null> {
    try {
      const roomId = localStorage.getItem(this.SELECTED_ROOM_KEY)
      console.log(`[LocalStorage] Loaded selected room: ${roomId || "none"}`)
      return roomId
    } catch (error) {
      console.error("[LocalStorage] Failed to load selected room:", error)
      return null
    }
  }

  async getRoomBoxCount(roomId: string): Promise<number> {
    try {
      if (!roomId) return 0

      const roomData = await this.loadRoomBoxData(roomId)
      return roomData?.boxes?.length || 0
    } catch (error) {
      console.error(`[LocalStorage] Failed to get box count for room ${roomId}:`, error)
      return 0
    }
  }

  async migrateGlobalBoxDataToRooms(defaultRoomId: string): Promise<void> {
    try {
      const MIGRATION_COMPLETE_KEY = "box-data-migration-complete"

      // Check if migration has already been done
      if (localStorage.getItem(MIGRATION_COMPLETE_KEY) === "true") {
        return
      }

      // Get global box data
      const globalBoxData = localStorage.getItem("3d-box-viewer-data")
      if (globalBoxData) {
        const parsedData = JSON.parse(globalBoxData)

        // Save to the default room
        await this.saveRoomBoxData(
          defaultRoomId,
          parsedData.boxes || [],
          parsedData.log || [],
          parsedData.snapshots || [],
          parsedData.customerColorPreferences || {},
        )

        console.log(`[LocalStorage] Migrated global box data to room ${defaultRoomId}`)
      }

      // Mark migration as complete
      localStorage.setItem(MIGRATION_COMPLETE_KEY, "true")
    } catch (error) {
      console.error("[LocalStorage] Failed to migrate global box data:", error)
    }
  }
}

