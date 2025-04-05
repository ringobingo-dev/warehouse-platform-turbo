"use client"

import { useState } from "react"
import { Room3DVisualization } from "@/components/room-3d-visualization"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function RoomVisualizationPage() {
  const [dimensions, setDimensions] = useState({
    length: 10,
    width: 8,
    height: 3,
  })

  const [boxes, setBoxes] = useState([
    { id: "Box-1", position: [1, 0.5, 1], size: [1, 1, 1], color: "#ff9900" },
    { id: "Box-2", position: [-2, 0.5, 2], size: [1, 1, 1], color: "#00aaff" },
    { id: "Box-3", position: [3, 0.5, -2], size: [1, 1, 1], color: "#44cc00" },
  ])

  const addRandomBox = () => {
    const id = `Box-${boxes.length + 1}`
    const x = Math.random() * dimensions.length - dimensions.length / 2
    const z = Math.random() * dimensions.width - dimensions.width / 2
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

    setBoxes([
      ...boxes,
      {
        id,
        position: [x, 0.5, z],
        size: [1, 1, 1],
        color,
      },
    ])
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">3D Room Visualization</h1>
      <p className="mb-8 text-muted-foreground">
        This page demonstrates the 3D visualization capabilities using React Three Fiber.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Room Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <Room3DVisualization dimensions={dimensions} boxes={boxes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Room Length: {dimensions.length}m</Label>
                <Slider
                  value={[dimensions.length]}
                  min={5}
                  max={20}
                  step={1}
                  onValueChange={(value) => setDimensions({ ...dimensions, length: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label>Room Width: {dimensions.width}m</Label>
                <Slider
                  value={[dimensions.width]}
                  min={5}
                  max={20}
                  step={1}
                  onValueChange={(value) => setDimensions({ ...dimensions, width: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label>Room Height: {dimensions.height}m</Label>
                <Slider
                  value={[dimensions.height]}
                  min={2}
                  max={10}
                  step={0.5}
                  onValueChange={(value) => setDimensions({ ...dimensions, height: value[0] })}
                />
              </div>
            </div>

            <Button onClick={addRandomBox} className="w-full">
              Add Random Box
            </Button>
            <Button variant="outline" onClick={() => setBoxes([])} className="w-full">
              Clear All Boxes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

