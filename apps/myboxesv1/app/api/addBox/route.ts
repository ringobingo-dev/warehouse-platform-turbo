import { NextResponse } from "next/server"
import { addBoxToDynamoDB, type BoxItem } from "@/lib/dynamodb"

export async function POST(request: Request) {
  try {
    const boxItem: BoxItem = await request.json()
    await addBoxToDynamoDB(boxItem)
    return NextResponse.json({ message: "Box added successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error adding box:", error)
    return NextResponse.json({ error: "Failed to add box" }, { status: 500 })
  }
}

