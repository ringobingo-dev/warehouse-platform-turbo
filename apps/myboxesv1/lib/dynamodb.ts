// This file is currently not in use. DynamoDB functionality is disabled.

export interface BoxItem {
  box_id: string
  customer_id: string
  logistics_id: string
  transport_id: string
  room_id: string
  action: string
  box_scan: string
  cost_per_day: number
  Grade: string
  Grower: string
  timestamp: number
  Type: string
  Variety: string
  weight: number
}

export async function addBoxToDynamoDB(boxItem: BoxItem): Promise<void> {
  console.log("DynamoDB functionality is currently disabled.")
  console.log("Box data:", boxItem)
}

export async function getBoxFromDynamoDB(roomId: string, boxId: string): Promise<BoxItem | null> {
  console.log("DynamoDB functionality is currently disabled.")
  console.log("Attempted to get box with roomId:", roomId, "and boxId:", boxId)
  return null
}

export async function getBoxesForRoom(roomId: string): Promise<BoxItem[]> {
  console.log("DynamoDB functionality is currently disabled.")
  console.log("Attempted to get boxes for roomId:", roomId)
  return []
}

