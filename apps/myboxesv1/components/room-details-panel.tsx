"use client"
// NX: UI component used across multiple files
import { Card, CardContent, CardFooter } from "./ui/card"
// NX: UI component used across multiple files
import { Button } from "./ui/button"
// NX: UI component used across multiple files
import { Badge } from "./ui/badge"

// Types
export interface SavedRoom {
  id: string
  roomName: string
  roomCategory: string
  roomType: string
  roomShape: string
  length: number
  width: number
  rows: {
    count: number
  }
  columns: {
    count: number
  }
  levels: number
  createdDate: string
}

interface BoxInventoryItem {
  customer: string
  variety: string
  grade: string
  count: number
}

interface RoomDetailsPanelProps {
  selectedRoom: SavedRoom | null
  inventoryData?: Record<string, BoxInventoryItem[]>
  onViewRoom?: (room: SavedRoom) => void
}

export function RoomDetailsPanel({ selectedRoom, inventoryData = {}, onViewRoom }: RoomDetailsPanelProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getGradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      Premium: "bg-green-100 text-green-800 border-green-200",
      Standard: "bg-blue-100 text-blue-800 border-blue-200",
      Fancy: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Jumbo: "bg-amber-100 text-amber-800 border-amber-200",
      Medium: "bg-orange-100 text-orange-800 border-orange-200",
      Small: "bg-gray-100 text-gray-800 border-gray-200",
      A: "bg-green-100 text-green-800 border-green-200",
      AA: "bg-emerald-100 text-emerald-800 border-emerald-200",
      B: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }

    const color = colors[grade] || "bg-gray-100 text-gray-800 border-gray-200"

    return (
      <Badge variant="outline" className={`${color} text-xs`}>
        {grade}
      </Badge>
    )
  }

  // Get inventory data for the selected room
  const roomInventory = selectedRoom ? inventoryData[selectedRoom.id] || [] : []

  // Calculate total boxes
  const totalBoxes = roomInventory.reduce((sum, item) => sum + item.count, 0) || 0

  // Calculate room capacity
  const roomCapacity = selectedRoom ? selectedRoom.rows.count * selectedRoom.columns.count * selectedRoom.levels : 0

  // Calculate utilization percentage
  const utilizationPercentage = roomCapacity > 0 ? Math.min(100, (totalBoxes / roomCapacity) * 100) : 0

  return (
    <Card className="h-full">
      {selectedRoom ? (
        <>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">{selectedRoom.roomName} Details</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Capacity</div>
                  <div className="font-medium">{roomCapacity} boxes</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium">{formatDate(selectedRoom.createdDate)}</div>
                </div>
              </div>

              {/* Customer Inventory Table */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Current Inventory</h3>
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left p-2 text-sm font-medium text-muted-foreground">Variety</th>
                        <th className="text-left p-2 text-sm font-medium text-muted-foreground">Grade</th>
                        <th className="text-right p-2 text-sm font-medium text-muted-foreground">Box Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomInventory.map((item, index) => (
                        <tr key={index} className="border-b border-muted/30 hover:bg-muted/20">
                          <td className="p-2 text-sm">{item.customer}</td>
                          <td className="p-2 text-sm">{item.variety}</td>
                          <td className="p-2 text-sm">{getGradeBadge(item.grade)}</td>
                          <td className="p-2 text-sm text-right font-medium">{item.count}</td>
                        </tr>
                      ))}
                      {roomInventory.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-sm text-muted-foreground">
                            No inventory data available
                          </td>
                        </tr>
                      ) : (
                        <tr className="bg-muted/20">
                          <td colSpan={3} className="p-2 text-sm font-medium">
                            Total
                          </td>
                          <td className="p-2 text-sm text-right font-bold">{totalBoxes}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Usage Summary */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Usage Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Space Utilization</span>
                    <span className="text-sm font-medium">
                      {totalBoxes} / {roomCapacity} boxes
                    </span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{
                        width: `${utilizationPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 border-t flex justify-end">
            {onViewRoom && <Button onClick={() => onViewRoom(selectedRoom)}>View in 3D</Button>}
          </CardFooter>
        </>
      ) : (
        <CardContent className="p-6 text-center flex items-center justify-center h-full">
          <p className="text-muted-foreground">Select a room to view details</p>
        </CardContent>
      )}
    </Card>
  )
}

// TODO: Review for Stage 1 completeness

