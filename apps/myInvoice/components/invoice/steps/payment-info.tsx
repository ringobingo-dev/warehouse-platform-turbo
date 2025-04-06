"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building } from "lucide-react"

interface PaymentInfoProps {
  form: UseFormReturn<any>
}

export function PaymentInfo({ form }: PaymentInfoProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Payment Information:</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          <span className="text-xs">Warehouse Profile</span>
        </Badge>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" placeholder="Bank Name" {...register("bankName")} />
            {errors.bankName && <p className="text-sm text-destructive">{errors.bankName.message as string}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input id="accountName" placeholder="Account Name" {...register("accountName")} />
            {errors.accountName && <p className="text-sm text-destructive">{errors.accountName.message as string}</p>}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input id="accountNumber" placeholder="Account Number" {...register("accountNumber")} />
          {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber.message as string}</p>}
        </div>
      </div>
    </div>
  )
}

