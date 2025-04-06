// moved to shared folder for reuse and NX prep
import type { RoomConfig } from "../types/RoomConfig"
import type { Box } from "../types/Box"

/**
 * Calculates the volume of a room
 * @param room The room configuration object
 * @returns The volume of the room
 */
export function calculateRoomVolume(room: RoomConfig): number {
  return (room.width || 0) * (room.length || 0) * (room.height || 0)
}

/**
 * Calculates the floor area of a room
 * @param room The room configuration object
 * @returns The floor area of the room
 */
export function calculateRoomFloorArea(room: RoomConfig): number {
  return (room.width || 0) * (room.length || 0)
}

/**
 * Calculates the wall surface area of a room
 * @param room The room configuration object
 * @returns The wall surface area of the room
 */
export function calculateRoomWallArea(room: RoomConfig): number {
  const width = room.width || 0
  const length = room.length || 0
  const height = room.height || 0

  return 2 * (width * height + length * height)
}

/**
 * Calculates how many boxes can fit in a room
 * @param room The room configuration object
 * @param box The box object
 * @returns The maximum number of boxes that can fit in the room
 */
export function calculateMaxBoxesInRoom(room: RoomConfig, box: Box): number {
  const roomVolume = calculateRoomVolume(room)
  const boxVolume = (box.width || 0) * (box.height || 0) * (box.depth || 0)

  if (boxVolume === 0) return 0

  // This is a simplistic calculation that doesn't account for optimal packing
  return Math.floor(roomVolume / boxVolume)
}

