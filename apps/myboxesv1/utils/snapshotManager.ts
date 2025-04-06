import type { Box } from "../types/Box"

export interface RoomSnapshot {
  name: string
  rows: number
  columns: number
  levels: number
  boxes: Box[]
}

export class SnapshotManager {
  private mainSnapshot: RoomSnapshot
  private backupSnapshots: RoomSnapshot[] = []

  constructor(rows: number, columns: number, levels: number) {
    this.mainSnapshot = {
      name: "Main Snapshot",
      rows,
      columns,
      levels,
      boxes: [],
    }
  }

  updateMainSnapshot(rows: number, columns: number, levels: number, boxes: Box[]): RoomSnapshot {
    const newSnapshot: RoomSnapshot = { name: "Main Snapshot", rows, columns, levels, boxes }
    this.backupSnapshots.push(this.mainSnapshot)
    this.mainSnapshot = newSnapshot
    return newSnapshot
  }

  getMainSnapshot(): RoomSnapshot {
    if (!this.mainSnapshot) {
      this.mainSnapshot = { name: "Main Snapshot", rows: 10, columns: 10, levels: 4, boxes: [] }
    }
    return this.mainSnapshot
  }

  getMainSnapshotName(): string {
    return this.mainSnapshot.name
  }

  getAllBackupSnapshots(): RoomSnapshot[] {
    return this.backupSnapshots
  }
}

