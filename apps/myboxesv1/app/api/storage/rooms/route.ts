import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getS3Config } from "@/lib/storage-utils"

// Initialize S3 client with environment-specific configuration
const s3Client = new S3Client(getS3Config())

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, dataType, roomName } = data

    if (!id || !dataType || !roomName) {
      return NextResponse.json({ error: "Missing required fields: id, dataType, or roomName" }, { status: 400 })
    }

    // Validate dataType
    if (dataType !== "2d" && dataType !== "3d") {
      return NextResponse.json({ error: "dataType must be either '2d' or '3d'" }, { status: 400 })
    }

    // Create a sanitized filename
    const sanitizedRoomName = roomName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
    const filename = `${sanitizedRoomName}_${id}_${dataType}_boxData.json`

    // Log the data being saved (for debugging)
    console.log(`Saving ${dataType} data for room: ${roomName} (${id})`)

    // Check if this is a split-side room
    const isSplitSide = data.roomShape === "split-side" || (data.dimensions && data.dimensions.leftSideName)

    if (isSplitSide) {
      console.log("Detected split-side room configuration")
    }

    // Upload to S3/MinIO
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME || "storage-rooms",
      Key: filename,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    })

    await s3Client.send(command)

    return NextResponse.json({
      success: true,
      message: `Room ${dataType} data saved successfully`,
      filename,
      isSplitSide,
    })
  } catch (error) {
    console.error("Error saving room data:", error)
    return NextResponse.json(
      {
        error: "Failed to save room data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const dataType = searchParams.get("dataType") // "2d" or "3d"
  const roomId = searchParams.get("roomId")

  if (!dataType || !roomId) {
    return NextResponse.json({ error: "Missing required parameters: dataType or roomId" }, { status: 400 })
  }

  try {
    // In a real implementation, you would fetch the data from S3/MinIO
    // For now, we'll return a placeholder response
    return NextResponse.json({
      success: true,
      message: `This endpoint would fetch the ${dataType} data for room ${roomId}`,
      // In production, implement actual S3 GetObject operation here
    })
  } catch (error) {
    console.error("Error fetching room data:", error)
    return NextResponse.json({ error: "Failed to fetch room data" }, { status: 500 })
  }
}

