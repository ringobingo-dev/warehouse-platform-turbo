import { Checkbox } from "@/components/shared/ui/checkbox"
import { Label } from "@/components/shared/ui/label"

export function DataSharingOptions() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Data Sharing Preferences</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="analytics" />
          <Label htmlFor="analytics">Share analytics data</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="usage" />
          <Label htmlFor="usage">Share usage statistics</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="crash" />
          <Label htmlFor="crash">Share crash reports</Label>
        </div>
      </div>
    </div>
  )
}

