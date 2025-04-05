"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { BoxModel } from "@/components/box-model"
import { useBoxStore } from "@/store/boxStore"
import type { BoxTemplate } from "@/types/BoxTemplate"

interface BoxTemplateConfigProps {
  className?: string
}

export function BoxTemplateConfig({ className }: BoxTemplateConfigProps) {
  const {
    boxTemplates,
    selectedTemplateId,
    addBoxTemplate,
    updateBoxTemplate,
    setSelectedTemplateId,
    getSelectedTemplate,
  } = useBoxStore()

  const [newTemplate, setNewTemplate] = useState<BoxTemplate>({ id: "", name: "", width: 0, height: 0, depth: 0 })
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    const selectedTemplate = getSelectedTemplate()
    if (selectedTemplate) {
      setNewTemplate(selectedTemplate)
    } else {
      setNewTemplate({ id: "", name: "", width: 0, height: 0, depth: 0 })
    }
  }, [selectedTemplateId, getSelectedTemplate])

  const handleBoxTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!newTemplate.name) {
      setValidationError("Template name is required")
      return
    }

    if (newTemplate.width <= 0 || newTemplate.height <= 0 || newTemplate.depth <= 0) {
      setValidationError("All dimensions must be greater than zero")
      return
    }

    setValidationError(null)

    if (newTemplate.name && newTemplate.width && newTemplate.height && newTemplate.depth) {
      if (newTemplate.id) {
        updateBoxTemplate(newTemplate)
      } else {
        const updatedTemplate = { ...newTemplate, id: Date.now().toString() }
        addBoxTemplate(updatedTemplate)
      }
      setNewTemplate({ id: "", name: "", width: 0, height: 0, depth: 0 })
      setSelectedTemplateId(null)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Box Template Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-6">
              <Label htmlFor="template-select">Templates</Label>
              <Select value={selectedTemplateId || ""} onValueChange={setSelectedTemplateId}>
                <SelectTrigger id="template-select">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {boxTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Rectangle Box Template Preview</h3>
              <div className="border rounded-md p-4 bg-muted/20">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">Rectangle Box Properties</h4>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                        <dt className="text-muted-foreground">Width:</dt>
                        <dd>{getSelectedTemplate()?.width || "Variable"}</dd>
                        <dt className="text-muted-foreground">Height:</dt>
                        <dd>{getSelectedTemplate()?.height || "Variable"}</dd>
                        <dt className="text-muted-foreground">Depth:</dt>
                        <dd>{getSelectedTemplate()?.depth || "Variable"}</dd>
                        <dt className="text-muted-foreground">Material:</dt>
                        <dd>{"Standard"}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {validationError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <p className="text-red-700">{validationError}</p>
              </div>
            )}

            <form onSubmit={handleBoxTemplateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="boxName">Template Name</Label>
                <Input
                  id="boxName"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label className="mb-2 block">Box Dimensions (m)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="boxWidth" className="text-sm text-muted-foreground">
                      Width (m)
                    </Label>
                    <Input
                      id="boxWidth"
                      type="number"
                      value={newTemplate.width || ""}
                      onChange={(e) => setNewTemplate({ ...newTemplate, width: Number(e.target.value) })}
                      min={0.1}
                      step={0.1}
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <Label htmlFor="boxHeight" className="text-sm text-muted-foreground">
                      Height (m)
                    </Label>
                    <Input
                      id="boxHeight"
                      type="number"
                      value={newTemplate.height || ""}
                      onChange={(e) => setNewTemplate({ ...newTemplate, height: Number(e.target.value) })}
                      min={0.1}
                      step={0.1}
                      placeholder="Height"
                    />
                  </div>
                  <div>
                    <Label htmlFor="boxDepth" className="text-sm text-muted-foreground">
                      Depth (m)
                    </Label>
                    <Input
                      id="boxDepth"
                      type="number"
                      value={newTemplate.depth || ""}
                      onChange={(e) => setNewTemplate({ ...newTemplate, depth: Number(e.target.value) })}
                      min={0.1}
                      step={0.1}
                      placeholder="Depth"
                    />
                  </div>
                </div>
              </div>
              <Button type="submit">{newTemplate.id ? "Update" : "Add"} Box Template</Button>
            </form>
          </div>

          {newTemplate.width > 0 && newTemplate.height > 0 && newTemplate.depth > 0 && (
            <div className="flex-1 lg:min-w-[400px]">
              <h3 className="text-lg font-semibold mb-2">Template Preview</h3>
              <div className="h-64 lg:h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <Canvas>
                  <PerspectiveCamera makeDefault position={[3, 3, 3]} />
                  <OrbitControls />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <BoxModel
                    position={[0, 0, 0]}
                    dimensions={[newTemplate.width, newTemplate.height, newTemplate.depth]}
                    color="#e5d3b3"
                    name={newTemplate.name || "Template Preview"}
                    customerInitials="ABC"
                    varietyName="Sample"
                    grade="A"
                    loadingDate="2025-03-07"
                  />
                </Canvas>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  Dimensions: {newTemplate.width}m × {newTemplate.height}m × {newTemplate.depth}m
                </p>
                <p>Volume: {(newTemplate.width * newTemplate.height * newTemplate.depth).toFixed(2)} m³</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

