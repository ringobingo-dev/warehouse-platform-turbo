"use client"

import LogDisplay from "@/components/log-display"
import { SnapshotListContainer } from "@/components/SnapshotListContainer"
import { useBoxContext } from "@/context/BoxContext"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ScheduledSnapshots } from "@/components/scheduled-snapshots"
import { useEffect, useState } from "react"

export default function LogSnapshotsPage() {
  // Add a state to track if the context is loaded
  const [isContextLoaded, setIsContextLoaded] = useState(false)
  const boxContext = useBoxContext()

  // Safely access the exportData function
  const handleExportData = () => {
    if (boxContext && boxContext.exportData) {
      boxContext.exportData()
    } else {
      console.error("Export data function is not available")
    }
  }

  // Check if context is loaded
  useEffect(() => {
    if (boxContext) {
      setIsContextLoaded(true)
    }
  }, [boxContext])

  // Apply full-width styles to parent containers
  useEffect(() => {
    // Apply styles to all parent containers
    const applyFullWidthStyles = () => {
      // Target the main element
      const mainElement = document.querySelector("main")
      if (mainElement) {
        mainElement.style.maxWidth = "100%"
        mainElement.style.width = "100%"
        mainElement.style.padding = "0"
      }

      // Target all parent flex containers
      const flexContainers = document.querySelectorAll(".flex-1, .flex")
      flexContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.style.maxWidth = "100%"
          container.style.width = "100%"
        }
      })

      // Target any container with max-width constraints
      const containers = document.querySelectorAll(".container, .mx-auto, [class*='max-w-']")
      containers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.style.maxWidth = "100%"
          container.style.width = "100%"
        }
      })
    }

    // Apply styles immediately and on resize
    applyFullWidthStyles()
    window.addEventListener("resize", applyFullWidthStyles)

    return () => {
      window.removeEventListener("resize", applyFullWidthStyles)

      // Clean up styles when component unmounts
      const mainElement = document.querySelector("main")
      if (mainElement) {
        mainElement.style.maxWidth = ""
        mainElement.style.width = ""
        mainElement.style.padding = ""
      }
    }
  }, [])

  return (
    <div className="w-full bg-gray-50" style={{ maxWidth: "100%", width: "100%" }}>
      {/* Header with background */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Log & Snapshots</h1>
            <div className="flex justify-end">
              <Button
                onClick={handleExportData}
                className="export-button flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                disabled={!isContextLoaded}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isContextLoaded ? (
          <>
            <div className="w-full">
              <ScheduledSnapshots />
            </div>

            <div className="w-full">
              <LogDisplay />
            </div>

            <div className="w-full">
              <SnapshotListContainer />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-gray-500">Loading data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

