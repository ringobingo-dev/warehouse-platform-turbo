"use client"

import type * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/hooks/useNavigation"

interface SidebarNavProps {
  children: React.ReactNode
}

export function SidebarNavEnhanced({ children }: SidebarNavProps) {
  const { routes, isActive } = useNavigation()

  // Add hover state management
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  const handleItemInteraction = (id: string, type: "hover" | "focus", isActive: boolean) => {
    if (type === "hover") {
      setHoveredItem(isActive ? id : null)
    } else {
      setFocusedItem(isActive ? id : null)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block w-64 border-r">
        <div className="h-16 flex items-center px-4 border-b">
          <h1 className="text-xl font-bold">3D Box Viewer</h1>
        </div>
        <nav className="p-2 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 group/menu-item",
                isActive(route.href)
                  ? "bg-slate-50 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
              onMouseEnter={() => handleItemInteraction(route.href, "hover", true)}
              onMouseLeave={() => handleItemInteraction(route.href, "hover", false)}
              onFocus={() => handleItemInteraction(route.href, "focus", true)}
              onBlur={() => handleItemInteraction(route.href, "focus", false)}
            >
              <route.icon
                className={cn(
                  "mr-2 h-5 w-5 transition-colors duration-200",
                  isActive(route.href) ? "text-slate-900" : "text-slate-600 group-hover/menu-item:text-slate-900",
                )}
              />
              <span>{route.title}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 p-4 border-t w-64">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              DU
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <header className="h-16 border-b flex items-center px-4">
          <div className="flex-1"></div>
        </header>
        <main className="p-4 flex-1 flex flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}

// TODO: Review for Stage 1 completeness
// This file likely contains @/ imports that need to be updated
// possible duplicate — review for consolidation (with sidebar.tsx, mobile-sidebar.tsx)

