import { Thermometer, Warehouse, Building2 } from "lucide-react"

interface RoomSummaryProps {
  roomName: string
  roomType: string
  roomShape: string
}

export function RoomSummary({ roomName, roomType, roomShape }: RoomSummaryProps) {
  const getRoomTypeIcon = () => {
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

  const getRoomShapeText = () => {
    switch (roomShape) {
      case "square":
        return "Square"
      case "rectangle":
        return "Rectangle"
      case "split-side":
        return "Split Side"
      default:
        return "Not specified"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Room Name</h4>
        <p className="font-medium">{roomName}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Room Type</h4>
        <div className="flex items-center gap-2">
          {getRoomTypeIcon()}
          <p className="font-medium">
            {roomType === "cold-storage"
              ? "Cold Storage"
              : roomType === "dry-storage"
                ? "Dry Storage"
                : "Climate Controlled"}
          </p>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Room Shape</h4>
        <p className="font-medium">{getRoomShapeText()}</p>
      </div>
    </div>
  )
}

