import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data", "rooms")

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Failed to create data directory:", error)
  }
}

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  await ensureDataDir()
  const roomId = params.roomId
  const filePath = path.join(DATA_DIR, `${roomId}.json`)

  try {
    const fileData = await fs.readFile(filePath, "utf-8")
    return NextResponse.json(JSON.parse(fileData))
  } catch (error) {
    // If file doesn't exist, return empty data structure
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({
        boxes: [],
        log: [],
        snapshots: [],
        customerColorPreferences: {},
        lastUpdated: Date.now(),
      })
    }

    return NextResponse.json({ error: "Failed to load room data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { roomId: string } }) {
  await ensureDataDir()
  const roomId = params.roomId
  const filePath = path.join(DATA_DIR, `${roomId}.json`)

  try {
    const data = await request.json()
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save room data:", error)
    return NextResponse.json({ error: "Failed to save room data" }, { status: 500 })
  }
}

