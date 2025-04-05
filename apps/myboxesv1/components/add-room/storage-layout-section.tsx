"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface StorageConfig {
  rows: {
    count: number
    startWall: "front" | "back"
  }
  columns: {
    count: number
  }
  stackHeight: number
  leftSide?: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  rightSide?: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
}

interface StorageLayoutSectionProps {
  roomShape: string
  storageConfig: StorageConfig
  setStorageConfig: (config: StorageConfig) => void
  showStorageLayout: boolean
  leftSideConfigured: boolean
  rightSideConfigured: boolean
  leftSideName: string
  rightSideName: string
  handleApplyLeftSideConfig: () => void
  handleApplyRightSideConfig: () => void
}

export function StorageLayoutSection({
  roomShape,
  storageConfig,
  setStorageConfig,
  showStorageLayout,
  leftSideConfigured,
  rightSideConfigured,
  leftSideName,
  rightSideName,
  handleApplyLeftSideConfig,
  handleApplyRightSideConfig,
}: StorageLayoutSectionProps) {
  const { toast } = useToast()

  return (
    <div id="storage-layout-section" className="p-4 space-y-4 border-t">
      <h4 className={`font-medium ${showStorageLayout ? "" : "text-muted-foreground"}`}>
        Storage Layout Configuration
      </h4>

      {showStorageLayout ? (
        <p className="text-sm text-muted-foreground mb-4">
          {roomShape === "split-side"
            ? "Define the storage layout for each side by specifying the number of rows and columns."
            : "Define the storage layout by specifying the number of rows and columns. The visualization will update to show how your storage space will be organized."}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          Apply the access configuration above to activate the storage layout controls.
        </p>
      )}

      {roomShape === "split-side" && showStorageLayout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side (East) Configuration */}
          <div className="border rounded-lg p-4 bg-muted/10">
            <h5 className="font-medium text-base border-b pb-2 mb-4">{leftSideName} Side Configuration</h5>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="left-row-count">Number of Rows</Label>
                <Select
                  value={storageConfig.leftSide?.rows.count.toString() || "0"}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      leftSide: {
                        ...prev.leftSide!,
                        rows: { ...prev.leftSide!.rows, count: Number(value) },
                      },
                    }))
                  }
                >
                  <SelectTrigger id="left-row-count" className="h-10">
                    <SelectValue placeholder="Select Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="left-row-start">Start Wall for Rows</Label>
                <Select
                  value={storageConfig.leftSide?.rows.startWall || "front"}
                  onValueChange={(value: "front" | "back") =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      leftSide: {
                        ...prev.leftSide!,
                        rows: { ...prev.leftSide!.rows, startWall: value },
                      },
                    }))
                  }
                >
                  <SelectTrigger id="left-row-start" className="h-10">
                    <SelectValue placeholder="Select wall" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="left-column-count">Number of Columns</Label>
                <Select
                  value={storageConfig.leftSide?.columns.count.toString() || "0"}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      leftSide: {
                        ...prev.leftSide!,
                        columns: { count: Number(value) },
                      },
                    }))
                  }
                >
                  <SelectTrigger id="left-column-count" className="h-10">
                    <SelectValue placeholder="Select Columns" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="left-stack-height">Stack Height</Label>
                <Select
                  value={storageConfig.leftSide?.stackHeight.toString() || "1"}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      leftSide: {
                        ...prev.leftSide!,
                        stackHeight: Number(value),
                      },
                    }))
                  }
                >
                  <SelectTrigger id="left-stack-height" className="h-10">
                    <SelectValue placeholder="Select stack height" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Apply Button for Left Side */}
            <Button
              onClick={handleApplyLeftSideConfig}
              className={`w-full ${leftSideConfigured ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {leftSideConfigured ? "Applied ✓" : `Apply ${leftSideName} Configuration`}
            </Button>
          </div>

          {/* Right Side (West) Configuration */}
          <div className="border rounded-lg p-4 bg-muted/10">
            <h5 className="font-medium text-base border-b pb-2 mb-4">{rightSideName} Side Capacity</h5>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="right-row-count">Number of Rows</Label>
                <Select
                  value={storageConfig.rightSide?.rows.count.toString() || "0"}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      rightSide: {
                        ...prev.rightSide!,
                        rows: { ...prev.rightSide!.rows, count: Number(value) },
                      },
                    }))
                  }
                >
                  <SelectTrigger id="right-row-count" className="h-10">
                    <SelectValue placeholder="Select Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="right-row-start">Start Wall for Rows</Label>
                <Select
                  value={storageConfig.rightSide?.rows.startWall || "front"}
                  onValueChange={(value: "front" | "back") =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      rightSide: {
                        ...prev.rightSide!,
                        rows: { ...prev.rightSide!.rows, startWall: value },
                      },
                    }))
                  }
                >
                  <SelectTrigger id="right-row-start" className="h-10">
                    <SelectValue placeholder="Select wall" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front</SelectItem>
                    <SelectItem value="back">Back</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="right-column-count">Number of Columns</Label>
                <Select
                  value={storageConfig.rightSide?.columns.count.toString() || "0"}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      rightSide: {
                        ...prev.rightSide!,
                        columns: { count: Number(value) },
                      },
                    }))
                  }
                >
                  <SelectTrigger id="right-column-count" className="h-10">
                    <SelectValue placeholder="Select Columns" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="right-stack-height">Stack Height</Label>
                <Select
                  value={storageConfig.rightSide?.stackHeight.toString() || "1"}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      rightSide: {
                        ...prev.rightSide!,
                        stackHeight: Number(value),
                      },
                    }))
                  }
                >
                  <SelectTrigger id="right-stack-height" className="h-10">
                    <SelectValue placeholder="Select stack height" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Apply Button for Right Side */}
            <Button
              onClick={handleApplyRightSideConfig}
              className={`w-full ${rightSideConfigured ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {rightSideConfigured ? "Applied ✓" : `Apply ${rightSideName} Configuration`}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Row Configuration - Always visible but disabled until Apply is clicked */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="row-count" className={showStorageLayout ? "" : "text-muted-foreground"}>
                Number of Rows
              </Label>
              {showStorageLayout ? (
                <Select
                  value={storageConfig.rows.count.toString()}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      rows: { ...prev.rows, count: Number(value) },
                    }))
                  }
                  disabled={!showStorageLayout}
                >
                  <SelectTrigger id="row-count" className="h-10">
                    <SelectValue placeholder="Select Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 px-3 py-2 rounded-md border bg-muted text-muted-foreground flex items-center opacity-50">
                  Select Rows
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="row-start" className={showStorageLayout ? "" : "text-muted-foreground"}>
                Start Wall for Rows
              </Label>
              <Select
                value={storageConfig.rows.startWall}
                onValueChange={(value: "front" | "back") =>
                  setStorageConfig((prev) => ({
                    ...prev,
                    rows: { ...prev.rows, startWall: value },
                  }))
                }
                disabled={!showStorageLayout}
              >
                <SelectTrigger id="row-start" className={!showStorageLayout ? "opacity-50 cursor-not-allowed" : ""}>
                  <SelectValue placeholder="Select wall" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="front">Front</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Column and Stack Configuration - Always visible but disabled until Apply is clicked */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="column-count" className={showStorageLayout ? "" : "text-muted-foreground"}>
                Number of Columns
              </Label>
              {showStorageLayout ? (
                <Select
                  value={storageConfig.columns.count.toString()}
                  onValueChange={(value) =>
                    setStorageConfig((prev) => ({
                      ...prev,
                      columns: { count: Number(value) },
                    }))
                  }
                  disabled={!showStorageLayout}
                >
                  <SelectTrigger id="column-count" className="h-10">
                    <SelectValue placeholder="Select Columns" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 px-3 py-2 rounded-md border bg-muted text-muted-foreground flex items-center opacity-50">
                  Select Columns
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stack-height" className={showStorageLayout ? "" : "text-muted-foreground"}>
                Stack Height
              </Label>
              <Select
                value={storageConfig.stackHeight.toString()}
                onValueChange={(value) =>
                  setStorageConfig((prev) => ({
                    ...prev,
                    stackHeight: Number(value),
                  }))
                }
                disabled={!showStorageLayout}
              >
                <SelectTrigger id="stack-height" className={!showStorageLayout ? "opacity-50 cursor-not-allowed" : ""}>
                  <SelectValue placeholder="Select stack height" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

