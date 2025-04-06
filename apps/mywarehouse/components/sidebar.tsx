"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/hooks/use-navigation"
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
import { Warehouse, LogOut } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface SidebarNavProps {
  children: React.ReactNode
}

export function SidebarNav({ children }: SidebarNavProps) {
  const { routes, isActive } = useNavigation()
  const { user, logout } = useUser()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  // Function to handle both hover and focus states
  const handleItemInteraction = (href: string, type: "hover" | "focus", isActive: boolean) => {
    if (type === "hover") {
      setHoveredItem(isActive ? href : null)
    } else {
      setFocusedItem(isActive ? href : null)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="h-16 flex items-center px-4 border-b">
            <div className="flex items-center gap-2 group/logo transition-colors hover:text-primary">
              <Warehouse className="h-6 w-6 transition-transform group-hover/logo:scale-110" />
              <h1 className="text-xl font-bold">myWarehouse</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href} className="group/menu-item relative px-2">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(route.href)}
                    className="peer/menu-button transition-colors"
                    onMouseEnter={() => handleItemInteraction(route.href, "hover", true)}
                    onMouseLeave={() => handleItemInteraction(route.href, "hover", false)}
                    onFocus={() => handleItemInteraction(route.href, "focus", true)}
                    onBlur={() => handleItemInteraction(route.href, "focus", false)}
                  >
                    <Link
                      href={route.href}
                      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors
                          ${
                            isActive(route.href)
                              ? "bg-slate-50 text-slate-900"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                    >
                      <route.icon
                        className={`mr-2 h-5 w-5 transition-colors
                          ${
                            isActive(route.href)
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
            {user ? (
              <div className="flex items-center justify-between group/profile hover:bg-muted p-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 font-medium">
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    ) : (
                      user.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center px-4">
            <div className="flex items-center">
              <SidebarTrigger className="lg:hidden" />
            </div>
            <div className="flex-1"></div>
          </header>
          <main className="p-4 flex-1 flex flex-col overflow-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

