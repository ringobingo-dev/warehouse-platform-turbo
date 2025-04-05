"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TemplateAttribute {
  name: string
  type: "text" | "select" | "date"
  options?: string[]
  isMandatory: boolean
  value?: string | number
}

interface InventoryItem {
  [key: string]: string | number | boolean
  jobId?: string
  jobStatus?: "pending" | "completed"
  boxCount?: number
}

interface AddInventoryModuleProps {
  onAddItem: (item: InventoryItem, action: "load" | "pickup") => void
  onCreatePickupJob: (job: InventoryItem) => void
  savedTemplate?: TemplateAttribute[]
  userId: string
  roomData?: {
    varieties: string[]
    grades: string[]
    growers: string[]
    generations: string[]
  }
}

export function AddInventoryModule({
  onAddItem,
  onCreatePickupJob,
  savedTemplate = [],
  userId,
  roomData,
}: AddInventoryModuleProps) {
  const [newItem, setNewItem] = useState<InventoryItem>({})
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<"load" | "pickup">("load")
  const [pickupDate, setPickupDate] = useState<string>("")

  useEffect(() => {
    if (savedTemplate.length > 0) {
      const initialValues = savedTemplate.reduce(
        (acc, attr) => ({
          ...acc,
          [attr.name]: attr.value || "",
        }),
        {} as InventoryItem,
      )
      setNewItem(initialValues)
    }
  }, [savedTemplate])

  const handleInputChange = (name: string, value: string | number) => {
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const itemWithDates = { ...newItem, pickupDate }
    if (action === "pickup") {
      const pickupJob: InventoryItem = {
        ...itemWithDates,
        userId,
        jobId: `PJ-${Date.now()}`,
        jobStatus: "pending",
      }
      onCreatePickupJob(pickupJob)
    } else {
      onAddItem(itemWithDates, action)
    }
    setNewItem({})
    setPickupDate("")
    setIsOpen(false)
  }

  if (!roomData) {
    console.warn("roomData is undefined. Using default values for varieties, grades, growers, and generations.")
  }

  const renderFormField = (attr: TemplateAttribute) => {
    // Completely remove Field Location and Delivery Date for Box Pickup action
    if (action === "pickup" && (attr.name === "Field Location" || attr.name === "Delivery Date")) {
      return null
    }

    const value = newItem[attr.name] || ""
    switch (attr.name) {
      case "Variety":
        return (
          <Select
            key={attr.name}
            name={attr.name}
            onValueChange={(value) => handleInputChange(attr.name, value)}
            value={value as string}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${attr.name}`} />
            </SelectTrigger>
            <SelectContent>
              {(roomData?.varieties || ["No varieties available"]).map((variety) => (
                <SelectItem key={variety} value={variety}>
                  {variety}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "Grade":
        return (
          <Select
            key={attr.name}
            name={attr.name}
            onValueChange={(value) => handleInputChange(attr.name, value)}
            value={value as string}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${attr.name}`} />
            </SelectTrigger>
            <SelectContent>
              {(roomData?.grades || ["No grades available"]).map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "Grower":
        return (
          <Select
            key={attr.name}
            name={attr.name}
            onValueChange={(value) => handleInputChange(attr.name, value)}
            value={value as string}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${attr.name}`} />
            </SelectTrigger>
            <SelectContent>
              {(roomData?.growers || ["No growers available"]).map((grower) => (
                <SelectItem key={grower} value={grower}>
                  {grower}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "Generation":
        return (
          <Select
            key={attr.name}
            name={attr.name}
            onValueChange={(value) => handleInputChange(attr.name, value)}
            value={value as string}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${attr.name}`} />
            </SelectTrigger>
            <SelectContent>
              {(roomData?.generations || ["No generations available"]).map((generation) => (
                <SelectItem key={generation} value={generation}>
                  {generation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "BoxCount":
        return (
          <Input
            key={attr.name}
            type="number"
            name={attr.name}
            value={value as string}
            onChange={(e) => handleInputChange(attr.name, e.target.value)}
            min="1"
          />
        )
      case "Delivery Date":
        return (
          <Input
            key={attr.name}
            type="date"
            name={attr.name}
            value={value as string}
            onChange={(e) => handleInputChange(attr.name, e.target.value)}
          />
        )
      default:
        return (
          <Input
            key={attr.name}
            type="text"
            name={attr.name}
            value={value as string}
            onChange={(e) => handleInputChange(attr.name, e.target.value)}
          />
        )
    }
  }

  const sortedTemplate = savedTemplate.sort((a, b) => {
    if (a.name === "Weight") return 1
    if (b.name === "Weight") return -1
    return 0
  })

  return (
    <div className="flex space-x-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setAction("load")}>Room Load</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{action === "load" ? "Room Load" : "Box Pickup"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {sortedTemplate && sortedTemplate.length > 0 ? (
              sortedTemplate
                .filter(
                  (attr) => action !== "pickup" || (attr.name !== "Field Location" && attr.name !== "Delivery Date"),
                )
                .map(
                  (attr) =>
                    attr.name !== "Weight" && (
                      <div key={attr.name} className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={attr.name} className="text-right">
                          {attr.name}
                          {attr.isMandatory && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="col-span-3">{renderFormField(attr)}</div>
                      </div>
                    ),
                )
            ) : (
              <div className="text-center py-4">
                <p>No template attributes found. Please set up an inventory template first.</p>
              </div>
            )}
            {action === "pickup" && (
              <div key="pickupDate" className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="pickupDate" className="text-right">
                  Pickup Date
                </Label>
                <div className="col-span-3">
                  <Input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            <Button type="submit" disabled={!sortedTemplate || sortedTemplate.length === 0 || !userId}>
              {action === "load" ? "Load" : "Create Pickup Job"} (User: {userId})
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => {
          setAction("pickup")
          setIsOpen(true)
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Box Pickup
      </Button>
    </div>
  )
}

