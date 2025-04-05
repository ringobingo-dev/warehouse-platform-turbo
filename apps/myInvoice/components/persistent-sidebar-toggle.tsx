"use client"

import { Menu, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/lib/store"

export function PersistentSidebarToggle() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed left-4 top-4 z-30 h-8 w-8 rounded-full shadow-md"
      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
    >
      {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

