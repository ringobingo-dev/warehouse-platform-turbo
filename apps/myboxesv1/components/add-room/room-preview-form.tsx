"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StandardRoomView } from "@/components/standard-room-view"
import { StepSection } from "./step-section"

interface RoomPreviewFormProps {
  roomData: any
  selectedRoom: string | null
  boxCount: number
  refreshKey: number
  handleRefresh: () => void
  roomShape: string
  doorConfig: any
  corridorConfig: any
  leftSideName: string
  rightSideName: string
}

export function RoomPreviewForm({
  roomData,
  selectedRoom,
  boxCount = 0,
  refreshKey,
  handleRefresh,
  roomShape,
  doorConfig,
  corridorConfig,
  leftSideName,
  rightSideName,
}: RoomPreviewFormProps) {
  // Remove the normalization logic since we're ensuring boxCount is always a number
  // const normalizedBoxCount = typeof boxCount === 'object' && boxCount !== null
  //   ? (boxCount.count || 0)
  //   : (typeof boxCount === 'number' ? boxCount : 0);

  // Use boxCount directly since it's now guaranteed to be a number

  // Only for split-side rooms
  if (roomShape !== "split-side") {
    return (
      <div className="w-full max-w-none room-preview-form">
        {/* Room Preview Section */}
        <StepSection title="Room Preview">
          <div className="w-full h-[600px] bg-white rounded-md border overflow-hidden">
            <div className="w-full h-full">
              {roomData ? (
                <div className="w-full h-full">
                  <StandardRoomView
                    refreshKey={refreshKey}
                    onRefresh={handleRefresh}
                    roomId={selectedRoom}
                    boxCount={boxCount}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground flex items-center justify-center h-full">
                  <p>No room data available for preview</p>
                </div>
              )}
            </div>
          </div>
        </StepSection>

        {/* Configuration summary for non-split rooms */}
        <StepSection title="Configuration Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Room Dimensions</h4>
              <p>
                Length: {roomData?.dimensions?.length || 0}m × Width: {roomData?.dimensions?.width || 0}m
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Storage Configuration</h4>
              <p>
                Rows: {roomData?.rows?.count || 0}, Columns: {roomData?.columns?.count || 0}, Levels:{" "}
                {roomData?.levels || 0}
              </p>
            </div>
          </div>
        </StepSection>
      </div>
    )
  }

  // For split-side rooms - two column layout
  return (
    <div className="w-full max-w-none room-preview-form">
      <StepSection title="Room Preview">
        <Tabs defaultValue="east-side" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="east-side">{leftSideName} Side</TabsTrigger>
            <TabsTrigger value="west-side">{rightSideName} Side</TabsTrigger>
          </TabsList>

          {/* EAST Side Tab */}
          <TabsContent value="east-side" className="w-full mt-0">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 w-full">
              {/* Left column: 3D View - 7/10 of the width */}
              <div className="md:col-span-7 h-[70vh] min-h-[600px] border rounded-lg overflow-hidden bg-white w-full">
                <StandardRoomView
                  refreshKey={refreshKey}
                  onRefresh={handleRefresh}
                  roomId={`${roomData?.id}-east`}
                  boxCount={boxCount}
                  className="w-full h-full"
                />
              </div>

              {/* Right column: Details - 3/10 of the width */}
              <Card className="md:col-span-3 h-[70vh] min-h-[600px] overflow-auto w-full">
                <CardHeader>
                  <CardTitle>{leftSideName} Side Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Dimensions</h3>
                      <p className="text-lg font-medium">
                        {roomData?.dimensions?.leftSideLength || 0}m × {roomData?.dimensions?.leftSideWidth || 0}m
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Floor Area</h3>
                      <p className="text-lg font-medium">
                        {(
                          (roomData?.dimensions?.leftSideLength || 0) * (roomData?.dimensions?.leftSideWidth || 0)
                        ).toFixed(2)}{" "}
                        m²
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Storage Configuration</h3>
                      <p className="text-lg font-medium">
                        {roomData?.storageConfig?.leftSide?.rows?.count || 0} rows ×{" "}
                        {roomData?.storageConfig?.leftSide?.columns?.count || 0} columns
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Stack Height</h3>
                      <p className="text-lg font-medium">
                        {roomData?.storageConfig?.leftSide?.stackHeight || 1} levels
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Total Storage Positions</h3>
                      <p className="text-lg font-medium">
                        {(roomData?.storageConfig?.leftSide?.rows?.count || 0) *
                          (roomData?.storageConfig?.leftSide?.columns?.count || 0) *
                          (roomData?.storageConfig?.leftSide?.stackHeight || 1)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Access Configuration</h3>
                      <p className="text-lg font-medium">
                        Door: {doorConfig?.wall || "None"} wall, {doorConfig?.width || 0}m width
                      </p>
                      <p className="text-lg font-medium">Corridor: {corridorConfig?.width || 0}m width</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* WEST Side Tab */}
          <TabsContent value="west-side" className="w-full mt-0">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 w-full">
              {/* Left column: 3D View - 7/10 of the width */}
              <div className="md:col-span-7 h-[70vh] min-h-[600px] border rounded-lg overflow-hidden bg-white w-full">
                <StandardRoomView
                  refreshKey={refreshKey}
                  onRefresh={handleRefresh}
                  roomId={`${roomData?.id}-west`}
                  boxCount={boxCount}
                  className="w-full h-full"
                />
              </div>

              {/* Right column: Details - 3/10 of the width */}
              <Card className="md:col-span-3 h-[70vh] min-h-[600px] overflow-auto w-full">
                <CardHeader>
                  <CardTitle>{rightSideName} Side Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Dimensions</h3>
                      <p className="text-lg font-medium">
                        {roomData?.dimensions?.rightSideLength || 0}m × {roomData?.dimensions?.rightSideWidth || 0}m
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Floor Area</h3>
                      <p className="text-lg font-medium">
                        {(
                          (roomData?.dimensions?.rightSideLength || 0) * (roomData?.dimensions?.rightSideWidth || 0)
                        ).toFixed(2)}{" "}
                        m²
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Storage Configuration</h3>
                      <p className="text-lg font-medium">
                        {roomData?.storageConfig?.rightSide?.rows?.count || 0} rows ×{" "}
                        {roomData?.storageConfig?.rightSide?.columns?.count || 0} columns
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Stack Height</h3>
                      <p className="text-lg font-medium">
                        {roomData?.storageConfig?.rightSide?.stackHeight || 1} levels
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Total Storage Positions</h3>
                      <p className="text-lg font-medium">
                        {(roomData?.storageConfig?.rightSide?.rows?.count || 0) *
                          (roomData?.storageConfig?.rightSide?.columns?.count || 0) *
                          (roomData?.storageConfig?.rightSide?.stackHeight || 1)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Access Configuration</h3>
                      <p className="text-lg font-medium">
                        Door: {doorConfig?.wall || "None"} wall, {doorConfig?.width || 0}m width
                      </p>
                      <p className="text-lg font-medium">Corridor: {corridorConfig?.width || 0}m width</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </StepSection>
    </div>
  )
}

