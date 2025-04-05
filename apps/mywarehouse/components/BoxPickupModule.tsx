"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface InventoryItem {
  id: string
  [key: string]: string | number
}

interface PickupJob {
  jobId: string
  itemId: string
  quantity: number
  pickupDate: string
  status: "pending" | "completed"
  userId: string
}

interface BoxPickupModuleProps {
  onCreatePickupJob: (job: PickupJob) => void
  inventoryItems: InventoryItem[]
  userId: string
}

export function BoxPickupModule({ onCreatePickupJob, inventoryItems, userId }: BoxPickupModuleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [pickupDate, setPickupDate] = useState<string>("")

  const handleCreateJob = () => {
    if (selectedItemId) {
      const newJob: PickupJob = {
        jobId: `PJ-${Date.now()}`,
        itemId: selectedItemId,
        quantity: quantity,
        pickupDate: pickupDate,
        status: "pending",
        userId: userId,
      }
      onCreatePickupJob(newJob)
      setSelectedItemId(null)
      setQuantity(1)
      setPickupDate("")
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">Box Pickup</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Box Pickup Job</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-select" className="text-right">
              Select Item
            </Label>
            <Select value={selectedItemId || ""} onValueChange={(value) => setSelectedItemId(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an item for pickup" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {`${item.Type} - ${item.Variety} (${item.weight} kg)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
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
          <Button onClick={handleCreateJob} disabled={!selectedItemId} className="col-span-4">
            Create Pickup Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

