"use client"

import { useState } from "react"
import { Box, Package, View } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

export default function BoxesPage() {
  const [selectedBox, setSelectedBox] = useState<BoxTemplateItemProps | null>(null)
  const [showBoxView, setShowBoxView] = useState(false)

  const openBoxView = (box: BoxTemplateItemProps) => {
    setSelectedBox(box)
    setShowBoxView(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Boxes Management</h1>
      </div>
      <p className="text-muted-foreground mb-6">Manage your box inventory and templates</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Box Templates</CardTitle>
          <CardDescription>Define and manage box templates for your warehouse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="potato">Potato</TabsTrigger>
                <TabsTrigger value="fruit">Fruit</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            <BoxTemplateItem
              name="Standard Potato Box"
              category="Potato"
              dimensions="120×100×80 cm"
              material="Wood"
              isDefault={true}
              onView={openBoxView}
            />
            <BoxTemplateItem
              name="Large Apple Crate"
              category="Fruit"
              dimensions="120×100×100 cm"
              material="Plastic"
              isDefault={false}
              onView={openBoxView}
            />
            <BoxTemplateItem
              name="Small Storage Box"
              category="General"
              dimensions="60×40×40 cm"
              material="Cardboard"
              isDefault={false}
              onView={openBoxView}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3D Box View Dialog */}
      <Dialog open={showBoxView} onOpenChange={setShowBoxView}>
        <DialogContent className="sm:max-w-[800px] h-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedBox?.name} - 3D View</DialogTitle>
            <DialogDescription>
              {selectedBox?.dimensions} - {selectedBox?.material}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 bg-muted/20 rounded-md p-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">3D Box Viewer Placeholder</p>
              <p className="text-sm text-muted-foreground mb-4">
                Your existing 3D box component would be rendered here
              </p>

              {/* This is where you would render your existing 3D box component */}
              {/* Example: <Box3DViewer boxDetails={selectedBox} /> */}

              <div className="p-4 border border-dashed border-muted-foreground rounded-md">
                <div className="text-sm">
                  <p>
                    <strong>Name:</strong> {selectedBox?.name}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedBox?.category}
                  </p>
                  <p>
                    <strong>Dimensions:</strong> {selectedBox?.dimensions}
                  </p>
                  <p>
                    <strong>Material:</strong> {selectedBox?.material}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface BoxTemplateItemProps {
  name: string
  category: string
  dimensions: string
  material: string
  isDefault: boolean
  onView?: (box: BoxTemplateItemProps) => void
}

function BoxTemplateItem({ name, category, dimensions, material, isDefault, onView }: BoxTemplateItemProps) {
  const handleView = () => {
    if (onView) {
      onView({ name, category, dimensions, material, isDefault })
    }
  }

  return (
    <div className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="bg-primary/10 p-3 rounded-full mr-4">
        <Box className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-medium">{name}</h3>
          {isDefault && (
            <Badge variant="outline" className="ml-2">
              Default
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{category}</p>
      </div>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <div className="flex items-center">
          <span className="font-medium">Dimensions:</span>
          <span className="ml-1">{dimensions}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">Material:</span>
          <span className="ml-1">{material}</span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="ml-4" onClick={handleView}>
        <View className="h-4 w-4 mr-1" />
        View 3D
      </Button>
    </div>
  )
}

