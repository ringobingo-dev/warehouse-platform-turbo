import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface StackListItem {
  id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  date: string
  priority?: "low" | "medium" | "high"
  contactInfo?: string
}

interface StackListProps {
  items: StackListItem[]
  title: string
  emptyMessage?: string
  maxItems?: number
}

export const StackList: React.FC<StackListProps> = ({
  items,
  title,
  emptyMessage = "No items to display",
  maxItems = 5,
}) => {
  const displayItems = items.slice(0, maxItems)

  const getStatusColor = (status: StackListItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: StackListItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {displayItems.length > 0 ? (
          <div className="space-y-3">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{item.title}</div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    {item.priority && (
                      <Badge variant="outline" className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                {item.description && (
                  <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{item.description}</div>
                )}
                {item.contactInfo && (
                  <div className="text-sm text-muted-foreground mt-1">Contact: {item.contactInfo}</div>
                )}
                <div className="text-xs text-muted-foreground mt-2">{item.date}</div>
              </div>
            ))}
            {items.length > maxItems && (
              <div className="text-sm text-center text-muted-foreground pt-2">
                +{items.length - maxItems} more items
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">{emptyMessage}</div>
        )}
      </CardContent>
    </Card>
  )
}

