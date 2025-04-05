"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface NewCustomerModuleProps {
  onInvite: (customerData: CustomerData) => void
}

interface CustomerData {
  name: string
  type: string
  email: string
  status: string
  invitedBy?: string
}

const customerTypes = [
  { value: "warehouseOwner", label: "Warehouse Owner" },
  { value: "roomRenter", label: "Room Renter" },
  { value: "logisticsPartner", label: "Logistics Partner" },
  { value: "merchant", label: "Merchant" },
]

export function NewCustomerModule({ onInvite }: NewCustomerModuleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    type: "",
    email: "",
    status: "",
  })

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInvite = async () => {
    if (!customerData.name || !customerData.type || !customerData.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate API call to create customer in dev-Customer table
      const newCustomer = {
        ...customerData,
        status: "pending",
        invitedBy: "current-user-id", // Replace with actual user ID of the inviting customer
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate WorkOS authentication request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onInvite(newCustomer)
      setIsOpen(false)
      setCustomerData({ name: "", type: "", email: "", status: "" })
      toast({
        title: "Success",
        description: `Customer invited successfully. An email has been sent to ${newCustomer.email} with further instructions.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invite customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Invite Customer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New Customer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={customerData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={customerData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select customer type" />
              </SelectTrigger>
              <SelectContent>
                {customerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleInvite} className="w-full">
          Send Invite and Create Association
        </Button>
      </DialogContent>
    </Dialog>
  )
}

