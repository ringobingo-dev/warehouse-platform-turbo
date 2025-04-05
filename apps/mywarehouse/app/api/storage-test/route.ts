import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"
import { BUCKET_NAME, NEXT_PUBLIC_SST_STAGE } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    // Generate a test upload URL
    const testKey = `test-${Date.now()}.txt`
    const uploadUrl = await storage.getUploadUrl(testKey)

    return NextResponse.json({
      success: true,
      message: "Storage configuration test successful",
      environment: NEXT_PUBLIC_SST_STAGE,
      bucket: BUCKET_NAME,
      testUploadUrl: uploadUrl,
    })
  } catch (error) {
    console.error("Storage test failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Storage configuration test failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

