"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { customers, varieties, grades } from "@/app/mockData"

interface SearchFilterProps {
  onSearch: (filters: FilterCriteria) => void
}

export interface FilterCriteria {
  searchTerm: string
  customer: string
  variety: string
  grade: string
  dateFrom: string
  dateTo: string
}

export function SearchFilter({ onSearch }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterCriteria>({
    searchTerm: "",
    customer: "",
    variety: "",
    grade: "",
    dateFrom: "",
    dateTo: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="font-medium">Search Term</div>
          <Input
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleInputChange}
            placeholder="Search by any field..."
          />
        </div>

        <div className="space-y-2">
          <div className="font-medium">Customer</div>
          <Select value={filters.customer} onValueChange={(value) => handleSelectChange("customer", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.name}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Variety</div>
          <Select value={filters.variety} onValueChange={(value) => handleSelectChange("variety", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a variety" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Varieties</SelectItem>
              {varieties.map((variety) => (
                <SelectItem key={variety.id} value={variety.name}>
                  {variety.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Grade</div>
          <Select value={filters.grade} onValueChange={(value) => handleSelectChange("grade", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={grade.name}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="font-medium">From Date</div>
          <Input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <div className="font-medium">To Date</div>
          <Input type="date" name="dateTo" value={filters.dateTo} onChange={handleInputChange} />
        </div>
      </div>

      <Button onClick={() => onSearch(filters)} className="w-full">
        Search
      </Button>
    </div>
  )
}

