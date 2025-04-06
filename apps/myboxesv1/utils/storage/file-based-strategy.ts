import type { Box, LogEntry, Snapshot } from "@/types/Box"
import type { StorageStrategy } from "./storage-strategy"

export class FileBasedStrategy implements StorageStrategy {
  private API_BASE_URL = "/api/storage/rooms"
  private SELECTED_ROOM_KEY = "selected-room-id-file"

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

      const response = await fetch(`${this.API_BASE_URL}/${roomId}/boxes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to save room data: ${response.statusText}`)
      }

      console.log(`[FileStorage] Box data saved for room ${roomId}`, {
        boxCount: boxes.length,
        logCount: log.length,
        snapshotCount: snapshots.length,
      })
    } catch (error) {
      console.error(`[FileStorage] Failed to save box data for room ${roomId}:`, error)
      // Don't throw the error to maintain compatibility with localStorage strategy
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

      const response = await fetch(`${this.API_BASE_URL}/${roomId}/boxes`)

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`[FileStorage] No box data found for room ${roomId}`)
          return {
            boxes: [],
            log: [],
            snapshots: [],
            customerColorPreferences: {},
          }
        }
        throw new Error(`Failed to load room data: ${response.statusText}`)
      }

      const data = await response.json()

      console.log(`[FileStorage] Box data loaded for room ${roomId}`, {
        boxCount: data.boxes?.length || 0,
        logCount: data.log?.length || 0,
        snapshotCount: data.snapshots?.length || 0,
      })

      return {
        boxes: data.boxes || [],
        log: data.log || [],
        snapshots: data.snapshots || [],
        customerColorPreferences: data.customerColorPreferences || {},
      }
    } catch (error) {
      console.error(`[FileStorage] Failed to load box data for room ${roomId}:`, error)
      // Return empty data on error to maintain compatibility with localStorage strategy
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
        console.error("[FileStorage] Cannot save selected room: No room ID provided")
        return
      }
      // Still use localStorage for selected room to avoid extra API calls
      localStorage.setItem(this.SELECTED_ROOM_KEY, roomId)
      console.log(`[FileStorage] Selected room saved: ${roomId}`)
    } catch (error) {
      console.error("[FileStorage] Failed to save selected room:", error)
    }
  }

  async loadSelectedRoom(): Promise<string | null> {
    try {
      // Still use localStorage for selected room to avoid extra API calls
      const roomId = localStorage.getItem(this.SELECTED_ROOM_KEY)
      console.log(`[FileStorage] Loaded selected room: ${roomId || "none"}`)
      return roomId
    } catch (error) {
      console.error("[FileStorage] Failed to load selected room:", error)
      return null
    }
  }

  async getRoomBoxCount(roomId: string): Promise<number> {
    try {
      if (!roomId) return 0

      const roomData = await this.loadRoomBoxData(roomId)
      return roomData?.boxes?.length || 0
    } catch (error) {
      console.error(`[FileStorage] Failed to get box count for room ${roomId}:`, error)
      return 0
    }
  }

  async migrateGlobalBoxDataToRooms(defaultRoomId: string): Promise<void> {
    try {
      const MIGRATION_COMPLETE_KEY = "file-box-data-migration-complete"

      // Check if migration has already been done
      if (localStorage.getItem(MIGRATION_COMPLETE_KEY) === "true") {
        return
      }

      // For file-based storage, we don't migrate from global data
      // Just mark as complete
      localStorage.setItem(MIGRATION_COMPLETE_KEY, "true")
      console.log(`[FileStorage] Migration marked as complete for room ${defaultRoomId}`)
    } catch (error) {
      console.error("[FileStorage] Failed to mark migration complete:", error)
    }
  }
}

