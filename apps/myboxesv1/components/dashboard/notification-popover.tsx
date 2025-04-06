"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { Button } from "@/components/shared/ui/button"
import { Bell } from "lucide-react"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

interface NotificationPopoverProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onViewAll: () => void
}

export function NotificationPopover({ notifications, onMarkAsRead, onViewAll }: NotificationPopoverProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View all
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
          ) : (
            <div className="grid gap-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${notification.read ? "bg-background" : "bg-muted"}`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

