import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table"
import { Progress } from "@/components/shared/ui/progress"

interface PerformanceMetric {
  name: string
  value: number
  target: number
  progress: number
}

interface PerformanceTableProps {
  metrics: PerformanceMetric[]
  period: string
}

export function PerformanceTable({ metrics, period }: PerformanceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Performance metrics for {period}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Target</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.name}>
              <TableCell className="font-medium">{metric.name}</TableCell>
              <TableCell className="text-right">{metric.value.toLocaleString()}</TableCell>
              <TableCell className="text-right">{metric.target.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={metric.progress} className="h-2" />
                  <span className="text-sm text-muted-foreground">{metric.progress}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

