"use client"
import type { UseFormReturn } from "react-hook-form"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Building, Upload, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { paymentTermsOptions } from "../invoice-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { warehouseProfile } from "@/lib/mock-warehouse-profile"
import { useState } from "react"
import Image from "next/image"

interface InvoiceDetailsProps {
  form: UseFormReturn<any>
}

// Add this helper function at the top of the component
function getDaySuffix(day: number) {
  if (day >= 11 && day <= 13) {
    return "th"
  }
  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

// Update the InvoiceDetails component to include a 4-square grid with the requested elements
export function InvoiceDetails({ form }: InvoiceDetailsProps) {
  const { register, setValue, watch } = form
  const selectedTemplate = watch("template")
  const [logoPreview, setLogoPreview] = useState<string | null>(warehouseProfile.logo || null)

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create a preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file)
      setLogoPreview(previewUrl)
      setValue("logo", file)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {/* Logo Upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Invoice Logo</Label>
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span className="text-xs">Warehouse Profile</span>
            </Badge>
          </div>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed relative overflow-hidden">
            {logoPreview ? (
              <div className="relative w-full h-full group">
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo Preview"
                  className="object-contain w-full h-full p-2"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Change logo</span>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <label htmlFor="logo-upload" className="cursor-pointer w-full h-full">
                <Button variant="ghost" className="h-full w-full">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Click to upload image</span>
                  </div>
                </Button>
              </label>
            )}
            <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
        </div>

        {/* Invoice Details Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <span className="sr-only">Show invoice number format information</span>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3 text-sm">
                  <div className="space-y-2">
                    <p>
                      <strong>Format: INV-YY-001</strong>
                    </p>
                    <p>
                      The invoice number is auto-generated based on the current year and a sequential number. You can
                      customize this format to match your existing numbering system.
                    </p>
                    <p>
                      <strong>Tip:</strong> For consistent tracking, consider using a prefix like "INV-" followed by
                      year code (YY) and a sequential number (e.g., INV-24-001, INV-24-002).
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Input id="invoiceNumber" placeholder="INV-YY-001" {...register("invoiceNumber")} />
            <p className="text-xs text-muted-foreground">Format: INV-YY-001</p>
          </div>

          {/* 4-square grid for invoice options */}
          <div className="grid grid-cols-2 gap-4">
            {/* 1. Payment Terms */}
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select
                defaultValue="14days"
                onValueChange={(value) => {
                  setValue("paymentTerms", value)
                  // If changing away from specificDate, ensure we have a default
                  if (value !== "specificDate" && !watch("specificPaymentDate")) {
                    setValue("specificPaymentDate", 15)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {watch("paymentTerms") === "specificDate" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch("specificPaymentDate")
                        ? `${watch("specificPaymentDate")}${getDaySuffix(watch("specificPaymentDate"))} of each month`
                        : "Select day of month"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <div className="space-y-2">
                        <Label>Day of month (1-31)</Label>
                        <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <Button
                              key={day}
                              type="button"
                              variant={watch("specificPaymentDate") === day ? "default" : "outline"}
                              className="h-9 w-9 p-0"
                              onClick={() => setValue("specificPaymentDate", day)}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* 2. Tax/GST Dropdown */}
            <div className="space-y-2">
              <Label>Tax/GST %</Label>
              <Select defaultValue="15" onValueChange={(value) => setValue("gstRate", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select GST rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15% GST</SelectItem>
                  <SelectItem value="0">No GST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Currency Dropdown */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="NZD" onValueChange={(value) => setValue("currency", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NZD">NZD - New Zealand Dollar</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Export Options */}
            <div className="space-y-2">
              <Label>Export Options</Label>
              <div className="space-y-1">
                <Button variant="outline" className="w-full" onClick={() => console.log("Export to Xero")}>
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-09%20at%208.54.13%E2%80%AFAM-Wh1NR9BT2dxPVV1YkwfzNQGeWfjBwJ.png"
                      alt="Xero Logo"
                      width={24}
                      height={24}
                    />
                    <span>Copy to Xero</span>
                  </div>
                </Button>
                <p className="text-xs text-muted-foreground italic">
                  Note: Xero integration will be configured when API coordinates are available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information (moved from its own step) */}
      <div className="space-y-4">
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
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input id="accountName" placeholder="Account Name" {...register("accountName")} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input id="accountNumber" placeholder="Account Number" {...register("accountNumber")} />
          </div>
        </div>
      </div>
    </div>
  )
}

