"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/select"
import { Label } from "@/components/ui/label"

interface SortOptionsProps {
  onSortChange: (value: string) => void
  defaultValue?: string
  className?: string
}

export function SortOptions({ onSortChange, defaultValue = "name-asc", className }: SortOptionsProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">
        Sort by:
      </Label>
      <Select defaultValue={defaultValue} onValueChange={onSortChange}>
        <SelectTrigger id="sort-by" className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
          <SelectItem value="date-desc">Date (Newest first)</SelectItem>
          <SelectItem value="size-asc">Size (Smallest first)</SelectItem>
          <SelectItem value="size-desc">Size (Largest first)</SelectItem>
          <SelectItem value="boxes-asc">Boxes (Fewest first)</SelectItem>
          <SelectItem value="boxes-desc">Boxes (Most first)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

