import { useStorage } from "./storage-context"
import type { Box, LogEntry, Snapshot } from "@/types/Box"

export function useRoomBoxManagerWrapper() {
  const { storageStrategy } = useStorage()

  return {
    saveRoomBoxData: async (
      roomId: string,
      boxes: Box[],
      log: LogEntry[] = [],
      snapshots: Snapshot[] = [],
      customerColorPreferences: Record<string, string> = {},
    ) => {
      return storageStrategy.saveRoomBoxData(roomId, boxes, log, snapshots, customerColorPreferences)
    },

    loadRoomBoxData: async (roomId: string) => {
      return storageStrategy.loadRoomBoxData(roomId)
    },

    saveSelectedRoom: async (roomId: string) => {
      return storageStrategy.saveSelectedRoom(roomId)
    },

    loadSelectedRoom: async () => {
      return storageStrategy.loadSelectedRoom()
    },

    getRoomBoxCount: async (roomId: string) => {
      return storageStrategy.getRoomBoxCount(roomId)
    },

    migrateGlobalBoxDataToRooms: async (defaultRoomId: string) => {
      return storageStrategy.migrateGlobalBoxDataToRooms(defaultRoomId)
    },
  }
}

