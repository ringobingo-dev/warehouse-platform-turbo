"use client"

import { useState } from "react"
import { SidebarNavEnhanced } from "@/components/sidebar-enhanced"
import { MobileSidebarEnhanced } from "@/components/mobile-sidebar-enhanced"
import { NavbarEnhanced } from "@/components/navbar-enhanced"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NavigationTestPage() {
  const [activeTab, setActiveTab] = useState("dimensions")
  const [showMobile, setShowMobile] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Navigation Test Page</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Navbar</CardTitle>
            <CardDescription>
              Tests the enhanced navbar component with the centralized routes configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NavbarEnhanced
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={["dimensions", "3d-view", "box-search", "maintenance"]}
            />
            <div className="p-4 border rounded-md">
              <p>Active Tab: {activeTab}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Sidebar Toggle</CardTitle>
            <CardDescription>Toggle to show/hide the enhanced mobile sidebar</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowMobile(!showMobile)}>
              {showMobile ? "Hide Mobile Sidebar" : "Show Mobile Sidebar"}
            </Button>
            {showMobile && <MobileSidebarEnhanced />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Full Layout Preview</CardTitle>
            <CardDescription>Preview the enhanced sidebar with content</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border rounded-md overflow-hidden" style={{ height: "400px" }}>
              <SidebarNavEnhanced>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Content Area</h2>
                  <p>This is where your page content would appear.</p>
                </div>
              </SidebarNavEnhanced>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

