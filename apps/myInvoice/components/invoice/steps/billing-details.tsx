"use client"

import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Building, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BillingDetailsProps {
  form: UseFormReturn<any>
}

export function BillingDetails({ form }: BillingDetailsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Bill From */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Bill From:</h3>
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span className="text-xs">Warehouse Profile</span>
            </Badge>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from.name">Name</Label>
              <Input id="from.name" placeholder="Your name" {...register("from.name")} />
              {errors.from?.name && <p className="text-sm text-destructive">{errors.from.name.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="from.address">Address</Label>
              <Input id="from.address" placeholder="Your address" {...register("from.address")} />
              {errors.from?.address && (
                <p className="text-sm text-destructive">{errors.from.address.message as string}</p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from.zip">ZIP</Label>
                <Input id="from.zip" placeholder="Your ZIP code" {...register("from.zip")} />
                {errors.from?.zip && <p className="text-sm text-destructive">{errors.from.zip.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="from.city">City</Label>
                <Input id="from.city" placeholder="Your city" {...register("from.city")} />
                {errors.from?.city && <p className="text-sm text-destructive">{errors.from.city.message as string}</p>}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from.state">State/Province</Label>
                <Input id="from.state" placeholder="Your state" {...register("from.state")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from.country">Country</Label>
                <Input id="from.country" placeholder="Your country" {...register("from.country")} />
                {errors.from?.country && (
                  <p className="text-sm text-destructive">{errors.from.country.message as string}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from.email">Email</Label>
              <Input id="from.email" type="email" placeholder="Your email" {...register("from.email")} />
              {errors.from?.email && <p className="text-sm text-destructive">{errors.from.email.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="from.phone">Phone</Label>
              <Input id="from.phone" placeholder="Your phone number" {...register("from.phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from.taxId">Tax ID / GST Number</Label>
              <Input id="from.taxId" placeholder="Your tax ID" {...register("from.taxId")} />
            </div>
            <Button type="button" variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Input
            </Button>
          </div>
        </div>

        {/* Bill To */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Bill To:</h3>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Customer Profile</span>
            </Badge>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to.name">Name</Label>
              <Input id="to.name" placeholder="Receiver name" {...register("to.name")} />
              {errors.to?.name && <p className="text-sm text-destructive">{errors.to.name.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="to.contactPerson">Contact Person</Label>
              <Input id="to.contactPerson" placeholder="Contact person name" {...register("to.contactPerson")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to.address">Address</Label>
              <Input id="to.address" placeholder="Receiver address" {...register("to.address")} />
              {errors.to?.address && <p className="text-sm text-destructive">{errors.to.address.message as string}</p>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="to.zip">ZIP</Label>
                <Input id="to.zip" placeholder="Receiver ZIP code" {...register("to.zip")} />
                {errors.to?.zip && <p className="text-sm text-destructive">{errors.to.zip.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="to.city">City</Label>
                <Input id="to.city" placeholder="Receiver city" {...register("to.city")} />
                {errors.to?.city && <p className="text-sm text-destructive">{errors.to.city.message as string}</p>}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="to.state">State/Province</Label>
                <Input id="to.state" placeholder="Receiver state" {...register("to.state")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to.country">Country</Label>
                <Input id="to.country" placeholder="Receiver country" {...register("to.country")} />
                {errors.to?.country && (
                  <p className="text-sm text-destructive">{errors.to.country.message as string}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to.email">Email</Label>
              <Input id="to.email" type="email" placeholder="Receiver email" {...register("to.email")} />
              {errors.to?.email && <p className="text-sm text-destructive">{errors.to.email.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="to.phone">Phone</Label>
              <Input id="to.phone" placeholder="Receiver phone number" {...register("to.phone")} />
            </div>
            <Button type="button" variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Input
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

