"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, Users, Package, Settings, MoreHorizontal, Star, ChevronDown } from "lucide-react"

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

// Example workspace items
const workspaceItems = [
  {
    title: "Workspace 1",
    items: [
      { title: "Item 1", href: "/workspace-1/item-1" },
      { title: "Item 2", href: "/workspace-1/item-2" },
    ],
  },
  {
    title: "Workspace 2",
    items: [
      { title: "Item 1", href: "/workspace-2/item-1" },
      { title: "Item 2", href: "/workspace-2/item-2" },
    ],
  },
]

export function SidebarHoverTechniques() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [openWorkspaces, setOpenWorkspaces] = useState<Record<string, boolean>>({})

  // Toggle workspace open/closed state
  const toggleWorkspace = (title: string) => {
    setOpenWorkspaces((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Function to check if a route is active
  const isActive = (href: string) => {
    // In a real app, you would compare with the current path
    return href === "/"
  }

  return (
    <div className="w-64 border-r h-screen bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-6">Hover Techniques</h2>

        <div className="space-y-6">
          {/* Technique 1: Tailwind Group Hover */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tailwind Group Hover</h3>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href} className="group/menu-item relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                      ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>

                  {/* Action button that appears on hover using group-hover */}
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

          {/* Technique 2: Peer Hover */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Peer Hover</h3>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`peer/menu-button flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                      ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>

                  {/* Action button that changes style on peer hover */}
                  <button
                    className="absolute right-2 top-2 p-1 rounded-md text-muted-foreground peer-hover/menu-button:text-foreground transition-colors hover:bg-accent"
                    aria-label="More options"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Technique 3: React State for Complex Hover Logic */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">React State Hover</h3>
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
                      ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>

                  {/* Conditional rendering based on hover state */}
                  {hoveredItem === item.href && (
                    <div className="absolute right-2 top-2 flex gap-1 animate-in fade-in duration-200">
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

          {/* Technique 4: Collapsible Sections with Hover */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Collapsible with Hover</h3>
            <ul className="space-y-1">
              {workspaceItems.map((workspace) => (
                <li key={workspace.title} className="group/workspace">
                  {/* Workspace header with hover effect */}
                  <button
                    onClick={() => toggleWorkspace(workspace.title)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <span>{workspace.title}</span>
                    <div className="flex items-center">
                      {/* Action button that appears on hover */}
                      <button
                        className="p-1 rounded-md opacity-0 group-hover/workspace:opacity-100 transition-opacity hover:bg-accent mr-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`Settings for ${workspace.title}`)
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </button>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openWorkspaces[workspace.title] ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Collapsible content */}
                  {openWorkspaces[workspace.title] && (
                    <ul className="mt-1 ml-4 pl-2 border-l border-border">
                      {workspace.items.map((item) => (
                        <li key={item.href} className="group/item">
                          <Link
                            href={item.href}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

