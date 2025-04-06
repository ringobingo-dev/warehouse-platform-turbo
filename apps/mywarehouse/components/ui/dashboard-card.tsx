import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardCardProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="w-6 h-6 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

