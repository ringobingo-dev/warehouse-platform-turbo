"use client"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Calendar, MoreVertical, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockLineItemTypes } from "@/lib/mock-storage-data"
import { useEffect, useState } from "react"

// Constants for calculations - these would come from your database in production
const DAILY_BOX_CHARGE = 1 // $1 per box per day
const HANDLING_CHARGE = 2 // $2 per box
const GST_RATE = 0.15 // 15% GST

// This interface represents the structure of line item types from PostgreSQL
interface DbLineItemType {
  id: string
  name: string
  description: string
  grower?: string
  variety?: string
  default_box_count?: number // Note: PostgreSQL uses snake_case
  category: string
  is_default: boolean
  customer_id?: string // Foreign key to customer table
  daily_rate?: number // Customer-specific daily rate
  handling_rate?: number // Customer-specific handling rate
  gst_rate?: number // Customer-specific GST rate
}

interface LineItemsProps {
  form: UseFormReturn<any>
}

export function LineItems({ form }: LineItemsProps) {
  const { control, watch, setValue } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  // State to store line item types from database
  const [lineItemTypes, setLineItemTypes] = useState<DbLineItemType[]>([])
  // State to store customer-specific rates
  const [customerRates, setCustomerRates] = useState({
    dailyRate: DAILY_BOX_CHARGE,
    handlingRate: HANDLING_CHARGE,
    gstRate: GST_RATE,
  })
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // This effect would fetch line item types and customer rates from PostgreSQL
  useEffect(() => {
    const fetchLineItemTypesFromDb = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, this would be an API call to your backend
        // which would query PostgreSQL for the customer's line item types

        // Example API call:
        // const customerId = form.getValues().to?.id;
        // const response = await fetch(`/api/customers/${customerId}/line-item-types`);
        // const data = await response.json();
        // setLineItemTypes(data.lineItemTypes);
        // setCustomerRates({
        //   dailyRate: data.dailyRate || DAILY_BOX_CHARGE,
        //   handlingRate: data.handlingRate || HANDLING_CHARGE,
        //   gstRate: data.gstRate || GST_RATE
        // });

        // For now, use mock data
        setLineItemTypes(
          mockLineItemTypes.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            grower: item.grower,
            variety: item.variety,
            default_box_count: item.defaultBoxCount,
            category: item.category,
            is_default: item.isDefault,
            daily_rate: DAILY_BOX_CHARGE,
            handling_rate: HANDLING_CHARGE,
            gst_rate: GST_RATE,
          })),
        )
      } catch (error) {
        console.error("Error fetching line item types:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLineItemTypesFromDb()
  }, [form]) // Re-fetch if the form changes (e.g., if customer changes)

  // Calculate days between two dates
  const calculateDays = (deliveryDate: Date, leavingDate: Date) => {
    const diffTime = Math.abs(leavingDate.getTime() - deliveryDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Calculate amount for a single line item
  const calculateLineItemAmount = (dayCount: number, boxCount: number) => {
    return dayCount * boxCount * customerRates.dailyRate
  }

  // Calculate totals
  const calculateTotals = () => {
    const items = watch("items") || []
    let subtotal = 0
    let totalBoxes = 0
    let totalDays = 0

    items.forEach((item: any) => {
      if (item.deliveryDate && item.leavingDate && item.boxCount) {
        const days = calculateDays(new Date(item.deliveryDate), new Date(item.leavingDate))
        totalDays += days
        const amount = calculateLineItemAmount(days, item.boxCount)
        subtotal += amount
        totalBoxes += Number.parseInt(item.boxCount)
      }
    })

    const dailyChargeTotal = subtotal
    const handlingCharges = totalBoxes * customerRates.handlingRate
    const cost = subtotal + handlingCharges
    const gst = cost * customerRates.gstRate
    const total = cost + gst

    return {
      subtotal,
      dailyChargeTotal,
      handlingCharges,
      cost,
      gst,
      total,
      totalBoxes,
      totalDays,
      avgDaysPerBox: totalBoxes > 0 ? (totalDays / items.length).toFixed(1) : 0,
    }
  }

  const totals = calculateTotals()

  // Handle adding a new line item type
  const handleAddLineItem = (type: DbLineItemType) => {
    append({
      grower: type.grower || "",
      variety: type.variety || "",
      deliveryDate: new Date(),
      leavingDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      boxCount: type.default_box_count || 0,
      lineItemTypeId: type.id, // Store reference to the line item type
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Line Items</h3>
        <p className="text-sm text-muted-foreground">Define the line items that will appear in the invoice template</p>
      </div>

      {/* Storage Items Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grower</TableHead>
              <TableHead>Variety</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Leaving Date</TableHead>
              <TableHead className="text-right">Day Count</TableHead>
              <TableHead className="text-right">Box Count</TableHead>
              <TableHead className="text-right">Amount $</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No line items added. Add items using the dropdown below.
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => {
                const deliveryDate = watch(`items.${index}.deliveryDate`)
                const leavingDate = watch(`items.${index}.leavingDate`)
                const boxCount = watch(`items.${index}.boxCount`) || 0
                const dayCount =
                  deliveryDate && leavingDate ? calculateDays(new Date(deliveryDate), new Date(leavingDate)) : 0
                const amount = calculateLineItemAmount(dayCount, boxCount)

                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input placeholder="Grower name" {...form.register(`items.${index}.grower`)} />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Variety" {...form.register(`items.${index}.variety`)} />
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {deliveryDate ? format(new Date(deliveryDate), "MM/dd/yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={deliveryDate ? new Date(deliveryDate) : undefined}
                            onSelect={(date) => setValue(`items.${index}.deliveryDate`, date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {leavingDate ? format(new Date(leavingDate), "MM/dd/yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={leavingDate ? new Date(leavingDate) : undefined}
                            onSelect={(date) => setValue(`items.${index}.leavingDate`, date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-right">{dayCount}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="text-right"
                        {...form.register(`items.${index}.boxCount`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right font-medium">
                Subtotal
              </TableCell>
              <TableCell className="text-right font-medium">${totals.subtotal.toFixed(2)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Line Item Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Line Item
            {isLoading ? " (Loading...)" : ""}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {lineItemTypes.map((type) => (
            <DropdownMenuItem key={type.id} onClick={() => handleAddLineItem(type)} className="cursor-pointer">
              <div>
                <div className="font-medium">{type.name}</div>
                <div className="text-xs text-muted-foreground">{type.description}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Summary Section - Now with split services */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">GST</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Daily Box Charge Row */}
            <TableRow>
              <TableCell>
                <div className="font-medium">Daily Box Charge</div>
                <div className="text-sm text-muted-foreground">${customerRates.dailyRate} per box per day</div>
                <div className="text-sm text-muted-foreground">Average {totals.avgDaysPerBox} days per entry</div>
              </TableCell>
              <TableCell className="text-right">${totals.dailyChargeTotal.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                ${(totals.dailyChargeTotal * customerRates.gstRate).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${(totals.dailyChargeTotal * (1 + customerRates.gstRate)).toFixed(2)}
              </TableCell>
            </TableRow>

            {/* Handling Fee Row */}
            <TableRow>
              <TableCell>
                <div className="font-medium">Handling Fee</div>
                <div className="text-sm text-muted-foreground">${customerRates.handlingRate} per box</div>
                <div className="text-sm text-muted-foreground">Total Boxes: {totals.totalBoxes}</div>
              </TableCell>
              <TableCell className="text-right">${totals.handlingCharges.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                ${(totals.handlingCharges * customerRates.gstRate).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${(totals.handlingCharges * (1 + customerRates.gstRate)).toFixed(2)}
              </TableCell>
            </TableRow>

            {/* Total Row */}
            <TableRow className="font-medium">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">${totals.cost.toFixed(2)}</TableCell>
              <TableCell className="text-right">${totals.gst.toFixed(2)}</TableCell>
              <TableCell className="text-right">${totals.total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

