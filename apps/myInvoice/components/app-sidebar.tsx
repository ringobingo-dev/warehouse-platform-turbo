"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, FileText, Settings, Users, Warehouse, Box, Mail } from "lucide-react"

import { useUIStore } from "@/lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AppSidebar() {
  const { sidebarCollapsed } = useUIStore()
  const pathname = usePathname()

  // Navigation items for the sidebar
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Invoice Templates", href: "/invoice_template", icon: FileText },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Storage", href: "/storage", icon: Warehouse },
    { name: "Boxes", href: "/boxes", icon: Box },
    { name: "Email Job Templates", href: "/email-templates", icon: Mail },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  // Default user info
  const firstName = "Dev"
  const lastName = "User"
  const email = "dev@example.com"
  const initials = `${firstName[0]}${lastName[0]}`

  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-background transition-all duration-300 ${
        sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1 text-primary-foreground">
            <Warehouse className="h-6 w-6" />
          </div>
          <div className="font-semibold">Warehouse Invoice</div>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{`${firstName} ${lastName}`}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

