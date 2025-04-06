/**
 * Utility functions for handling room storage data
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"

// Add a function to handle environment-specific configurations

/**
 * Get S3 client configuration based on environment
 */
export function getS3Config() {
  const isLocalDev = process.env.NEXT_PUBLIC_SST_STAGE === "local" || process.env.NODE_ENV === "development"

  // Base configuration
  const config = {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || "",
      secretAccessKey: process.env.MINIO_SECRET_KEY || "",
    },
  }

  // Add environment-specific settings
  if (isLocalDev) {
    // Local development with MinIO
    return {
      ...config,
      endpoint: process.env.MINIO_ENDPOINT,
      forcePathStyle: true, // Required for MinIO
    }
  } else {
    // AWS environment
    return config
  }
}

// Update the S3Client initialization to use the new function
const s3Client = new S3Client(getS3Config())

// Function to save room data to S3/MinIO
export async function saveRoomData(data: any, dataType: "2d" | "3d") {
  try {
    const { id, roomName } = data

    if (!id || !roomName) {
      throw new Error("Missing required fields: id or roomName")
    }

    // Create a sanitized filename
    const sanitizedRoomName = roomName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
    const filename = `${sanitizedRoomName}_${id}_${dataType}_boxData.json`

    // Upload to S3/MinIO
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME || "storage-rooms",
      Key: filename,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    })

    await s3Client.send(command)

    return {
      success: true,
      filename,
      message: `Room ${dataType} data saved successfully`,
    }
  } catch (error) {
    console.error(`Error saving ${dataType} room data:`, error)
    throw error
  }
}

// Function to load room data from S3/MinIO
export async function loadRoomData(roomId: string, dataType: "2d" | "3d") {
  try {
    // In a real implementation, you would need to know the filename
    // This could be stored in a database or you could use a listing operation
    // For now, we'll assume the filename follows the pattern: {roomId}_{dataType}_boxData.json
    const filename = `${roomId}_${dataType}_boxData.json`

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME || "storage-rooms",
      Key: filename,
    })

    const response = await s3Client.send(command)

    // Convert the response stream to a string
    const bodyContents = await streamToString(response.Body)

    // Parse the JSON string
    return JSON.parse(bodyContents)
  } catch (error) {
    console.error(`Error loading ${dataType} room data:`, error)
    throw error
  }
}

// Helper function to convert a stream to a string
async function streamToString(stream: any): Promise<string> {
  const chunks: Buffer[] = []

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(chunk))
    stream.on("error", reject)
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}

// Function to create a room data object with the correct structure
export function createRoomDataObject(baseData: any, dataType: "2d" | "3d") {
  const commonData = {
    id: baseData.id || Date.now().toString(),
    version: "1.0",
    dataType,
    roomName: baseData.roomName,
    roomCategory: baseData.roomCategory,
    roomType: baseData.roomType,
    roomShape: baseData.roomShape,
    createdDate: baseData.createdDate || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  }

  if (dataType === "2d") {
    return {
      ...commonData,
      dimensions:
        baseData.roomShape === "split-side"
          ? {
              leftSideLength: baseData.leftSideLength,
              leftSideWidth: baseData.leftSideWidth,
              rightSideLength: baseData.rightSideLength,
              rightSideWidth: baseData.rightSideWidth,
              leftSideName: baseData.leftSideName,
              rightSideName: baseData.rightSideName,
              totalLength: Math.max(baseData.leftSideLength, baseData.rightSideLength),
              totalWidth: baseData.leftSideWidth + baseData.rightSideWidth,
            }
          : {
              length: baseData.length,
              width: baseData.width,
            },
      doorConfig: baseData.doorConfig,
      corridorConfig: baseData.corridorConfig,
      storageConfig: baseData.storageConfig,
      rows: baseData.rows,
      columns: baseData.columns,
      levels: baseData.levels,
      visualProperties: {
        gridColor: "#3b82f6",
        doorColor: "#ef4444",
        corridorColor: "#10b981",
        backgroundColor: "#f8fafc",
        labelColor: "#1e293b",
      },
      description: baseData.description,
      tags: baseData.tags,
      status: baseData.status,
    }
  } else {
    // 3D data format
    return {
      ...commonData,
      ...baseData,
      renderSettings: {
        boxHeight: 1.0,
        boxWidth: 1.0,
        boxDepth: 1.0,
        floorColor: "#f5f5f5",
        wallColor: "#e5e5e5",
        gridColor: "#cccccc",
      },
    }
  }
}

