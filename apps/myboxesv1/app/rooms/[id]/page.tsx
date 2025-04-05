"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
// Updated import to use shared Button component
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ThreeDView } from "@/components/3d-view"
import { RoomDetails } from "@/components/room-details"
import { BoxList } from "@/components/box-list"
import { fetchRoom, fetchBoxesInRoom } from "@/lib/api-helpers"

// moved to shared folder for reuse and NX prep

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [room, setRoom] = useState(null)
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("3d-view")
  const [visualizationMode, setVisualizationMode] = useState("basic")
  const [showLabels, setShowLabels] = useState(true)
  const [boxColor, setBoxColor] = useState("#e5d3b3")
  const [isFiltered, setIsFiltered] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch room and boxes on component mount
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        setLoading(true)
        const roomId = params.id

        // Fetch room details
        const roomData = await fetchRoom(roomId)
        setRoom(roomData)

        // Fetch boxes in this room
        const boxesData = await fetchBoxesInRoom(roomId)
        setBoxes(boxesData)
      } catch (error) {
        console.error("Failed to load room data:", error)
        toast({
          title: "Error",
          description: "Failed to load room data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRoomData()
  }, [params.id, toast])

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Handle back button
  const handleBack = () => {
    router.push("/rooms")
  }

  // Handle edit room
  const handleEditRoom = () => {
    router.push(`/rooms/${params.id}/edit`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            Back
          </Button>
          <h1 className="text-3xl font-bold">{loading ? "Loading..." : room?.name || "Room Details"}</h1>
        </div>
        <Button onClick={handleEditRoom} disabled={loading}>
          Edit Room
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Visualization</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="3d-view">3D View</TabsTrigger>
              <TabsTrigger value="details">Room Details</TabsTrigger>
              <TabsTrigger value="boxes">Boxes</TabsTrigger>
            </TabsList>

            <TabsContent value="3d-view" className="space-y-4">
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <p>Loading 3D view...</p>
                </div>
              ) : (
                <>
                  <div className="h-96 bg-gray-100 rounded-md overflow-hidden">
                    <ThreeDView
                      key={refreshKey}
                      room={room}
                      boxes={boxes}
                      boxColor={boxColor}
                      isFiltered={isFiltered}
                      showLabels={showLabels}
                      visualizationMode={visualizationMode}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="visualization-mode">Visualization Mode</Label>
                      <Select value={visualizationMode} onValueChange={setVisualizationMode}>
                        <SelectTrigger id="visualization-mode">
                          <SelectValue placeholder="Visualization Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="enhanced">Enhanced</SelectItem>
                          <SelectItem value="realistic">Realistic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="box-color">Box Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="box-color"
                          value={boxColor}
                          onChange={(e) => setBoxColor(e.target.value)}
                          className="h-10 w-10 rounded border"
                        />
                        <span>{boxColor}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
                        <Label htmlFor="show-labels">Show Labels</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="filter-view" checked={isFiltered} onCheckedChange={setIsFiltered} />
                        <Label htmlFor="filter-view">Highlight All Boxes</Label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleRefresh} variant="outline">
                    Refresh View
                  </Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="details">
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <p>Loading room details...</p>
                </div>
              ) : (
                <RoomDetails room={room} />
              )}
            </TabsContent>

            <TabsContent value="boxes">
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <p>Loading boxes...</p>
                </div>
              ) : (
                <BoxList boxes={boxes} roomId={params.id} onBoxClick={(boxId) => router.push(`/boxes/${boxId}`)} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}

