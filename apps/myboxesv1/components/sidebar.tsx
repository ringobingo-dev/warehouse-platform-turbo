"use client"

import * as React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Box,
  LayoutDashboard,
  CuboidIcon as Cube,
  ClipboardList,
  Settings,
  Search,
  PlusSquare,
  Briefcase,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
// NX: This utility is used across multiple files
import { cn } from "../lib/utils"
// NX: This component is used across multiple pages
import { Button } from "@/components/shared/ui/button"
// NX: This component is used for scrollable content
import { ScrollArea } from "./ui/scroll-area"
// REMOVED: import { NavLink } from "./nav-link"

// moved to shared folder for reuse and NX prep

interface SidebarProps {
  className?: string
  items: {
    title: string
    href: string
    icon?: React.ReactNode
  }[]
}

function SidebarComponent({ className, items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Navigation</h2>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-1">
              {items.map((item) => (
                // REPLACED NavLink with Link
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

// possible duplicate — review for consolidation

interface SidebarNavProps {
  children: React.ReactNode
}

export function SidebarNav({ children }: SidebarNavProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  // Updated routes array with correct paths
  const routes = [
    {
      title: "My Rooms",
      href: "/dimensions",
      icon: LayoutDashboard,
    },
    {
      title: "Add Room",
      href: "/add-room",
      icon: PlusSquare,
    },
    {
      title: "3D View",
      href: "/3d-view",
      icon: Cube,
    },
    {
      title: "Box Search",
      href: "/box-search",
      icon: Search,
    },
    {
      title: "Box Maintenance",
      href: "/maintenance",
      icon: Box,
    },
    {
      title: "Log & Snapshots",
      href: "/log-snapshots",
      icon: ClipboardList,
    },
    {
      title: "My Jobs",
      href: "/jobs",
      icon: Briefcase,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

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

  // Improved active state detection
  const isRouteActive = (href: string) => {
    // Exact match
    if (pathname === href) return true

    // Special case for dimensions/room-dimensions
    if (href === "/dimensions" && pathname === "/room-dimensions") return true

    // Handle index routes
    if (href !== "/" && pathname.startsWith(`${href}/`)) return true

    return false
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="h-16 flex items-center px-4 border-b">
            <h1 className="text-xl font-bold">3D Box Viewer</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href} className="group/menu-item relative">
                  <SidebarMenuButton
                    asChild
                    isActive={isRouteActive(route.href)}
                    className="transition-colors duration-200"
                  >
                    <Link
                      href={route.href}
                      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors duration-200
                        ${
                          isRouteActive(route.href)
                            ? "bg-slate-50 text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      onMouseEnter={() => handleItemInteraction(route.href, "hover", true)}
                      onMouseLeave={() => handleItemInteraction(route.href, "hover", false)}
                      onFocus={() => handleItemInteraction(route.href, "focus", true)}
                      onBlur={() => handleItemInteraction(route.href, "focus", false)}
                    >
                      <route.icon
                        className={`mr-2 h-5 w-5 transition-colors duration-200
                        ${
                          isRouteActive(route.href)
                            ? "text-slate-900"
                            : "text-slate-600 group-hover/menu-item:text-slate-900"
                        }`}
                      />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  MB
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">MyBoxes</p>
                  <p className="text-xs text-muted-foreground">3D Box Viewer</p>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="h-16 border-b flex items-center px-4">
            <div className="flex items-center">
              <SidebarTrigger className="lg:hidden" onClick={() => setIsMobileOpen(!isMobileOpen)} />
            </div>
            <div className="flex-1"></div>
          </header>
          <main className="p-4 flex-1 flex flex-col overflow-hidden w-full max-w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

