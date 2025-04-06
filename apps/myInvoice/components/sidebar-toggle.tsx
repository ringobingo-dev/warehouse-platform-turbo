"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/lib/store"

export function SidebarToggle() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:hidden">
      <Button variant="ghost" size="icon" className="mr-4" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="font-semibold">Warehouse Invoice</div>
    </div>
  )
}

