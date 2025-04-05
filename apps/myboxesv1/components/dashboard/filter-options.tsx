import { Checkbox } from "@/components/shared/ui/checkbox"
import { Label } from "@/components/shared/ui/label"

export function FilterOptions() {
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-medium">Filter Options</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="completed" />
          <Label htmlFor="completed">Show completed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="pending" />
          <Label htmlFor="pending">Show pending</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="archived" />
          <Label htmlFor="archived">Show archived</Label>
        </div>
      </div>
    </div>
  )
}

