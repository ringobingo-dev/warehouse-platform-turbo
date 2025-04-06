"use client"

import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Mail, Paperclip, Edit, FileText } from "lucide-react"
import { paymentTermsOptions } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface SummaryProps {
  form: UseFormReturn<any>
}

// Helper function for payment terms text
function getPaymentTermsText(code: string, specificDate?: number) {
  if (code === "specificDate" && specificDate) {
    const day = specificDate
    let suffix = "th"
    if (day % 10 === 1 && day !== 11) suffix = "st"
    else if (day % 10 === 2 && day !== 12) suffix = "nd"
    else if (day % 10 === 3 && day !== 13) suffix = "rd"
    return `Due on the ${day}${suffix} of each month`
  }

  const term = paymentTermsOptions.find((option) => option.value === code)
  return term ? term.label : code
}

export function Summary({ form }: SummaryProps) {
  const { watch } = form
  const items = watch("items") || []
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  const calculateSubtotal = () => {
    return items.reduce((total: number, item: any) => {
      return total + (item.quantity || 0) * (item.rate || 0)
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const total = subtotal

  // Get all form data for email
  const formData = form.getValues()

  // Generate default email subject and body
  const defaultEmailSubject = `Invoice ${formData.invoiceNumber} from ${formData.from?.name || "Mountain Storage Solutions"}`
  const defaultEmailBody = `Dear ${formData.to?.name},

We hope this email finds you well. Please find attached your invoice ${formData.invoiceNumber} for storage services.

Invoice Details:
- Invoice Number: ${formData.invoiceNumber}
- Total Amount: ${total.toFixed(2)} ${formData.currency || "NZD"}
- Payment Terms: ${getPaymentTermsText(formData.paymentTerms, formData.specificPaymentDate)}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business.

Best regards,
${formData.from?.name || "Mountain Storage Solutions"}
${formData.from?.email || "billing@mountainstorage.com"}
${formData.from?.phone || "+64 123 456 789"}
`

  // Initialize email content if empty
  if (!emailSubject) setEmailSubject(defaultEmailSubject)
  if (!emailBody) setEmailBody(defaultEmailBody)

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Summary:</h3>

      {/* Email Preview Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Preview
          </CardTitle>
          <CardDescription>Preview of the email that will be sent with the invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span className="font-medium">{formData.to?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <span className="font-medium truncate max-w-[400px]">{emailSubject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attachment:</span>
                <span className="flex items-center">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {formData.invoiceNumber}.pdf
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Email Body Preview:</div>
              <div className="bg-muted p-2 rounded-md text-xs h-20 overflow-hidden relative">
                <div className="whitespace-pre-line">{emailBody.substring(0, 200)}...</div>
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-muted to-transparent"></div>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setEmailDialogOpen(true)}>
            <Edit className="h-3 w-3 mr-2" />
            Customize Email
          </Button>
        </CardContent>
      </Card>

      {/* Invoice Preview Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Invoice Preview
          </CardTitle>
          <CardDescription>Preview of the invoice that will be generated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Number:</span>
                <span className="font-medium">{formData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">From:</span>
                <span className="font-medium">{formData.from?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span className="font-medium">{formData.to?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span className="font-medium">{formData.currency || "NZD"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Terms:</span>
                <span className="font-medium">
                  {getPaymentTermsText(formData.paymentTerms, formData.specificPaymentDate)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Line Items:</div>
              <div className="bg-muted p-2 rounded-md text-xs max-h-40 overflow-auto">
                <table className="w-full text-left">
                  <thead className="text-xs uppercase">
                    <tr>
                      <th className="py-1 pr-2">Grower</th>
                      <th className="py-1 px-2">Variety</th>
                      <th className="py-1 px-2 text-right">Boxes</th>
                      <th className="py-1 pl-2 text-right">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((item: any, index: number) => {
                        const deliveryDate = new Date(item.deliveryDate)
                        const leavingDate = new Date(item.leavingDate)
                        const days = Math.ceil(
                          Math.abs(leavingDate.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24),
                        )

                        return (
                          <tr key={index} className="border-t border-muted-foreground/20">
                            <td className="py-1 pr-2">{item.grower}</td>
                            <td className="py-1 px-2">{item.variety}</td>
                            <td className="py-1 px-2 text-right">{item.boxCount}</td>
                            <td className="py-1 pl-2 text-right">{days}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-2 text-center text-muted-foreground">
                          No line items added
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <FileText className="h-3 w-3 mr-2" />
            View Full Invoice
          </Button>
        </CardContent>
      </Card>

      {/* Email Customization Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customize Email</DialogTitle>
            <DialogDescription>
              Customize the email that will be sent to the customer with the invoice attached
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emailSubject">Email Subject</Label>
              <Input id="emailSubject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailBody">Email Body</Label>
              <Textarea
                id="emailBody"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEmailSubject(defaultEmailSubject)
                setEmailBody(defaultEmailBody)
              }}
            >
              Reset to Default
            </Button>
            <Button onClick={() => setEmailDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

