import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/shared/ui/label"

export function FeedbackDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>We value your feedback. Please let us know how we can improve.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea id="feedback" placeholder="Type your feedback here..." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

