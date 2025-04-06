"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/shared/ui/button"
import { CuboidIcon as Cube } from "lucide-react"
import type { Box } from "@/types/Box"

interface SearchResultsTableProps {
  boxes: Box[]
  onViewBox?: (box: Box) => void
}

export function SearchResultsTable({ boxes, onViewBox }: SearchResultsTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground">Location</TableHead>
            <TableHead className="text-muted-foreground">Customer</TableHead>
            <TableHead className="text-muted-foreground">Variety</TableHead>
            <TableHead className="text-muted-foreground">Grade</TableHead>
            <TableHead className="text-muted-foreground">Loading Date</TableHead>
            <TableHead className="text-muted-foreground">Box Size</TableHead>
            <TableHead className="text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boxes.length > 0 ? (
            boxes.map((box, index) => (
              <TableRow key={`${box.row}-${box.column}-${box.level}-${index}`}>
                <TableCell className="font-medium">
                  R{box.row}C{box.column}L{box.level}
                </TableCell>
                <TableCell>{box.customerName}</TableCell>
                <TableCell>{box.varietyName}</TableCell>
                <TableCell>{box.grade}</TableCell>
                <TableCell>{box.loadingDate}</TableCell>
                <TableCell className="capitalize">{box.size}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewBox && onViewBox(box)}
                    className="flex items-center gap-1"
                  >
                    <Cube className="h-4 w-4" />
                    View in 3D
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No boxes found matching your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

