"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table"
import { Input } from "@/components/shared/ui/input"
import { Search } from "lucide-react"

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessor: keyof T
    cell?: (item: T) => React.ReactNode
  }[]
  caption?: string
}

export function DataTable<T>({ data, columns, caption }: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data

    return data.filter((item) => {
      return columns.some((column) => {
        const value = item[column.accessor]
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase())
        }
        return false
      })
    })
  }, [data, searchTerm, columns])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${String(column.accessor)}`}>
                      {column.cell ? column.cell(item) : String(item[column.accessor])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

