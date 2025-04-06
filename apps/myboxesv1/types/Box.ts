export interface Box {
  row: number
  column: number
  level: number
  customerName: string
  varietyName: string
  grade: string
  loadingDate: string
  color: string
  logIndex: number
  highlighted: boolean
  size: "rectangle" | "square"
}

export interface LogEntry {
  customerName: string
  boxCount: number
  varietyName: string
  grade: string
  loadingDate: string
  locations: string[]
  boxSize: "rectangle" | "square"
  startingRow: number
  stackHeight: number
  customerBoxColor: string
}

export interface Snapshot {
  id: number
  boxes: Box[]
  log: LogEntry[]
  name?: string
}

export interface FilterCriteria {
  searchTerm: string
  customer: string
  variety: string
  grade: string
  dateFrom: string
  dateTo: string
}

