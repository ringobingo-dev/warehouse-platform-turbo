"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InvoiceTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSaveTemplate: (templateName: string, template: string, customerType: string) => void
}

interface InvoiceTemplate {
  name: string
  content: string
  customerType: string
}

const InvoiceTemplateDialog: React.FC<InvoiceTemplateDialogProps> = ({ isOpen, onClose, onSaveTemplate }) => {
  const [step, setStep] = useState(1)
  const [templateName, setTemplateName] = useState("")
  const [templateContent, setTemplateContent] = useState("")
  const [customerType, setCustomerType] = useState("")

  const handleSaveTemplate = () => {
    onSaveTemplate(templateName, templateContent, customerType)
    setStep(1)
    setTemplateName("")
    setTemplateContent("")
    setCustomerType("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Invoice Template</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Create a new invoice template" : "Customize your invoice template"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateName" className="text-right">
                Template Name
              </Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerType" className="text-right">
                Customer Type
              </Label>
              <Select value={customerType} onValueChange={setCustomerType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Type2">Type2 (Room Renter)</SelectItem>
                  <SelectItem value="Type4">Type4 (Merchant)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setStep(2)} disabled={!templateName || !customerType}>
              Next
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter your invoice template here. Use placeholders like [CustomerName], [InvoiceDate], [DueDate], [Amount], etc."
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              className="h-[200px]"
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSaveTemplate} disabled={!templateContent}>
                Save Template
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default InvoiceTemplateDialog

