import type React from "react"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"

export default function SidebarDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EnhancedSidebar>{children}</EnhancedSidebar>
}

// This might be a demo layout that also contains a Help button

