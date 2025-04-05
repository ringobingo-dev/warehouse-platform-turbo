"use client"

import type React from "react"
import Box3DRenderer from "./3d-box-renderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBoxContext } from "@/contexts/BoxContext"

interface StorageRoomPreviewProps {
  className?: string
}

const StorageRoomPreview: React.FC<StorageRoomPreviewProps> = ({ className = "" }) => {
  const { rows, columns, stackHeight } = useBoxContext()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Storage Room Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Current configuration: {rows} rows × {columns} columns × {stackHeight} height
          </p>
        </div>
        <div className="aspect-video relative overflow-hidden rounded border">
          <Box3DRenderer height={400} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default StorageRoomPreview

