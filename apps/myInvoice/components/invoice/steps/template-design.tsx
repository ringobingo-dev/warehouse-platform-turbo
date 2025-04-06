"use client"

import type { UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"
import { TemplateOne } from "../templates/template-one"
import { TemplateTwo } from "../templates/template-two"

interface TemplateDesignProps {
  form: UseFormReturn<any>
}

export function TemplateDesign({ form }: TemplateDesignProps) {
  const { setValue, watch } = form
  const selectedTemplate = watch("template")

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Choose Invoice Template:</h3>

      <div className="grid gap-8 md:grid-cols-2">
        <div
          className={cn(
            "cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent",
            selectedTemplate === "template1" && "border-primary bg-accent/50",
          )}
          onClick={() => setValue("template", "template1")}
        >
          <div className="aspect-[1/1.4] overflow-hidden rounded-md">
            <TemplateOne preview />
          </div>
          <div className="mt-4 text-center font-medium">Template 1</div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Professional design with accent colors and clean layout
          </p>
        </div>

        <div
          className={cn(
            "cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent",
            selectedTemplate === "template2" && "border-primary bg-accent/50",
          )}
          onClick={() => setValue("template", "template2")}
        >
          <div className="aspect-[1/1.4] overflow-hidden rounded-md">
            <TemplateTwo preview />
          </div>
          <div className="mt-4 text-center font-medium">Template 2</div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Simple and elegant design with minimalist styling
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border p-4">
        <h4 className="font-medium">Template Customization</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          The selected template will be used when generating your invoice. All your invoice details, line items, and
          payment information will be formatted according to this template design.
        </p>
      </div>
    </div>
  )
}

