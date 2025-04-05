import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/popover"
import { Button } from "@/components/shared/ui/button"
import { ChevronDown } from "lucide-react"

interface DropdownMenuProps {
  label: string
  items: { label: string; href: string }[]
}

export function DropdownMenu({ label, items }: DropdownMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          {label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="grid gap-1">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="block px-4 py-2 text-sm hover:bg-muted rounded-md">
              {item.label}
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

