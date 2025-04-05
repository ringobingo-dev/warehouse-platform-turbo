import { Badge } from "@/components/shared/ui/badge"

interface RoomStatusIndicatorProps {
  status: "available" | "occupied" | "maintenance" | "reserved"
}

export function RoomStatusIndicator({ status }: RoomStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "available":
        return { label: "Available", variant: "success" as const }
      case "occupied":
        return { label: "Occupied", variant: "destructive" as const }
      case "maintenance":
        return { label: "Maintenance", variant: "warning" as const }
      case "reserved":
        return { label: "Reserved", variant: "secondary" as const }
      default:
        return { label: "Unknown", variant: "outline" as const }
    }
  }

  const { label, variant } = getStatusConfig()

  return (
    <Badge variant={variant} className="text-xs font-medium">
      {label}
    </Badge>
  )
}

