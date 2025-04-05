"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, Users, Package, Settings, MoreHorizontal, Star } from "lucide-react"

// Example navigation items
const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function SidebarHoverExample() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Function to check if a route is active
  const isActive = (href: string) => {
    // In a real app, you would compare with the current path
    return href === "/"
  }

  return (
    <div className="w-64 border-r h-screen bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Hover Examples</h2>

        {/* Basic hover effect */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">1. Basic Hover</h3>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                    ${isActive(item.href) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Group hover effect */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">2. Group Hover</h3>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href} className="group/menu-item relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                    ${isActive(item.href) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>

                {/* Action button that appears on hover */}
                <button
                  className="absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover/menu-item:opacity-100 transition-opacity hover:bg-accent"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* React state hover effect */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">3. React State Hover</h3>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                    ${isActive(item.href) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>

                {/* Conditional rendering based on hover state */}
                {hoveredItem === item.href && (
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button className="p-1 rounded-md hover:bg-accent" aria-label="Favorite">
                      <Star className="h-4 w-4 text-yellow-500" />
                    </button>
                    <button className="p-1 rounded-md hover:bg-accent" aria-label="More options">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

