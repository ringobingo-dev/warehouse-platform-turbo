"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RoomPreviewFormProps {
  roomData: any
  onBack: () => void
  onEdit: (step: number) => void
  onSubmit: () => void
  isSaving?: boolean
}

const RoomPreviewForm = ({ roomData, onBack, onEdit, onSubmit, isSaving = false }: RoomPreviewFormProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Room Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Room preview content */}
        <p>Preview of your 3D room configuration.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSaving}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Finish"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default RoomPreviewForm

