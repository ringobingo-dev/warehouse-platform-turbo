"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Box } from "@/types/Box"
import { CheckCircle2 } from "lucide-react"

interface BoxSummaryListProps {
  boxes: Box[]
  onSelectGroup: (customer: string, variety: string, grade: string) => void
}

interface SummaryItem {
  customer: string
  variety: string
  grade: string
  count: number
}

export function BoxSummaryList({ boxes, onSelectGroup }: BoxSummaryListProps) {
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

  // Calculate total boxes
  const totalBoxes = useMemo(() => summaryData.reduce((sum, item) => sum + item.count, 0), [summaryData])

  // Handle card click
  const handleCardClick = (item: SummaryItem, index: number) => {
    if (selectedIndex === index) {
      // Deselect if already selected
      setSelectedIndex(null)
      onSelectGroup("", "", "") // Clear selection
    } else {
      // Select new card
      setSelectedIndex(index)
      onSelectGroup(item.customer, item.variety, item.grade)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryData.length > 0 ? (
          summaryData.map((item, index) => (
            <Card
              key={`${item.customer}-${item.variety}-${item.grade}-${index}`}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedIndex === index ? "border-green-500 shadow-md" : "border-gray-200"
              }`}
              onClick={() => handleCardClick(item, index)}
            >
              <CardContent className="p-4 flex items-start">
                <div
                  className={`w-2 h-full self-stretch rounded-full mr-3 ${
                    selectedIndex === index ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{item.customer}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.variety} / {item.grade}
                      </p>
                    </div>
                    {selectedIndex === index && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Box Count:</span>
                    <span className="font-medium text-lg">{item.count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-muted-foreground">No boxes available</div>
        )}
      </div>

      {/* Total boxes summary */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Total Boxes</h3>
            <span className="font-bold text-lg">{totalBoxes}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

