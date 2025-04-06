"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Box } from "@/types/Box"

interface BoxSummaryTableProps {
  boxes: Box[]
  onSelectGroup: (customer: string, variety: string, grade: string) => void
}

interface SummaryItem {
  customer: string
  variety: string
  grade: string
  count: number
}

export function BoxSummaryTable({ boxes, onSelectGroup }: BoxSummaryTableProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Group boxes by customer, variety, and grade
  const summaryData = useMemo(() => {
    const groupedData: Record<string, Record<string, Record<string, number>>> = {}

    boxes.forEach((box) => {
      // Initialize customer if not exists
      if (!groupedData[box.customerName]) {
        groupedData[box.customerName] = {}
      }

      // Initialize variety if not exists
      if (!groupedData[box.customerName][box.varietyName]) {
        groupedData[box.customerName][box.varietyName] = {}
      }

      // Initialize or increment grade count
      if (!groupedData[box.customerName][box.varietyName][box.grade]) {
        groupedData[box.customerName][box.varietyName][box.grade] = 1
      } else {
        groupedData[box.customerName][box.varietyName][box.grade]++
      }
    })

    // Convert to array format for easier rendering
    const summaryItems: SummaryItem[] = []

    Object.entries(groupedData).forEach(([customer, varieties]) => {
      Object.entries(varieties).forEach(([variety, grades]) => {
        Object.entries(grades).forEach(([grade, count]) => {
          summaryItems.push({
            customer,
            variety,
            grade,
            count,
          })
        })
      })
    })

    return summaryItems
  }, [boxes])

  // Calculate totals
  const totalBoxes = useMemo(() => summaryData.reduce((sum, item) => sum + item.count, 0), [summaryData])

  // Handle checkbox change
  const handleCheckboxChange = (item: SummaryItem, index: number) => {
    if (selectedIndex === index) {
      // Deselect if already selected
      setSelectedIndex(null)
      onSelectGroup("", "", "") // Clear selection
    } else {
      // Select new row
      setSelectedIndex(index)
      onSelectGroup(item.customer, item.variety, item.grade)
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[200px]">Customer</TableHead>
            <TableHead className="w-[200px]">Variety</TableHead>
            <TableHead className="w-[200px]">Grade</TableHead>
            <TableHead className="text-right">Box Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaryData.length > 0 ? (
            <>
              {summaryData.map((item, index) => (
                <TableRow
                  key={`${item.customer}-${item.variety}-${item.grade}-${index}`}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedIndex === index ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500" : ""
                  }`}
                  onClick={() => handleCheckboxChange(item, index)}
                >
                  <TableCell className="pr-0">
                    <Checkbox
                      checked={selectedIndex === index}
                      onCheckedChange={() => handleCheckboxChange(item, index)}
                      className={
                        selectedIndex === index
                          ? "data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-green-500"
                          : ""
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.customer}</TableCell>
                  <TableCell>{item.variety}</TableCell>
                  <TableCell>{item.grade}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell></TableCell>
                <TableCell colSpan={3} className="font-bold">
                  Total Boxes
                </TableCell>
                <TableCell className="text-right font-bold">{totalBoxes}</TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No boxes available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

