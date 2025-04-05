"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table"
import { Button } from "@/components/shared/ui/button"
import { Download, Eye } from "lucide-react"

interface Report {
  id: string
  name: string
  type: string
  date: string
  size: string
}

interface ReportTableProps {
  reports: Report[]
  onView: (reportId: string) => void
  onDownload: (reportId: string) => void
}

export function ReportTable({ reports, onView, onDownload }: ReportTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Available reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.name}</TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.size}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(report.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDownload(report.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

