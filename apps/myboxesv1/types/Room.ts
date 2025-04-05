export interface Room {
  id: string
  name: string
  type: string
  category: string
  shape?: string
  rows: number
  columns: number
  levels: number
  parentRoomId?: string // For split room sides, references the main room
  side?: "EAST" | "WEST" // For split room sides
  dimensions?: {
    length: number
    width: number
  }
}

