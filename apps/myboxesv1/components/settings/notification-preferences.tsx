import { Checkbox } from "@/components/shared/ui/checkbox"
import { Label } from "@/components/shared/ui/label"

export function NotificationPreferences() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="email" />
        <Label htmlFor="email">Email notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="sms" />
        <Label htmlFor="sms">SMS notifications</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="push" />
        <Label htmlFor="push">Push notifications</Label>
      </div>
    </div>
  )
}

