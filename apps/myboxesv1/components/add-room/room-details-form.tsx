"use client"
import { Input } from "@/components/shared/ui/input"
import { Label } from "@/components/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface RoomDetailsFormProps {
  roomName: string
  setRoomName: (value: string) => void
  roomCategory: string
  setRoomCategory: (value: string) => void
  roomType: string
  setRoomType: (value: string) => void
  roomShape: string
  setRoomShape: (value: string) => void
  length: number
  setLength: (value: number) => void
  width: number
  setWidth: (value: number) => void
  leftSideName: string
  setLeftSideName: (value: string) => void
  leftSideLength: number
  setLeftSideLength: (value: number) => void
  leftSideWidth: number
  setLeftSideWidth: (value: number) => void
  rightSideName: string
  setRightSideName: (value: string) => void
  rightSideLength: number
  setRightSideLength: (value: number) => void
  rightSideWidth: number
  setRightSideWidth: (value: number) => void
}

export function RoomDetailsForm({
  roomName,
  setRoomName,
  roomCategory,
  setRoomCategory,
  roomType,
  setRoomType,
  roomShape,
  setRoomShape,
  length,
  setLength,
  width,
  setWidth,
  leftSideName,
  setLeftSideName,
  leftSideLength,
  setLeftSideLength,
  leftSideWidth,
  setLeftSideWidth,
  rightSideName,
  setRightSideName,
  rightSideLength,
  setRightSideLength,
  rightSideWidth,
  setRightSideWidth,
}: RoomDetailsFormProps) {
  // Helper function to render room layout visualization
  const renderRoomLayout = (shape: string) => {
    switch (shape) {
      case "rectangle":
        return (
          <div className="aspect-square bg-background rounded-md border flex items-center justify-center mb-3">
            <div className="relative w-48 h-32">
              <div className="absolute inset-0 border-2 border-blue-500 flex items-center justify-center">
                <div className="absolute top-1 left-0 right-0 text-center">
                  <span className="text-xs text-blue-500">Back Wall</span>
                </div>
                <div className="absolute left-1 top-0 bottom-0 flex items-center">
                  <span className="text-xs text-blue-500 whitespace-nowrap">
                    Left
                    <br />
                    Wall
                  </span>
                </div>
                <div className="absolute right-1 top-0 bottom-0 flex items-center">
                  <span className="text-xs text-blue-500 whitespace-nowrap">
                    Right
                    <br />
                    Wall
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <span className="text-xs text-blue-500 font-medium">Front Corridor</span>
              </div>
            </div>
          </div>
        )

      case "l-shaped":
        return (
          <div className="aspect-square bg-background rounded-md border flex items-center justify-center mb-3">
            <div className="relative w-48 h-48">
              {/* L-shape with Small Room on top and Large Room on bottom */}
              <div className="absolute top-0 left-0 w-32 h-24 border-2 border-blue-500 flex items-center justify-center">
                <div className="font-medium text-xs text-blue-600">Small Room</div>
              </div>
              <div className="absolute top-24 left-0 w-48 h-24 border-2 border-blue-500 flex items-center justify-center">
                <div className="font-medium text-xs text-blue-600">Large Room</div>
              </div>

              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <span className="text-xs text-blue-500 font-medium">Front Entrance</span>
              </div>
            </div>
          </div>
        )

      case "split-side":
        return (
          <div className="aspect-square bg-background rounded-md border flex items-center justify-center mb-3">
            <div className="relative flex flex-col items-center p-4">
              <div className="flex justify-center gap-8">
                <div className="flex items-center justify-center">
                  <div
                    className="border-2 border-blue-500 flex items-center justify-center relative"
                    style={{ width: "100px", height: "130px" }}
                  >
                    <div className="font-medium text-xs text-blue-500">{leftSideName}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div
                    className="border-2 border-blue-500 flex items-center justify-center relative"
                    style={{ width: "100px", height: "130px" }}
                  >
                    <div className="font-medium text-xs text-blue-500">{rightSideName}</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-0 right-0 text-center">
                <span className="text-blue-500 font-medium text-xs">Front Entrance</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Room Name */}
      <div className="space-y-2">
        <Label htmlFor="room-name" className="text-base">
          Room Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="room-name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          required
          className="h-12"
        />
        <p className="text-sm text-muted-foreground">Choose a unique, descriptive name</p>
      </div>

      {/* Room Category */}
      <div className="space-y-2">
        <Label htmlFor="room-category" className="text-base">
          Room Category <span className="text-red-500">*</span>
        </Label>
        <Select value={roomCategory} onValueChange={setRoomCategory} required>
          <SelectTrigger id="room-category" className="w-full h-12">
            <SelectValue placeholder="Select room category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="potatoes">Potatoes</SelectItem>
            <SelectItem value="cherries">Cherries</SelectItem>
            <SelectItem value="onions">Onions</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Select the primary product</p>
      </div>

      {/* Room Type */}
      <div className="space-y-2">
        <Label htmlFor="room-type" className="text-base">
          Room Type <span className="text-red-500">*</span>
        </Label>
        <Select value={roomType} onValueChange={setRoomType} required>
          <SelectTrigger id="room-type" className="w-full h-12">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cold-storage">Cold Storage</SelectItem>
            <SelectItem value="dry-storage">Dry Storage</SelectItem>
            <SelectItem value="climate-controlled">Climate Controlled</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Type of storage environment</p>
      </div>

      {/* Visual Room Shape Selector */}
      <div className="col-span-1 md:col-span-3 mt-4 mb-2">
        {/* Options Container */}
        <div className="border rounded-lg bg-card">
          <div className="grid grid-cols-3 gap-6 p-6">
            {["l-shaped", "rectangle", "split-side"].map((shape) => (
              <div
                key={shape}
                className={`relative rounded-lg p-6 cursor-pointer transition-all ${
                  roomShape === shape
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted/20 border-2 border-transparent hover:border-primary/50"
                }`}
                onClick={() => setRoomShape(shape)}
              >
                {renderRoomLayout(shape)}
                <div className="space-y-1">
                  <h4 className="font-medium">
                    {shape === "l-shaped"
                      ? "L-Shaped Room"
                      : shape === "rectangle"
                        ? "Rectangular Room"
                        : "Split-Side Room"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {shape === "l-shaped"
                      ? "Two connected areas forming an L-shape for specialized storage"
                      : shape === "rectangle"
                        ? "Rectangular layout with clearly defined walls for optimal access"
                        : "Two separate storage areas with central entrance"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Development Notice for L-Shaped Room */}
      {roomShape === "l-shaped" && (
        <div className="col-span-1 md:col-span-3 mb-4">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">L-Shape Room Design Under Development</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Dimensions Section */}
      {roomShape && (
        <div className="col-span-1 md:col-span-3 mt-4 mb-2 transition-all duration-300 ease-in-out">
          {/* Dimensions Inputs */}
          {roomShape === "split-side" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side Dimensions */}
              <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="left-side-name" className="text-sm">
                    Left Side Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="left-side-name"
                    value={leftSideName}
                    onChange={(e) => setLeftSideName(e.target.value)}
                    placeholder="Enter a name for the left side"
                    required
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="left-length" className="text-sm">
                      Left/Right Wall - Length (m) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="left-length"
                      type="number"
                      value={leftSideLength}
                      onChange={(e) => setLeftSideLength(Number(e.target.value))}
                      min="1"
                      step="0.1"
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="left-width" className="text-sm">
                      Back/Front Wall - Width (m) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="left-width"
                      type="number"
                      value={leftSideWidth}
                      onChange={(e) => setLeftSideWidth(Number(e.target.value))}
                      min="1"
                      step="0.1"
                      required
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side Dimensions */}
              <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="right-side-name" className="text-sm">
                    Right Side Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="right-side-name"
                    value={rightSideName}
                    onChange={(e) => setRightSideName(e.target.value)}
                    placeholder="Enter a name for the right side"
                    required
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="right-length" className="text-sm">
                      Left/Right Wall - Length (m) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="right-length"
                      type="number"
                      value={rightSideLength}
                      onChange={(e) => setRightSideLength(Number(e.target.value))}
                      min="1"
                      step="0.1"
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="right-width" className="text-sm">
                      Back/Front Wall - Width (m) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="right-width"
                      type="number"
                      value={rightSideWidth}
                      onChange={(e) => setRightSideWidth(Number(e.target.value))}
                      min="1"
                      step="0.1"
                      required
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                <h4 className="font-medium text-base border-b pb-2">Room Dimensions</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Length */}
                  <div className="space-y-2">
                    <Label htmlFor="length" className="text-sm">
                      Left/Right Wall - Length (m) <span className="text-red-500">*</span>
                    </Label>
                    <Select value={length.toString()} onValueChange={(value) => setLength(Number(value))} required>
                      <SelectTrigger id="length" className="h-10">
                        <SelectValue placeholder="Set Side Wall Length" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} m
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Width */}
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-sm">
                      Back/Front Wall - Width (m) <span className="text-red-500">*</span>
                    </Label>
                    <Select value={width.toString()} onValueChange={(value) => setWidth(Number(value))} required>
                      <SelectTrigger id="width" className="h-10">
                        <SelectValue placeholder="Set Front Wall Length" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} m
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// TODO: Review for Stage 1 completeness
// This file likely contains @/ imports that need to be updated
// possible duplicate — review for consolidation (with room-dimensions-config.tsx)

