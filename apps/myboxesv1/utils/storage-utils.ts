import type { Box, LogEntry, Snapshot } from "@/types/Box"

// Keys for localStorage
const BOX_DATA_KEY = "3d-box-viewer-data"

interface StoredBoxData {
  boxes: Box[]
  log: LogEntry[]
  snapshots: Snapshot[]
  lastUpdated: number
  customerColorPreferences?: Record<string, string> // Add this line
}

/**
 * Saves the current box data to localStorage
 *
 * TODO: Replace with API calls to PostgreSQL and S3/MinIO
 * - Box data and log entries should be stored in PostgreSQL
 * - Snapshots should be stored as JSON files in S3/MinIO
 * - Customer color preferences should be stored in PostgreSQL
 *
 * API endpoints to implement:
 * - POST /api/boxes - Save box data
 * - POST /api/logs - Save log entries
 * - POST /api/snapshots - Save snapshot metadata to PostgreSQL
 * - POST /api/storage/snapshots/{id} - Upload snapshot JSON to S3/MinIO
 */
export function saveBoxData(
  boxes: Box[],
  log: LogEntry[],
  snapshots: Snapshot[],
  customerColorPreferences: Record<string, string> = {},
): void {
  try {
    const data: StoredBoxData = {
      boxes,
      log,
      snapshots,
      lastUpdated: Date.now(),
      customerColorPreferences, // Add this line
    }

    localStorage.setItem(BOX_DATA_KEY, JSON.stringify(data))
    console.log("Box data saved successfully", {
      boxCount: boxes.length,
      logCount: log.length,
      snapshotCount: snapshots.length,
      customerColorCount: Object.keys(customerColorPreferences).length, // Add this line
      // Add sample of last log entry if available
      lastLogEntry:
        log.length > 0
          ? {
              action: log[log.length - 1].action,
              customerName: log[log.length - 1].customerName,
              varietyName: log[log.length - 1].varietyName,
              grade: log[log.length - 1].grade,
              boxCount: log[log.length - 1].boxCount,
              loadingDate: log[log.length - 1].loadingDate,
            }
          : "No log entries",
    })
  } catch (error) {
    console.error("Failed to save box data to localStorage:", error)
  }
}

/**
 * Loads box data from localStorage
 *
 * TODO: Replace with API calls to PostgreSQL and S3/MinIO
 * - Box data and log entries should be loaded from PostgreSQL
 * - Snapshot metadata should be loaded from PostgreSQL
 * - Actual snapshot JSON files should be loaded from S3/MinIO when needed
 *
 * API endpoints to implement:
 * - GET /api/boxes?roomId={roomId} - Get boxes for a room
 * - GET /api/logs?roomId={roomId} - Get logs for a room
 * - GET /api/snapshots?roomId={roomId} - Get snapshot metadata for a room
 * - GET /api/storage/snapshots/{id} - Download snapshot JSON from S3/MinIO
 */
export function loadBoxData(): StoredBoxData | null {
  try {
    const storedData = localStorage.getItem(BOX_DATA_KEY)
    if (!storedData) return null

    const parsedData = JSON.parse(storedData) as StoredBoxData
    console.log("Box data loaded successfully", {
      boxCount: parsedData.boxes.length,
      logCount: parsedData.log.length,
      snapshotCount: parsedData.snapshots.length,
      lastUpdated: new Date(parsedData.lastUpdated).toLocaleString(),
    })

    return parsedData
  } catch (error) {
    console.error("Failed to load box data from localStorage:", error)
    return null
  }
}

/**
 * Exports the current box data as a JSON file for download
 *
 * TODO: Replace with API call to S3/MinIO
 * - Generate a pre-signed URL for downloading the snapshot JSON
 * - Redirect the user to the pre-signed URL
 *
 * API endpoint to implement:
 * - GET /api/storage/snapshots/{id}/download - Generate pre-signed URL
 */
export function exportBoxData(boxes: Box[], log: LogEntry[], snapshots: Snapshot[]) {
  try {
    const data = {
      boxes,
      log,
      snapshots,
      exportDate: new Date().toISOString(),
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link element
    const a = document.createElement("a")
    a.href = url
    a.download = `3d-box-data-export-${new Date().toISOString().split("T")[0]}.json`

    // Append to body, click, and remove
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)

    return true
  } catch (error) {
    console.error("Error exporting data:", error)
    return false
  }
}

