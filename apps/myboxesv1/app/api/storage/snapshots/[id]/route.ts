import { NextResponse } from "next/server"
import { getSnapshot, deleteSnapshot } from "@/lib/storage"

/**
 * @route GET /api/storage/snapshots/[id]
 * @description Get a snapshot JSON from S3/MinIO
 * @param {string} id - The snapshot ID
 * @returns {Object} JSON response with snapshot data
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const snapshot = await getSnapshot(params.id)
    return NextResponse.json(snapshot)
  } catch (error) {
    return NextResponse.json({ error: "Snapshot not found" }, { status: 404 })
  }
}

/**
 * @route DELETE /api/storage/snapshots/[id]
 * @description Delete a snapshot from S3/MinIO and its metadata from PostgreSQL
 * @param {string} id - The snapshot ID
 * @returns {Object} JSON response with success message
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteSnapshot(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete snapshot" }, { status: 500 })
  }
}

