"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillingDetails } from "./steps/billing-details"
import { InvoiceDetails } from "./steps/invoice-details"
import { LineItems } from "./steps/line-items"
import { TemplateDesign } from "./steps/template-design"
import { Summary } from "./steps/summary"
import { warehouseProfile, firstType2Customer } from "@/lib/mock-warehouse-profile"
import { mockLineItemTypes } from "@/lib/mock-storage-data"

// Updated steps - removed Payment Info
const steps = [
  { id: "from-to", label: "From & To" },
  { id: "invoice-details", label: "Invoice Details" },
  { id: "line-items", label: "Line Items" },
  { id: "template-design", label: "Template Design" },
  { id: "summary", label: "Summary" },
]

// Update the payment terms options
export const paymentTermsOptions = [
  { value: "7days", label: "7 days" },
  { value: "14days", label: "14 days" },
  { value: "30days", label: "30 days" },
  { value: "specificDate", label: "Specific date each month" },
]

// Update the form schema to include gstRate
const formSchema = z.object({
  // From & To
  from: z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    zip: z.string().min(1, "ZIP is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    taxId: z.string().optional(),
  }),
  to: z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    zip: z.string().min(1, "ZIP is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    contactPerson: z.string().optional(),
  }),
  // Invoice Details
  logo: z.any().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  currency: z.string().min(1, "Currency is required"),
  template: z.string().min(1, "Template is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  specificPaymentDate: z.number().optional(), // Day of month (1-31)
  gstRate: z.string().default("15"), // Add GST rate field
  // Payment Info (now part of Invoice Details)
  bankName: z.string().min(1, "Bank name is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  // Line Items
  items: z.array(
    z.object({
      grower: z.string().min(1, "Grower name is required"),
      variety: z.string().min(1, "Variety is required"),
      deliveryDate: z.date(),
      leavingDate: z.date(),
      boxCount: z.number().min(0),
      lineItemTypeId: z.string().optional(), // Reference to the line item type from SQL
    }),
  ),
  // Summary
  signature: z.any().optional(),
  discount: z.boolean(),
  tax: z.boolean(),
  shipping: z.boolean(),
  notes: z.string().optional(),
  includeWordsTotal: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

// Update the InvoiceForm component to accept props for editing
// Add these props to the InvoiceForm component
interface InvoiceFormProps {
  templateId?: string | null
  onCancel?: () => void
  isEditing?: boolean
}

export function InvoiceForm({ templateId, onCancel, isEditing = false }: InvoiceFormProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Generate invoice number with format INV-YY-001
  const currentYear = new Date().getFullYear().toString().slice(-2)
  const invoiceNumber = `INV-${currentYear}-001`

  // Get default line item type
  const defaultLineItemType = mockLineItemTypes.find((type) => type.isDefault)

  // Update the defaultValues in the form to include gstRate
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Pre-populate from warehouse profile
      from: {
        name: warehouseProfile.name,
        address: warehouseProfile.address,
        zip: warehouseProfile.zip,
        city: warehouseProfile.city,
        state: warehouseProfile.state,
        country: warehouseProfile.country,
        email: warehouseProfile.email,
        phone: warehouseProfile.phone,
        taxId: warehouseProfile.taxId,
      },
      // Pre-populate from first type2 customer
      to: firstType2Customer
        ? {
            name: firstType2Customer.name,
            address: firstType2Customer.address,
            zip: firstType2Customer.zip,
            city: firstType2Customer.city,
            state: firstType2Customer.state,
            country: firstType2Customer.country,
            email: firstType2Customer.email,
            phone: firstType2Customer.phone,
            contactPerson: firstType2Customer.contactPerson,
          }
        : {
            name: "",
            address: "",
            zip: "",
            city: "",
            state: "",
            country: "",
            email: "",
            phone: "",
            contactPerson: "",
          },
      invoiceNumber: invoiceNumber,
      currency: "NZD", // Set default currency to NZD
      template: "template1",
      paymentTerms: "14days", // Default to 14 days
      specificPaymentDate: 15, // Default to 15th of the month
      gstRate: "15", // Default to 15% GST
      items: defaultLineItemType
        ? [
            // Start with default line item type if available
            {
              grower: defaultLineItemType.grower || "",
              variety: defaultLineItemType.variety || "",
              deliveryDate: new Date(),
              leavingDate: new Date(new Date().setDate(new Date().getDate() + 30)),
              boxCount: defaultLineItemType.defaultBoxCount || 0,
              lineItemTypeId: defaultLineItemType.id,
            },
          ]
        : [],
      // Pre-populate bank details from warehouse profile
      bankName: warehouseProfile.bankDetails.bankName,
      accountName: warehouseProfile.bankDetails.accountName,
      accountNumber: warehouseProfile.bankDetails.accountNumber,
      discount: false,
      tax: false,
      shipping: false,
      includeWordsTotal: false,
      notes: "Thank you for your business!",
    },
  })

  // If editing, we would load the template data here
  useEffect(() => {
    if (isEditing && templateId) {
      // In a real app, this would fetch the template data from the API
      console.log(`Loading template data for ID: ${templateId}`)

      // For now, we'll just simulate loading template data
      // This would be replaced with actual API call in production
      setTimeout(() => {
        // Simulate loaded data - in reality this would come from an API
        if (templateId === "template-001") {
          form.reset({
            ...form.getValues(),
            invoiceNumber: "INV-TEMPLATE-001",
            notes: "Standard monthly storage invoice template",
            // Other fields would be populated here
          })
        }
      }, 100)
    }
  }, [isEditing, templateId, form])

  const progress = ((currentStep + 1) / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: FormValues) => {
    console.log(data)
    // Handle form submission
    // This is where you would send the data to your backend
    // When integrating with real databases, this would call your API

    // If we have an onCancel function, call it to return to the template list
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <Tabs value={steps[currentStep].id} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {steps.map((step, index) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                disabled={index !== currentStep}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {index + 1}. {step.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="from-to">
            <BillingDetails form={form} />
          </TabsContent>
          <TabsContent value="invoice-details">
            <InvoiceDetails form={form} />
          </TabsContent>
          <TabsContent value="line-items">
            <LineItems form={form} />
          </TabsContent>
          <TabsContent value="template-design">
            <TemplateDesign form={form} />
          </TabsContent>
          <TabsContent value="summary">
            <Summary form={form} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-between">
        {currentStep === 0 && onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Back
          </Button>
        )}
        {currentStep === steps.length - 1 ? (
          <Button type="submit">{isEditing ? "Update Template" : "Create Template"}</Button>
        ) : (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        )}
      </div>
    </form>
  )
}

