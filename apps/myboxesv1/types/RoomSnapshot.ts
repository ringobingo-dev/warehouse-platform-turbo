export interface BoxSummary {
  totalBoxes: number
  boxesByCustomer: Record<string, number>
  boxesByVariety: Record<string, number>
  boxesByGrade: Record<string, number>
}

export interface RoomConfig {
  rows: number
  columns: number
  levels: number
}

export class RoomSnapshot {
  timestamp: number
  roomConfig: RoomConfig
  boxes: {
    row: number
    column: number
    level: number
    customerName: string
    varietyName: string
    grade: string
    loadingDate: string
    color: string
  }[]
  boxSummary: BoxSummary

  constructor(roomConfig: RoomConfig, boxes: any[]) {
    this.timestamp = Date.now()
    this.roomConfig = roomConfig
    this.boxes = boxes
    this.boxSummary = this.calculateBoxSummary(boxes)
  }

  private calculateBoxSummary(boxes: any[]): BoxSummary {
    const summary: BoxSummary = {
      totalBoxes: boxes.length,
      boxesByCustomer: {},
      boxesByVariety: {},
      boxesByGrade: {},
    }

    boxes.forEach((box) => {
      summary.boxesByCustomer[box.customerName] = (summary.boxesByCustomer[box.customerName] || 0) + 1
      summary.boxesByVariety[box.varietyName] = (summary.boxesByVariety[box.varietyName] || 0) + 1
      summary.boxesByGrade[box.grade] = (summary.boxesByGrade[box.grade] || 0) + 1
    })

    return summary
  }
}

