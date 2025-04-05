import type { Box, LogEntry, Snapshot } from "@/types/Box"

// Keys for localStorage
const ROOM_BOX_DATA_PREFIX = "room-box-data-"
const SELECTED_ROOM_KEY = "selected-room-id"

/**
 * Saves box data for a specific room
 */
export function saveRoomBoxData(
  roomId: string,
  boxes: Box[],
  log: LogEntry[] = [],
  snapshots: Snapshot[] = [],
  customerColorPreferences: Record<string, string> = {},
): void {
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

    localStorage.setItem(`${ROOM_BOX_DATA_PREFIX}${roomId}`, JSON.stringify(data))
    console.log(`Box data saved for room ${roomId}`, {
      boxCount: boxes.length,
      logCount: log.length,
      snapshotCount: snapshots.length,
    })
  } catch (error) {
    console.error(`Failed to save box data for room ${roomId}:`, error)
  }
}

/**
 * Loads box data for a specific room
 */
export function loadRoomBoxData(roomId: string): {
  boxes: Box[]
  log: LogEntry[]
  snapshots: Snapshot[]
  customerColorPreferences: Record<string, string>
} | null {
  try {
    if (!roomId) {
      console.error("Cannot load box data: No room ID provided")
      return null
    }

    const storedData = localStorage.getItem(`${ROOM_BOX_DATA_PREFIX}${roomId}`)
    if (!storedData) {
      console.log(`No box data found for room ${roomId}`)
      return {
        boxes: [],
        log: [],
        snapshots: [],
        customerColorPreferences: {},
      }
    }

    const parsedData = JSON.parse(storedData)
    console.log(`Box data loaded for room ${roomId}`, {
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
    console.error(`Failed to load box data for room ${roomId}:`, error)
    return {
      boxes: [],
      log: [],
      snapshots: [],
      customerColorPreferences: {},
    }
  }
}

/**
 * Saves the currently selected room ID to localStorage
 */
export function saveSelectedRoom(roomId: string): void {
  try {
    if (!roomId) {
      console.error("Cannot save selected room: No room ID provided")
      return
    }
    localStorage.setItem(SELECTED_ROOM_KEY, roomId)
    console.log(`Selected room saved: ${roomId}`)
  } catch (error) {
    console.error("Failed to save selected room:", error)
  }
}

/**
 * Loads the currently selected room ID from localStorage
 */
export function loadSelectedRoom(): string | null {
  try {
    const roomId = localStorage.getItem(SELECTED_ROOM_KEY)
    console.log(`Loaded selected room: ${roomId || "none"}`)
    return roomId
  } catch (error) {
    console.error("Failed to load selected room:", error)
    return null
  }
}

/**
 * Gets the box count for a specific room
 */
export function getRoomBoxCount(roomId: string): number {
  try {
    if (!roomId) return 0

    const roomData = loadRoomBoxData(roomId)
    return roomData?.boxes?.length || 0
  } catch (error) {
    console.error(`Failed to get box count for room ${roomId}:`, error)
    return 0
  }
}

/**
 * Migrates existing global box data to room-specific storage
 * Only runs once to preserve backward compatibility
 */
export function migrateGlobalBoxDataToRooms(defaultRoomId: string): void {
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
      saveRoomBoxData(
        defaultRoomId,
        parsedData.boxes || [],
        parsedData.log || [],
        parsedData.snapshots || [],
        parsedData.customerColorPreferences || {},
      )

      console.log(`Migrated global box data to room ${defaultRoomId}`)
    }

    // Mark migration as complete
    localStorage.setItem(MIGRATION_COMPLETE_KEY, "true")
  } catch (error) {
    console.error("Failed to migrate global box data:", error)
  }
}

