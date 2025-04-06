"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { paymentTermsOptions } from "../invoice-form"

interface TemplateOneProps {
  data?: any
  preview?: boolean
}

export function TemplateOne({ data, preview = false }: TemplateOneProps) {
  const previewData = {
    invoiceNumber: "INV-23-001",
    from: {
      name: "John Doe",
      address: "123 Main St",
      city: "12345, Anytown",
      country: "USA",
    },
    to: {
      name: "Jane Smith",
      address: "456 Elm St, 54321",
      city: "Other Town",
      country: "Canada",
    },
    items: [
      {
        name: "Product A",
        description: "Description of Product A",
        quantity: 2,
        rate: 50,
        amount: 100,
      },
    ],
    subtotal: 100.0,
    discount: 5, // percentage
    tax: 15, // percentage
    shipping: 5, // percentage
    total: 114.71,
    totalInWords: "One hundred fourteen and 71/100 NZD",
    additionalNotes: "Thank you for your business",
    paymentTerms: "14days",
    specificPaymentDate: 15,
    bankDetails: {
      name: "Bank Inc.",
      accountName: "John Doe",
      accountNumber: "445566998877",
    },
    contact: {
      email: "johndoe@example.com",
      phone: "123-456-7890",
    },
  }

  const displayData = preview ? previewData : data

  // Convert payment terms code to readable text
  const getPaymentTermsText = (code: string) => {
    if (code === "specificDate" && displayData.specificPaymentDate) {
      const day = displayData.specificPaymentDate
      let suffix = "th"
      if (day % 10 === 1 && day !== 11) suffix = "st"
      else if (day % 10 === 2 && day !== 12) suffix = "nd"
      else if (day % 10 === 3 && day !== 13) suffix = "rd"
      return `Due on the ${day}${suffix} of each month`
    }

    const term = paymentTermsOptions.find((option) => option.value === code)
    return term ? term.label : code
  }

  return (
    <div className={cn("relative rounded-lg border bg-white p-8", preview && "w-full max-w-[600px]")}>
      {/* Header */}
      <div className="flex justify-between">
        <div className="text-blue-600">
          <h2 className="text-xl font-medium">{displayData.from.name}</h2>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium">Invoice</span>
            <div className="rounded-full bg-blue-100 p-2">
              <Check className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500">{displayData.invoiceNumber}</p>
          <div className="mt-2 text-sm text-gray-600">
            <p>{displayData.from.address}</p>
            <p>{displayData.from.city}</p>
            <p>{displayData.from.country}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mt-8 grid grid-cols-2">
        <div>
          <h3 className="font-medium">Bill to:</h3>
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">{displayData.to.name}</p>
            <p>{displayData.to.address}</p>
            <p>{displayData.to.city}</p>
            <p>{displayData.to.country}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <div className="flex justify-end gap-8">
              <span className="text-gray-600">Payment Terms:</span>
              <span>{getPaymentTermsText(displayData.paymentTerms)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm">
              <th className="py-2 text-left font-medium text-gray-600">ITEM</th>
              <th className="py-2 text-center font-medium text-gray-600">QTY</th>
              <th className="py-2 text-right font-medium text-gray-600">RATE</th>
              <th className="py-2 text-right font-medium text-gray-600">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {displayData.items.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{item.rate} NZD</td>
                <td className="py-3 text-right">{item.amount} NZD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-8 flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>{displayData.subtotal.toFixed(2)} NZD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount:</span>
            <span>- {displayData.discount}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span>+ {displayData.tax}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping:</span>
            <span>+ {displayData.shipping}%</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-medium">
            <span>Total:</span>
            <span>{displayData.total.toFixed(2)} NZD</span>
          </div>
          <div className="border-t pt-2 text-right text-sm text-gray-600">
            <span>{displayData.totalInWords}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-blue-600">Additional notes:</h3>
          <p className="text-sm text-gray-600">{displayData.additionalNotes}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-600">Payment terms:</h3>
          <p className="text-sm text-gray-600">{getPaymentTermsText(displayData.paymentTerms)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Please send the payment to this address</h3>
          <div className="text-sm text-gray-600">
            <p>Bank: {displayData.bankDetails.name}</p>
            <p>Account name: {displayData.bankDetails.accountName}</p>
            <p>Account no: {displayData.bankDetails.accountNumber}</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <p>If you have any questions concerning this invoice, use the following contact information:</p>
          <p>{displayData.contact.email}</p>
          <p>{displayData.contact.phone}</p>
        </div>
      </div>
    </div>
  )
}

