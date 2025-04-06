"use client"

import { RoomVisualization } from "@/components/storage/room-visualization"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageContainer } from "@/components/page-container"

export default function StorageVisualizationPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Storage Visualization"
        description="3D visualization of your warehouse storage"
        backLink={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/storage">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Storage
            </Link>
          </Button>
        }
      />
      <PageContainer>
        <RoomVisualization />
      </PageContainer>
    </div>
  )
}

