import { NextResponse } from "next/server"
import { getBoxesForRoom } from "@/lib/dynamodb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get("roomId")

  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
  }

  try {
    const boxes = await getBoxesForRoom(roomId)
    return NextResponse.json(boxes)
  } catch (error) {
    console.error("Error getting boxes:", error)
    return NextResponse.json({ error: "Failed to get boxes" }, { status: 500 })
  }
}

