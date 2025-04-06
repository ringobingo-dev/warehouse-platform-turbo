"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
}

interface SearchFilterControlProps {
  onSearch: (searchTerm: string) => void
  onFilter: (filters: {
    customer: string
    variety: string
    grade: string
  }) => void
  customers: FilterOption[]
  varieties: FilterOption[]
  grades: FilterOption[]
  className?: string
  placeholder?: string
}

export function SearchFilterControl({
  onSearch,
  onFilter,
  customers,
  varieties,
  grades,
  className,
  placeholder = "Search boxes...",
}: SearchFilterControlProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedVariety, setSelectedVariety] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [searchParam, setSearchParam] = useState<"text" | "customer" | "variety" | "grade">("text")
  const [activeFilters, setActiveFilters] = useState(0)

  // Update active filters count
  useEffect(() => {
    let count = 0
    if (selectedCustomer) count++
    if (selectedVariety) count++
    if (selectedGrade) count++
    setActiveFilters(count)
  }, [selectedCustomer, selectedVariety, selectedGrade])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  // Apply customer filter
  const handleCustomerChange = (value: string) => {
    const newValue = value === "all" ? "" : value
    setSelectedCustomer(newValue)
    onFilter({
      customer: newValue,
      variety: selectedVariety,
      grade: selectedGrade,
    })
  }

  // Apply variety filter
  const handleVarietyChange = (value: string) => {
    const newValue = value === "all" ? "" : value
    setSelectedVariety(newValue)
    onFilter({
      customer: selectedCustomer,
      variety: newValue,
      grade: selectedGrade,
    })
  }

  // Apply grade filter
  const handleGradeChange = (value: string) => {
    const newValue = value === "all" ? "" : value
    setSelectedGrade(newValue)
    onFilter({
      customer: selectedCustomer,
      variety: selectedVariety,
      grade: newValue,
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCustomer("")
    setSelectedVariety("")
    setSelectedGrade("")
    onFilter({
      customer: "",
      variety: "",
      grade: "",
    })
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search parameter selector and search input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={searchParam} onValueChange={(value) => setSearchParam(value as any)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text Search</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="variety">Variety</SelectItem>
            <SelectItem value="grade">Grade</SelectItem>
          </SelectContent>
        </Select>

        {searchParam === "text" && (
          <div className="relative flex-grow">
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  onSearch("")
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {searchParam === "customer" && (
          <Select value={selectedCustomer || "all"} onValueChange={handleCustomerChange}>
            <SelectTrigger className="flex-grow">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.value} value={customer.value}>
                  {customer.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {searchParam === "variety" && (
          <Select value={selectedVariety || "all"} onValueChange={handleVarietyChange}>
            <SelectTrigger className="flex-grow">
              <SelectValue placeholder="Select variety" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Varieties</SelectItem>
              {varieties.map((variety) => (
                <SelectItem key={variety.value} value={variety.value}>
                  {variety.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {searchParam === "grade" && (
          <Select value={selectedGrade || "all"} onValueChange={handleGradeChange}>
            <SelectTrigger className="flex-grow">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade.value} value={grade.value}>
                  {grade.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Active filters display */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCustomer && (
            <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
              <span className="mr-1 font-medium">Customer:</span>
              {customers.find((c) => c.value === selectedCustomer)?.label || selectedCustomer}
              <button
                onClick={() => {
                  setSelectedCustomer("")
                  onFilter({
                    customer: "",
                    variety: selectedVariety,
                    grade: selectedGrade,
                  })
                }}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {selectedVariety && (
            <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
              <span className="mr-1 font-medium">Variety:</span>
              {varieties.find((v) => v.value === selectedVariety)?.label || selectedVariety}
              <button
                onClick={() => {
                  setSelectedVariety("")
                  onFilter({
                    customer: selectedCustomer,
                    variety: "",
                    grade: selectedGrade,
                  })
                }}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {selectedGrade && (
            <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
              <span className="mr-1 font-medium">Grade:</span>
              {grades.find((g) => g.value === selectedGrade)?.label || selectedGrade}
              <button
                onClick={() => {
                  setSelectedGrade("")
                  onFilter({
                    customer: selectedCustomer,
                    variety: selectedVariety,
                    grade: "",
                  })
                }}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {activeFilters > 1 && (
            <button
              onClick={clearFilters}
              className="flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  )
}

