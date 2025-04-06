"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Box, History, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarNav({ className }: { className?: string }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Box Search", href: "/box-search", icon: Box },
    { name: "Log Snapshots", href: "/log-snapshots", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            pathname === item.href ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
            "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
          )}
        >
          <item.icon
            className={cn(
              pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-gray-300",
              "mr-3 flex-shrink-0 h-5 w-5",
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

