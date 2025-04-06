"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface XeroExportProps {
  invoiceData: {
    invoiceNumber: string
    to: any
    total: number
    items: any[]
    currency?: string
  }
}

export function XeroExport({ invoiceData }: XeroExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // This would be replaced with actual Xero API integration
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Mock successful export
      toast({
        title: "Successfully exported to Xero",
        description: "The invoice has been copied to your Xero account.",
      })

      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting to Xero. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Button variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export to Xero</DialogTitle>
            <DialogDescription>
              This will create a draft invoice in your Xero account. You can review and approve it in Xero before
              sending.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h4 className="mb-2 font-medium">Invoice Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Number:</span>
                <span>{invoiceData?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span>{invoiceData?.to?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span>
                  {invoiceData?.currency || "NZD"} {invoiceData?.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                "Export to Xero"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

