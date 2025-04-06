import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table"
import { Check, X } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  features: Record<string, boolean>
}

interface ProductComparisonTableProps {
  products: Product[]
  features: string[]
}

export function ProductComparisonTable({ products, features }: ProductComparisonTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Product comparison</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            {products.map((product) => (
              <TableHead key={product.id} className="text-center">
                {product.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Price</TableCell>
            {products.map((product) => (
              <TableCell key={`${product.id}-price`} className="text-center">
                ${product.price.toFixed(2)}
              </TableCell>
            ))}
          </TableRow>
          {features.map((feature) => (
            <TableRow key={feature}>
              <TableCell className="font-medium">{feature}</TableCell>
              {products.map((product) => (
                <TableCell key={`${product.id}-${feature}`} className="text-center">
                  {product.features[feature] ? (
                    <Check className="h-4 w-4 mx-auto text-green-500" />
                  ) : (
                    <X className="h-4 w-4 mx-auto text-red-500" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

