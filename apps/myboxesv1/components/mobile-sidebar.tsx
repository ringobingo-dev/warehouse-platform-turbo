"use client"
// NX: These components are used for the mobile slide-out menu
import type React from "react"

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
// NX: This component is used across multiple pages
import { Button } from "./ui/button"
// NX: This component is used for navigation
import { Sidebar } from "./sidebar"
import { Menu } from "lucide-react"

interface MobileSidebarProps {
  items: {
    title: string
    href: string
    icon?: React.ReactNode
  }[]
}

export function MobileSidebar({ items }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Sidebar items={items} className="border-none" />
      </SheetContent>
    </Sheet>
  )
}

// TODO: Review for Stage 1 completeness

