"use client"
import { useRouter } from "next/navigation"
import { Grid3x3, Layers, Calendar, ArrowRight, Thermometer, Warehouse, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/shared/ui/card"
import { Button } from "@/components/shared/ui/button"
import { Badge } from "@/components/shared/ui/badge"

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

interface AvailableRoomsTableProps {
  rooms: SavedRoom[]
  selectedRoomId: string | null
  onSelectRoom: (room: SavedRoom) => void
  onViewRoom: (room: SavedRoom) => void
}

export function AvailableRoomsTable({ rooms, selectedRoomId, onSelectRoom, onViewRoom }: AvailableRoomsTableProps) {
  const router = useRouter()

  const getRoomTypeIcon = (roomType: string) => {
    switch (roomType) {
      case "cold-storage":
        return <Thermometer className="h-5 w-5" />
      case "dry-storage":
        return <Warehouse className="h-5 w-5" />
      case "climate-controlled":
        return <Building2 className="h-5 w-5" />
      default:
        return <Warehouse className="h-5 w-5" />
    }
  }

  const getRoomTypeText = (roomType: string) => {
    switch (roomType) {
      case "cold-storage":
        return "Cold Storage"
      case "dry-storage":
        return "Dry Storage"
      case "climate-controlled":
        return "Climate Controlled"
      default:
        return "Unknown"
    }
  }

  const getRoomCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      potatoes: "bg-amber-100 text-amber-800 border-amber-200",
      onions: "bg-purple-100 text-purple-800 border-purple-200",
      cherries: "bg-red-100 text-red-800 border-red-200",
      default: "bg-blue-100 text-blue-800 border-blue-200",
    }

    const color = colors[category] || colors.default

    return (
      <Badge variant="outline" className={`${color} capitalize`}>
        {category}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Available Rooms</h2>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`w-full hover:shadow-md transition-shadow cursor-pointer border-2 ${
              selectedRoomId === room.id ? "border-primary" : "border-transparent"
            }`}
            onClick={() => onSelectRoom(room)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{room.roomName}</h3>
                  {getRoomCategoryBadge(room.roomCategory)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getRoomTypeIcon(room.roomType)}
                  <span>{getRoomTypeText(room.roomType)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Dimensions</div>
                    <div className="font-medium">
                      {room.length}m × {room.width}m
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Grid</div>
                    <div className="font-medium">
                      {room.rows.count} × {room.columns.count} × {room.levels}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Created</div>
                    <div className="font-medium">{formatDate(room.createdDate)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 hover:bg-primary hover:text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewRoom(room)
                    }}
                  >
                    View <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {rooms.length === 0 && (
          <div className="text-center p-8 border rounded-lg bg-muted/10 w-full">
            <p className="text-muted-foreground">No saved rooms found. Create a new room to get started.</p>
            <Button onClick={() => router.push("/add-room")} className="mt-4">
              Add New Room
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

