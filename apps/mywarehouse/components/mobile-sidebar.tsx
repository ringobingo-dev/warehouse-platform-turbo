"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useNavigation } from "@/hooks/use-navigation"
import Link from "next/link"

export function MobileSidebar() {
  const { routes, isActive } = useNavigation()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive(route.href)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <route.icon className="mr-2 h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

