"use client"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { InvoiceForm } from "@/components/invoice/invoice-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function InvoiceTemplatesPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Invoice Templates"
        description="Create and manage your invoice templates"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        }
      />
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <InvoiceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

