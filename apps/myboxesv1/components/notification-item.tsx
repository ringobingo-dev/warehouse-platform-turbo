"use client"
import { Badge } from "@/components/shared/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface NotificationItemProps {
  id: string
  type: "info" | "warning" | "error" | "success"
  message: string
  timestamp: Date
  isRead: boolean
  onMarkAsRead: (id: string) => void
}

export function NotificationItem({ id, type, message, timestamp, isRead, onMarkAsRead }: NotificationItemProps) {
  const getBadgeVariant = () => {
    switch (type) {
      case "info":
        return "secondary"
      case "warning":
        return "warning"
      case "error":
        return "destructive"
      case "success":
        return "success"
      default:
        return "outline"
    }
  }

  return (
    <div className={`p-4 border-b ${isRead ? "bg-gray-50" : "bg-white"}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant() as any}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
          {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true" />}
        </div>
        <button onClick={() => onMarkAsRead(id)} className="text-xs text-gray-500 hover:text-gray-700">
          {isRead ? "Mark as unread" : "Mark as read"}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-700">{message}</p>
      <p className="mt-1 text-xs text-gray-500">{formatDistanceToNow(timestamp, { addSuffix: true })}</p>
    </div>
  )
}

