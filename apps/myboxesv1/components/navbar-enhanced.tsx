"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/hooks/useNavigation"

interface NavbarProps {
  activeTab?: string
  setActiveTab?: (tab: string) => void
  tabs?: string[]
}

export function NavbarEnhanced({ activeTab, setActiveTab, tabs }: NavbarProps) {
  const router = useRouter()
  const { tabKeys, tabNames, pathname } = useNavigation()

  // Use provided tabs or default to all tab keys
  const tabsToUse = (tabs || tabKeys).filter((tab) => tab !== "help")

  // Determine current active tab from pathname if not provided
  const getCurrentTab = () => {
    if (activeTab) return activeTab

    // Extract first path segment
    const path = pathname.split("/")[1] || "dimensions"
    // Handle the room-dimensions -> dimensions mapping
    return path === "room-dimensions" ? "dimensions" : path
  }

  const currentTab = getCurrentTab()

  // Handle tab click - use provided setActiveTab or navigate with router
  const handleTabClick = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab)
    } else {
      router.push(`/${tab}`)
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

// TODO: Review for Stage 1 completeness
// This file likely contains @/ imports that need to be updated
// possible duplicate — review for consolidation (with navbar.tsx)

