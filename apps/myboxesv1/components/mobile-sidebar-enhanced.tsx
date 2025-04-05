"use client"

import { useState } from "react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNavigation } from "@/hooks/useNavigation"

export function MobileSidebarEnhanced() {
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
    <TooltipProvider>
      <div className="fixed left-0 top-0 bottom-0 z-40 w-14 bg-background border-r lg:hidden flex flex-col items-center py-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-6">
          <span className="text-sm font-bold">3D</span>
        </div>

        <nav className="flex flex-col items-center space-y-4 flex-1">
          {routes.map((route) => (
            <Tooltip key={route.href} delayDuration={300}>
              <TooltipTrigger asChild>
                <Link
                  href={route.href}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${
                    isActive(route.href)
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  aria-label={route.title}
                  onMouseEnter={() => handleItemInteraction(route.href, "hover", true)}
                  onMouseLeave={() => handleItemInteraction(route.href, "hover", false)}
                  onFocus={() => handleItemInteraction(route.href, "focus", true)}
                  onBlur={() => handleItemInteraction(route.href, "focus", false)}
                >
                  <route.icon
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isActive(route.href) ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{route.title}</TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <div className="mt-auto">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                aria-label="User Profile"
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                  DU
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">User Profile</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

