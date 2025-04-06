"use client"

import type React from "react"

import { useState } from "react"
// Updated import to use shared Button component
import { Button } from "@/components/shared/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { debounce } from "@/utils/debounce"

// moved to shared folder for reuse and NX prep

interface SearchBoxProps {
  onSearch: (searchParams: any) => void
  isLoading?: boolean
}

export function SearchBox({ onSearch, isLoading = false }: SearchBoxProps) {
  const [searchParams, setSearchParams] = useState({
    term: "",
    field: "all",
    sortBy: "date",
    sortOrder: "desc",
  })

  // Create debounced search function
  const debouncedSearch = debounce(() => {
    onSearch(searchParams)
  }, 300)

  const handleChange = (field: string, value: any) => {
    const newParams = { ...searchParams, [field]: value }
    setSearchParams(newParams)

    // If changing sort options, search immediately
    if (field === "sortBy" || field === "sortOrder") {
      onSearch(newParams)
    } else {
      debouncedSearch()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search-term">Search</Label>
          <Input
            id="search-term"
            value={searchParams.term}
            onChange={(e) => handleChange("term", e.target.value)}
            placeholder="Enter search term..."
            className="w-full"
          />
        </div>

        <div className="w-full md:w-auto">
          <Label htmlFor="search-field">Field</Label>
          <Select value={searchParams.field} onValueChange={(value) => handleChange("field", value)}>
            <SelectTrigger id="search-field" className="w-full md:w-[180px]">
              <SelectValue placeholder="Search field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="variety">Variety</SelectItem>
              <SelectItem value="grade">Grade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Label htmlFor="sort-by">Sort By</Label>
          <Select value={searchParams.sortBy} onValueChange={(value) => handleChange("sortBy", value)}>
            <SelectTrigger id="sort-by" className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="variety">Variety</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Label htmlFor="sort-order">Order</Label>
          <Select value={searchParams.sortOrder} onValueChange={(value) => handleChange("sortOrder", value)}>
            <SelectTrigger id="sort-order" className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          Search
        </Button>
      </div>
    </form>
  )
}

