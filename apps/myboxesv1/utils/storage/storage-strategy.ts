import type { Box, LogEntry, Snapshot } from "@/types/Box"

export interface StorageStrategy {
  saveRoomBoxData(
    roomId: string,
    boxes: Box[],
    log: LogEntry[],
    snapshots: Snapshot[],
    customerColorPreferences: Record<string, string>,
  ): Promise<void>

  loadRoomBoxData(roomId: string): Promise<{
    boxes: Box[]
    log: LogEntry[]
    snapshots: Snapshot[]
    customerColorPreferences: Record<string, string>
  } | null>

  saveSelectedRoom(roomId: string): Promise<void>
  loadSelectedRoom(): Promise<string | null>
  getRoomBoxCount(roomId: string): Promise<number>
  migrateGlobalBoxDataToRooms(defaultRoomId: string): Promise<void>
}

export type StorageType = "localStorage" | "fileSystem"

