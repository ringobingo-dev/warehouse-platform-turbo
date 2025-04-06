import { Button } from "@/components/shared/ui/button"
import { Checkbox } from "@/components/shared/ui/checkbox"
import { Input } from "@/components/shared/ui/input"
import { Label } from "@/components/shared/ui/label"

export function SubscriptionForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="newsletter" />
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="updates" />
          <Label htmlFor="updates">Receive product updates</Label>
        </div>
      </div>
      <Button type="submit">Subscribe</Button>
    </form>
  )
}

