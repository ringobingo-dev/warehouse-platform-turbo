"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/shared/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface RoomFilterProps {
  onFilterChange: (filters: RoomFilters) => void
}

interface RoomFilters {
  roomType: string
  roomCategory: string
  minSize: number
  maxSize: number
  showOccupied: boolean
  searchTerm: string
}

export function RoomFilter({ onFilterChange }: RoomFilterProps) {
  const [filters, setFilters] = useState<RoomFilters>({
    roomType: "all",
    roomCategory: "all",
    minSize: 0,
    maxSize: 100,
    showOccupied: true,
    searchTerm: "",
  })

  const handleFilterChange = (key: keyof RoomFilters, value: string | number | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSizeChange = (value: number[]) => {
    const newFilters = { ...filters, minSize: value[0], maxSize: value[1] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const defaultFilters = {
      roomType: "all",
      roomCategory: "all",
      minSize: 0,
      maxSize: 100,
      showOccupied: true,
      searchTerm: "",
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter Rooms</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Room Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="room-type">Room Type</Label>
            <Select value={filters.roomType} onValueChange={(value) => handleFilterChange("roomType", value)}>
              <SelectTrigger id="room-type">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cold-storage">Cold Storage</SelectItem>
                <SelectItem value="dry-storage">Dry Storage</SelectItem>
                <SelectItem value="climate-controlled">Climate Controlled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="room-category">Product Category</Label>
            <Select value={filters.roomCategory} onValueChange={(value) => handleFilterChange("roomCategory", value)}>
              <SelectTrigger id="room-category">
                <SelectValue placeholder="Select product category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="potatoes">Potatoes</SelectItem>
                <SelectItem value="cherries">Cherries</SelectItem>
                <SelectItem value="onions">Onions</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Size Range Filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Room Size (m²)</Label>
            <span className="text-sm text-muted-foreground">
              {filters.minSize} - {filters.maxSize} m²
            </span>
          </div>
          <Slider
            defaultValue={[filters.minSize, filters.maxSize]}
            max={100}
            step={5}
            onValueChange={handleSizeChange}
            className="py-4"
          />
        </div>

        {/* Show Occupied Rooms */}
        <div className="flex items-center space-x-2">
          <Switch
            id="show-occupied"
            checked={filters.showOccupied}
            onCheckedChange={(checked) => handleFilterChange("showOccupied", checked)}
          />
          <Label htmlFor="show-occupied">Show Occupied Rooms</Label>
        </div>

        {/* Search Term */}
        <div className="space-y-2">
          <Label htmlFor="search-term">Search</Label>
          <Input
            id="search-term"
            placeholder="Search by room name or ID"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

