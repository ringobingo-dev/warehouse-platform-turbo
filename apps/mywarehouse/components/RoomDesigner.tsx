"use client"

import type React from "react"
import { useState } from "react"
import { Save } from "lucide-react"
import RoomLayout2D from "./RoomLayout2D"

type RoomShape = "rectangle" | "L-shaped" | "square" | "T-shaped" | "U-shaped" | "custom"
type WallPosition = "front" | "left" | "right" | "back"
type DoorPosition = {
  wall: WallPosition
  offset: number
}
type CorridorPosition = {
  wall: WallPosition
  width: number
}
type RowsDefinition = {
  count: number
  startWall: "left" | "right"
}
type ColumnsDefinition = {
  count: number
}

interface RoomDimensions {
  length: number
  width: number
  secondLength?: number
  secondWidth?: number
}

const RoomDesigner: React.FC = () => {
  const [step, setStep] = useState(1)
  const [shape, setShape] = useState<RoomShape>("rectangle")
  const [dimensions, setDimensions] = useState<RoomDimensions>({
    length: 0,
    width: 0,
  })
  const [doorPosition, setDoorPosition] = useState<DoorPosition>({ wall: "front", offset: 50 })
  const [corridor, setCorridor] = useState<CorridorPosition>({
    wall: "front",
    width: 0,
  })
  const [isDoorPositionSet, setIsDoorPositionSet] = useState(false)
  const [rows, setRows] = useState<RowsDefinition>({
    count: 0,
    startWall: "left",
  })
  const [columns, setColumns] = useState<ColumnsDefinition>({
    count: 0,
  })
  const [stackHeight, setStackHeight] = useState(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDimensions((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newShape = e.target.value as RoomShape
    setShape(newShape)
    if (newShape === "L-shaped" || newShape === "T-shaped" || newShape === "U-shaped" || newShape === "custom") {
      setDimensions((prev) => ({ ...prev, secondLength: 0, secondWidth: 0 }))
    } else {
      setDimensions((prev) => {
        const { secondLength, secondWidth, ...rest } = prev
        return rest
      })
    }
  }

  const handleDoorWallChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDoorPosition((prev) => ({ ...prev, wall: e.target.value as WallPosition }))
    setIsDoorPositionSet(false)
  }

  const handleDoorOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoorPosition((prev) => ({ ...prev, offset: Number.parseFloat(e.target.value) || 0 }))
  }

  const handleCorridorWallChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCorridor((prev) => ({ ...prev, wall: e.target.value as WallPosition }))
  }

  const handleCorridorWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorridor((prev) => ({ ...prev, width: Number.parseFloat(e.target.value) || 0 }))
  }

  const handleSetDoorPosition = () => {
    setIsDoorPositionSet(true)
    setCorridor((prev) => ({ ...prev, wall: doorPosition.wall }))
  }

  const handleRowCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRows((prev) => ({ ...prev, count: Math.max(0, Number.parseInt(e.target.value) || 0) }))
  }

  const handleRowStartWallChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows((prev) => ({ ...prev, startWall: e.target.value as "left" | "right" }))
  }

  const handleColumnCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumns({ count: Math.max(0, Number.parseInt(e.target.value) || 0) })
  }

  const handleStackHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStackHeight(Math.max(1, Number.parseInt(e.target.value) || 1))
  }

  const handleNext = () => {
    if (step === 1) {
      // Reset rows and columns when moving to a new room design
      setRows({ count: 0, startWall: "left" })
      setColumns({ count: 0 })
      setStackHeight(1)
    }
    setStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const calculateBoxCount = () => {
    return rows.count * columns.count * stackHeight
  }

  const handleSaveDesign = () => {
    // TODO: Implement the actual saving logic
    const designData = {
      shape,
      dimensions,
      doorPosition,
      corridor,
      rows,
      columns,
      stackHeight,
      boxCount: calculateBoxCount(),
    }
    console.log("Saving room design:", designData)
    // Here you would typically send this data to your backend API
    // which would then store it in a database and potentially in S3 for 3D rendering
    alert("Room design saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <div className="text-center text-sm font-medium text-gray-500">Step {step} of 4</div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Room Dimensions & Shape</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Length (m)
              </label>
              <input
                type="number"
                id="length"
                name="length"
                value={dimensions.length}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Length (m)"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                Width (m)
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={dimensions.width}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Width (m)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="shape" className="block text-sm font-medium text-gray-700 mb-1">
              Room Shape
            </label>
            <select
              id="shape"
              value={shape}
              onChange={handleShapeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="rectangle">Rectangle</option>
              <option value="L-shaped">L-shaped</option>
              <option value="square">Square</option>
              <option value="T-shaped">T-shaped</option>
              <option value="U-shaped">U-shaped</option>
              <option value="custom">Custom Shape</option>
            </select>
          </div>

          {(shape === "L-shaped" || shape === "T-shaped" || shape === "U-shaped" || shape === "custom") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="secondLength" className="block text-sm font-medium text-gray-700 mb-1">
                  Second Length (m)
                </label>
                <input
                  type="number"
                  id="secondLength"
                  name="secondLength"
                  value={dimensions.secondLength}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Second Length (m)"
                />
              </div>
              <div>
                <label htmlFor="secondWidth" className="block text-sm font-medium text-gray-700 mb-1">
                  Second Width (m)
                </label>
                <input
                  type="number"
                  id="secondWidth"
                  name="secondWidth"
                  value={dimensions.secondWidth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Second Width (m)"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Room Layout</h3>
          <p className="text-gray-600">
            Here's a 2D representation of your room based on the dimensions, shape, door position, and corridor you
            provided:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center">
            <RoomLayout2D
              dimensions={dimensions}
              shape={shape}
              unit="m"
              doorPosition={doorPosition}
              corridor={corridor}
              rows={rows}
              columns={columns}
              stackHeight={stackHeight}
            />
          </div>
          <p className="text-sm text-gray-500">
            First, set the door position. Then, you can specify the corridor wall and width.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="doorWall" className="block text-sm font-medium text-gray-700 mb-1">
                  Door Wall
                </label>
                <select
                  id="doorWall"
                  value={doorPosition.wall}
                  onChange={handleDoorWallChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="front">Front</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="back">Back</option>
                </select>
              </div>
              <div>
                <label htmlFor="doorOffset" className="block text-sm font-medium text-gray-700 mb-1">
                  Door Offset (%)
                </label>
                <input
                  type="number"
                  id="doorOffset"
                  value={doorPosition.offset}
                  onChange={handleDoorOffsetChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              onClick={handleSetDoorPosition}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Set Door Position
            </button>
          </div>
          {isDoorPositionSet && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="corridorWall" className="block text-sm font-medium text-gray-700 mb-1">
                    Corridor Wall
                  </label>
                  <select
                    id="corridorWall"
                    value={corridor.wall}
                    onChange={handleCorridorWallChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="front">Front</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="back">Back</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="corridorWidth" className="block text-sm font-medium text-gray-700 mb-1">
                    Corridor Width (m)
                  </label>
                  <input
                    type="number"
                    id="corridorWidth"
                    value={corridor.width}
                    onChange={handleCorridorWidthChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Corridor Width (m)"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Define Rows and Columns</h3>
          <p className="text-gray-600">
            Specify the number of rows and the wall where the rows should start. Then, define the number of columns that
            will traverse the rows and the stack height.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center">
            <RoomLayout2D
              dimensions={dimensions}
              shape={shape}
              unit="m"
              doorPosition={doorPosition}
              corridor={corridor}
              rows={rows}
              columns={columns}
              stackHeight={stackHeight}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rowCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rows
              </label>
              <input
                type="number"
                id="rowCount"
                value={rows.count}
                onChange={handleRowCountChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="rowStartWall" className="block text-sm font-medium text-gray-700 mb-1">
                Start Wall for Rows
              </label>
              <select
                id="rowStartWall"
                value={rows.startWall}
                onChange={handleRowStartWallChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="columnCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Columns
              </label>
              <input
                type="number"
                id="columnCount"
                value={columns.count}
                onChange={handleColumnCountChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="stackHeight" className="block text-sm font-medium text-gray-700 mb-1">
                Stack Height
              </label>
              <input
                type="number"
                id="stackHeight"
                value={stackHeight}
                onChange={handleStackHeightChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview & Export</h3>
          <p className="text-gray-600">Review your room design and export the details for future use.</p>
          <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center">
            <RoomLayout2D
              dimensions={dimensions}
              shape={shape}
              unit="m"
              doorPosition={doorPosition}
              corridor={corridor}
              rows={rows}
              columns={columns}
              stackHeight={stackHeight}
            />
          </div>
          <div className="space-y-2">
            <h4 className="text-md font-semibold">Room Summary</h4>
            <p>Shape: {shape}</p>
            <p>
              Dimensions: {dimensions.length}m x {dimensions.width}m
            </p>
            {(shape === "L-shaped" || shape === "T-shaped" || shape === "U-shaped" || shape === "custom") && (
              <p>
                Secondary Dimensions: {dimensions.secondLength}m x {dimensions.secondWidth}m
              </p>
            )}
            <p>
              Door Position: {doorPosition.wall} wall, {doorPosition.offset}% offset
            </p>
            <p>
              Corridor: {corridor.wall} wall, {corridor.width}m wide
            </p>
            <p>
              Rows: {rows.count} (starting from {rows.startWall})
            </p>
            <p>Columns: {columns.count}</p>
            <p>Stack Height: {stackHeight}</p>
            <p>Boxes per Row: {columns.count * stackHeight}</p>
            <p>Total Box Count: {calculateBoxCount()}</p>
          </div>
          <button
            onClick={handleSaveDesign}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Room Design
          </button>
        </div>
      )}
    </div>
  )
}

export default RoomDesigner

