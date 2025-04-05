"use client"

import { cn } from "@/lib/utils"
import { paymentTermsOptions } from "../invoice-form"

interface TemplateTwoProps {
  data?: any
  preview?: boolean
}

export function TemplateTwo({ data, preview = false }: TemplateTwoProps) {
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
    discount: 5, // NZD
    tax: 15, // NZD
    shipping: 5, // NZD
    total: 115.0,
    totalInWords: "One hundred fifteen Dollar NZD",
    additionalNotes: "Thank you for your business",
    paymentTerms: "14days",
    specificPaymentDate: 15,
    bankDetails: {
      name: "Bank Inc.",
      accountName: "John Doe",
      accountNumber: "445566998877",
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
        <div>
          <h1 className="text-2xl font-bold">Invoice #</h1>
          <p className="text-gray-500">{displayData.invoiceNumber}</p>
          <p className="mt-2 text-blue-600">{displayData.from.name}</p>
        </div>
        <div className="text-right">
          <p>{displayData.from.address}</p>
          <p>{displayData.from.city}</p>
          <p>{displayData.from.country}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mt-8 grid grid-cols-2">
        <div>
          <h3 className="font-medium">Bill to:</h3>
          <p className="mt-1 font-medium">{displayData.to.name}</p>
          <div className="mt-1 text-gray-600">
            <p>{displayData.to.address}</p>
            <p>{displayData.to.city}</p>
            <p>{displayData.to.country}</p>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div className="flex justify-end gap-8">
            <span className="font-medium">Payment Terms:</span>
            <span className="text-gray-600">{getPaymentTermsText(displayData.paymentTerms)}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm">
              <th className="py-2 text-left font-medium">ITEM</th>
              <th className="py-2 text-center font-medium">QTY</th>
              <th className="py-2 text-right font-medium">RATE</th>
              <th className="py-2 text-right font-medium">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {displayData.items.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-3">
                  <p>{item.name}</p>
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
            <span>Subtotal:</span>
            <span>{displayData.subtotal.toFixed(2)} NZD</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>- {displayData.discount} NZD</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>+ {displayData.tax} NZD</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>+ {displayData.shipping} NZD</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-medium">
            <span>Total:</span>
            <span>{displayData.total.toFixed(2)} NZD</span>
          </div>
          <div className="border-t pt-2 text-right text-sm text-gray-600">
            <span>Total in words:</span>
            <p>{displayData.totalInWords}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-blue-600">Additional notes:</h3>
          <p className="text-gray-600">{displayData.additionalNotes}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-600">Payment terms:</h3>
          <p className="text-gray-600">{getPaymentTermsText(displayData.paymentTerms)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Please send the payment to this address</h3>
          <div className="text-gray-600">
            <p>Bank: {displayData.bankDetails.name}</p>
            <p>Account name: {displayData.bankDetails.accountName}</p>
            <p>Account no: {displayData.bankDetails.accountNumber}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

