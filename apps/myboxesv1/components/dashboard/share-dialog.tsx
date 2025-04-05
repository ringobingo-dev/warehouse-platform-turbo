import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { Input } from "@/components/shared/ui/input"
import { Label } from "@/components/shared/ui/label"

export function ShareDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>Share this content with others via a link.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="link">Share Link</Label>
            <Input id="link" value="https://example.com/share/abc123" readOnly />
          </div>
        </div>
        <DialogFooter>
          <Button>Copy Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

