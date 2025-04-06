import { Button } from "@/components/shared/ui/button"
import { Checkbox } from "@/components/shared/ui/checkbox"
import { Label } from "@/components/shared/ui/label"

export function ConsentForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">I agree to the terms and conditions</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="privacy" />
          <Label htmlFor="privacy">I agree to the privacy policy</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" />
          <Label htmlFor="marketing">I want to receive marketing emails</Label>
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}

