"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface InventoryTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSaveTemplate: (templateName: string, attributes: TemplateAttribute[]) => void
}

interface TemplateAttribute {
  name: string
  type: "text" | "select" | "date"
  options?: string[]
  isMandatory: boolean
  value: string
}

const InventoryTemplateDialog: React.FC<InventoryTemplateDialogProps> = ({ isOpen, onClose, onSaveTemplate }) => {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templateAttributes, setTemplateAttributes] = useState<TemplateAttribute[]>([
    { name: "Variety", type: "text", isMandatory: true, value: "" },
    { name: "Type", type: "select", options: ["table", "seed"], isMandatory: true, value: "table" },
    { name: "Grade", type: "text", isMandatory: true, value: "" },
    { name: "Grower", type: "select", options: ["Grower 1", "Grower 2", "Grower 3"], isMandatory: true, value: "" },
    { name: "Timestamp", type: "date", isMandatory: true, value: "" },
    { name: "Weight", type: "text", isMandatory: false, value: "" },
    { name: "Generation", type: "text", isMandatory: false, value: "" },
    { name: "Field Location", type: "text", isMandatory: false, value: "" },
  ])
  const [newAttributeName, setNewAttributeName] = useState("")

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    // Initialize template attributes based on selection
    const initialAttributes =
      template === "Potatoes"
        ? [
            { name: "Variety", type: "text", isMandatory: true, value: "" },
            { name: "Type", type: "select", options: ["table", "seed"], isMandatory: true, value: "table" },
            { name: "Grade", type: "text", isMandatory: true, value: "" },
            {
              name: "Grower",
              type: "select",
              options: ["Grower 1", "Grower 2", "Grower 3"],
              isMandatory: true,
              value: "",
            },
            { name: "Timestamp", type: "date", isMandatory: true, value: "" },
            { name: "Weight", type: "text", isMandatory: false, value: "" },
            { name: "Generation", type: "text", isMandatory: false, value: "" },
            { name: "Field Location", type: "text", isMandatory: false, value: "" },
          ]
        : []
    setTemplateAttributes(initialAttributes)
    setStep(2)
  }

  const handleAttributeChange = (index: number, value: string) => {
    const updatedAttributes = [...templateAttributes]
    updatedAttributes[index].value = value
    setTemplateAttributes(updatedAttributes)
  }

  const handleAddAttribute = () => {
    if (newAttributeName) {
      setTemplateAttributes([
        ...templateAttributes,
        { name: newAttributeName, type: "text", isMandatory: false, value: "" },
      ])
      setNewAttributeName("")
    }
  }

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      onSaveTemplate(selectedTemplate, templateAttributes)
      console.log("Saving template:", selectedTemplate, templateAttributes)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inventory Template</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Select a template to modify" : "Customize your template"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleTemplateSelect("Potatoes")}>Potatoes</Button>
            <Button onClick={() => handleTemplateSelect("Cherries")}>Cherries</Button>
            <Button onClick={() => handleTemplateSelect("Onions")}>Onions</Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {templateAttributes.map((attr, index) => (
              <div key={attr.name} className="grid grid-cols-3 items-center gap-4">
                {(attr.name === "Generation" || attr.name === "Field Location") && (
                  <Checkbox
                    id={`checkbox-${attr.name}`}
                    checked={attr.isMandatory}
                    onCheckedChange={(checked) => {
                      const updatedAttributes = [...templateAttributes]
                      updatedAttributes[index].isMandatory = checked as boolean
                      setTemplateAttributes(updatedAttributes)
                    }}
                  />
                )}
                <div
                  className={`grid grid-cols-3 items-center gap-4 flex-grow ${attr.name === "Generation" || attr.name === "Field Location" ? "col-span-2" : "col-span-3"}`}
                >
                  <Label htmlFor={attr.name} className="text-right">
                    {attr.name}
                  </Label>
                  {attr.type === "select" ? (
                    <Select value={attr.value} onValueChange={(value) => handleAttributeChange(index, value)}>
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder={`Select ${attr.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {attr.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : attr.type === "date" ? (
                    <Input
                      id={attr.name}
                      type="date"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, e.target.value)}
                      className="col-span-2"
                    />
                  ) : (
                    <Input
                      id={attr.name}
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, e.target.value)}
                      className="col-span-2"
                    />
                  )}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-attribute" className="text-right">
                New Attribute
              </Label>
              <Input
                id="new-attribute"
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                className="col-span-2"
                placeholder="Enter attribute name"
              />
              <Button onClick={handleAddAttribute} className="col-span-1">
                Add
              </Button>
            </div>
            <Button onClick={handleSaveTemplate} variant="primary">
              Save Template
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default InventoryTemplateDialog

