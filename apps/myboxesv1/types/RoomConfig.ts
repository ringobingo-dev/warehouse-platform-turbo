export interface DoorConfig {
  wall: "front" | "back" | "left" | "right"
  offset: number // percentage from 0-100
}

export interface CorridorConfig {
  wall: "front" | "back" | "left" | "right"
  width: number // in meters
}

export interface RoomLayoutConfig {
  door: DoorConfig
  corridor: CorridorConfig
  storageLevels: number
}

