"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface DoorConfig {
  wall: "front" | "back" | "left" | "right"
  offset: number
  width: number
}

interface CorridorConfig {
  wall: "front" | "back" | "left" | "right"
  width: number
}

interface AccessConfigSectionProps {
  roomShape: string
  doorConfig: DoorConfig
  setDoorConfig: (config: DoorConfig) => void
  corridorConfig: CorridorConfig
  setCorridorConfig: (config: CorridorConfig) => void
  accessConfigApplied: boolean
  handleApplyAccessConfig: () => void
}

export function AccessConfigSection({
  roomShape,
  doorConfig,
  setDoorConfig,
  corridorConfig,
  setCorridorConfig,
  accessConfigApplied,
  handleApplyAccessConfig,
}: AccessConfigSectionProps) {
  const { toast } = useToast()

  return (
    <div className="p-4 space-y-4 border-t">
      <h4 className="font-medium">Access Configuration</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Define where the door is located and configure a corridor for forklift operations. The door position is
        specified as a percentage offset along the selected wall. The corridor width determines the space reserved for
        forklift movement.
      </p>

      {roomShape !== "split-side" ? (
        <div className="grid grid-cols-3 gap-6 mb-4">
          {/* Door Wall */}
          <div className="space-y-2">
            <Label htmlFor="door-wall">Door Wall</Label>
            <Select
              value={doorConfig.wall}
              onValueChange={(value: "front" | "back" | "left" | "right") =>
                setDoorConfig((prev) => ({ ...prev, wall: value }))
              }
            >
              <SelectTrigger id="door-wall">
                <SelectValue placeholder="Select wall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Front</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Door Offset */}
          <div className="space-y-2">
            <Label htmlFor="door-offset">Door Offset (%)</Label>
            <Input
              id="door-offset"
              type="number"
              min="0"
              max="90"
              value={doorConfig.offset}
              onChange={(e) =>
                setDoorConfig((prev) => ({
                  ...prev,
                  offset: Math.max(0, Math.min(90, Number(e.target.value))),
                }))
              }
            />
            <p className="text-xs text-muted-foreground">Position along the wall (0-90%)</p>
          </div>

          {/* Door Width */}
          <div className="space-y-2">
            <Label htmlFor="door-width">Door Width (m)</Label>
            <Input
              id="door-width"
              type="number"
              min="0.5"
              max="5"
              step="0.1"
              value={doorConfig.width}
              onChange={(e) =>
                setDoorConfig((prev) => ({
                  ...prev,
                  width: Math.max(0.5, Math.min(5, Number(e.target.value))),
                }))
              }
            />
            <p className="text-xs text-muted-foreground">Adjust the door width (0.5m - 5m).</p>
          </div>
        </div>
      ) : (
        /* Horizontal layout for split-side rooms */
        <div className="flex flex-wrap items-end gap-4 mb-4">
          {/* Door Width */}
          <div className="space-y-2 flex-1">
            <Label htmlFor="door-width">Door Width (m)</Label>
            <Input
              id="door-width"
              type="number"
              min="0.5"
              max="5"
              step="0.1"
              value={doorConfig.width}
              onChange={(e) =>
                setDoorConfig((prev) => ({
                  ...prev,
                  width: Math.max(0.5, Math.min(5, Number(e.target.value))),
                }))
              }
            />
          </div>

          {/* Corridor Width */}
          <div className="space-y-2 flex-1">
            <Label htmlFor="corridor-width">Corridor Width (m)</Label>
            <Input
              id="corridor-width"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={corridorConfig.width}
              onChange={(e) =>
                setCorridorConfig((prev) => ({
                  ...prev,
                  width: Math.max(0, Math.min(5, Number(e.target.value))),
                }))
              }
            />
          </div>

          {/* Apply Button */}
          <Button onClick={handleApplyAccessConfig} className="px-6">
            {accessConfigApplied ? "Reset" : "Apply"}
          </Button>
        </div>
      )}

      {/* Corridor Configuration - Only show for non-split-side rooms */}
      {roomShape !== "split-side" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Corridor Wall */}
          <div className="space-y-2">
            <Label htmlFor="corridor-wall">Corridor Wall</Label>
            <Select
              value={corridorConfig.wall}
              onValueChange={(value: "front" | "back" | "left" | "right") =>
                setCorridorConfig((prev) => ({ ...prev, wall: value }))
              }
            >
              <SelectTrigger id="corridor-wall">
                <SelectValue placeholder="Select wall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Front</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Corridor Width */}
          <div className="space-y-2">
            <Label htmlFor="corridor-width">Corridor Width (m)</Label>
            <Input
              id="corridor-width"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={corridorConfig.width}
              onChange={(e) =>
                setCorridorConfig((prev) => ({
                  ...prev,
                  width: Math.max(0, Math.min(5, Number(e.target.value))),
                }))
              }
            />
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <Button onClick={handleApplyAccessConfig} className="px-6 h-10">
              {accessConfigApplied ? "Reset" : "Apply"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

