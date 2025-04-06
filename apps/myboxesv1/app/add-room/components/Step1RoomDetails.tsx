"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { StandardStepCard } from "@/components/add-room/standard-step-card"

const roomDetailsSchema = z.object({
  name: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  width: z.number().positive({
    message: "Width must be a positive number.",
  }),
  length: z.number().positive({
    message: "Length must be a positive number.",
  }),
  height: z.number().positive({
    message: "Height must be a positive number.",
  }),
})

type RoomDetailsFormValues = z.infer<typeof roomDetailsSchema>

interface Step1RoomDetailsProps {
  handleNext: () => void
  setRoomDetails: (details: RoomDetailsFormValues) => void
  defaultValues?: RoomDetailsFormValues
}

export function Step1RoomDetails({ handleNext, setRoomDetails, defaultValues }: Step1RoomDetailsProps) {
  const form = useForm<RoomDetailsFormValues>({
    resolver: zodResolver(roomDetailsSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      width: defaultValues?.width || 0,
      length: defaultValues?.length || 0,
      height: defaultValues?.height || 0,
    },
    mode: "onChange",
  })

  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
  } = form

  useEffect(() => {
    if (isValid) {
      setRoomDetails(form.getValues())
    }
  }, [isValid, watch("name"), watch("description"), watch("width"), watch("length"), watch("height")])

  return (
    <StandardStepCard
      title="Room Details"
      description="Enter the basic details of your storage room"
      footer={
        <div className="w-full flex justify-end">
          <Button onClick={handleNext} disabled={!isValid}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="name">Room Name</Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input id="name" placeholder="Storage Room" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="width">Width (m)</Label>
          <Controller
            control={control}
            name="width"
            render={({ field }) => <Input id="width" placeholder="4" type="number" step="0.1" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="length">Length (m)</Label>
          <Controller
            control={control}
            name="length"
            render={({ field }) => <Input id="length" placeholder="5" type="number" step="0.1" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="height">Height (m)</Label>
          <Controller
            control={control}
            name="height"
            render={({ field }) => <Input id="height" placeholder="3" type="number" step="0.1" {...field} />}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => <Input id="description" placeholder="Optional description" {...field} />}
          />
        </div>
      </div>
    </StandardStepCard>
  )
}

