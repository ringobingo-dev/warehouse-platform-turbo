import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table"
import { Badge } from "@/components/shared/ui/badge"

interface Metric {
  name: string
  value: number
  change: number
  status: "positive" | "negative" | "neutral"
}

interface MetricsTableProps {
  metrics: Metric[]
  period: string
}

export function MetricsTable({ metrics, period }: MetricsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Metrics for {period}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.name}>
              <TableCell className="font-medium">{metric.name}</TableCell>
              <TableCell className="text-right">{metric.value.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                {metric.change > 0 ? "+" : ""}
                {metric.change.toLocaleString()}%
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={
                    metric.status === "positive" ? "success" : metric.status === "negative" ? "destructive" : "outline"
                  }
                >
                  {metric.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

