"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/hooks/use-navigation"

interface NavbarProps {
  activeTab?: string
  setActiveTab?: (tab: string) => void
  tabs?: string[]
}

export function Navbar({ activeTab, setActiveTab, tabs }: NavbarProps) {
  const router = useRouter()
  const { tabKeys, tabNames, pathname } = useNavigation()

  // Use provided tabs or default to all tab keys
  const tabsToUse = tabs || tabKeys

  // Determine current active tab
  const getCurrentTab = () => {
    if (activeTab) return activeTab

    // Try to determine from pathname
    const pathSegment = pathname.split("/")[1] || "home"
    return tabsToUse.find((tab) => tab === pathSegment) || tabsToUse[0]
  }

  const currentTab = getCurrentTab()

  // Handle tab click
  const handleTabClick = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab)
    } else {
      const route = tabNames[tab] ? `/${tab === "home" ? "" : tab}` : "/"
      router.push(route)
    }
  }

  return (
    <nav className="w-full mb-6">
      <div className="flex justify-center space-x-4 overflow-x-auto py-2">
        {tabsToUse.map((tab) => (
          <Button
            key={tab}
            variant={currentTab === tab ? "default" : "outline"}
            onClick={() => handleTabClick(tab)}
            className={cn("whitespace-nowrap")}
          >
            {tabNames[tab] || tab}
          </Button>
        ))}
      </div>
    </nav>
  )
}

