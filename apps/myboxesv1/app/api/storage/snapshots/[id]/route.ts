import { NextResponse } from "next/server"

/**
 * @route GET /api/storage/snapshots/[id]
 * @description Get a snapshot JSON from S3/MinIO
 * @param {string} id - The snapshot ID
 * @returns {Object} JSON response with snapshot data
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // In a real implementation, you would authenticate the user
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params

    // In the real implementation, you would first get the snapshot metadata from PostgreSQL
    // const snapshot = await prisma.snapshot.findUnique({
    //   where: { id },
    //   include: { room: true },
    // });
    //
    // if (!snapshot) {
    //   return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
    // }
    //
    // // Check if the user has access to this snapshot
    // if (snapshot.room.userId !== session.user.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Then you would get the snapshot JSON from S3/MinIO
    // const snapshotData = await getSnapshot(snapshot.s3Key);

    // Simulate S3/MinIO response with localStorage data
    const snapshotsData = localStorage.getItem("3d-box-viewer-data")
    if (!snapshotsData) {
      return NextResponse.json({ error: "Snapshot not found" }, { status: 404 })
    }

    const data = JSON.parse(snapshotsData)
    const snapshot = data.snapshots.find((s: any) => s.id.toString() === id)

    if (!snapshot) {
      return NextResponse.json({ error: "Snapshot not found" }, { status: 404 })
    }

    return NextResponse.json(snapshot)
  } catch (error) {
    console.error("Error fetching snapshot:", error)
    return NextResponse.json({ error: "Failed to fetch snapshot" }, { status: 500 })
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
    // In a real implementation, you would authenticate the user
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params

    // In the real implementation, you would first get the snapshot metadata from PostgreSQL
    // const snapshot = await prisma.snapshot.findUnique({
    //   where: { id },
    //   include: { room: true },
    // });
    //
    // if (!snapshot) {
    //   return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
    // }
    //
    // // Check if the user has access to this snapshot
    // if (snapshot.room.userId !== session.user.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    //
    // // Delete the snapshot JSON from S3/MinIO
    // await deleteSnapshot(snapshot.s3Key);
    //
    // // Delete the snapshot metadata from PostgreSQL
    // await prisma.snapshot.delete({
    //   where: { id },
    // });

    // Simulate deletion with localStorage
    const snapshotsData = localStorage.getItem("3d-box-viewer-data")
    if (!snapshotsData) {
      return NextResponse.json({ error: "Snapshot not found" }, { status: 404 })
    }

    const data = JSON.parse(snapshotsData)
    data.snapshots = data.snapshots.filter((s: any) => s.id.toString() !== id)
    localStorage.setItem("3d-box-viewer-data", JSON.stringify(data))

    return NextResponse.json({ message: "Snapshot deleted successfully" })
  } catch (error) {
    console.error("Error deleting snapshot:", error)
    return NextResponse.json({ error: "Failed to delete snapshot" }, { status: 500 })
  }
}

