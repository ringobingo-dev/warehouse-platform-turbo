"use client"

import { useState } from "react"
// NX: UI component used across multiple files
import { Button } from "./ui/button"
// NX: UI component used across multiple files
import { Label } from "./ui/label"
// NX: UI component used across multiple files
import { Input } from "./ui/input"
// NX: UI component used across multiple files
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// NX: Context with multiple levels of parent directories
import { useBoxContext } from "../context/BoxContext"

interface RoomDimensionsProps {
  onClose: () => void
}

export function RoomDimensions({ onClose }: RoomDimensionsProps) {
  const { rows, columns, levels, setRows, setColumns, setLevels, setBoxes, setStackHeight } = useBoxContext()
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Room Dimensions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="rows-display">Number of Rows</Label>
            <Input id="rows-display" type="number" value={rows} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="columns-display">Number of Columns</Label>
            <Input id="columns-display" type="number" value={columns} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="levels-display">Number of Levels</Label>
            <Input id="levels-display" type="number" value={levels} readOnly disabled />
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Fixed Room Dimensions</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Length: 20 meters</li>
            <li>Width: 20 meters</li>
            <li>Height: 10 meters</li>
            <li>Floor Area: 400 square meters</li>
            <li>Volume: 4000 cubic meters</li>
          </ul>
        </div>
        <div className="mb-6">
          <Button onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? "Exit Admin Mode" : "Enter Admin Mode"}</Button>
        </div>
        {isAdmin && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Admin Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rows-select">Number of Rows</Label>
                <Select
                  value={rows.toString()}
                  onValueChange={(value) => {
                    const newRows = Number(value)
                    setRows(newRows)
                    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.row < newRows))
                  }}
                >
                  <SelectTrigger id="rows-select">
                    <SelectValue placeholder="Select number of rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="columns-select">Number of Columns</Label>
                <Select
                  value={columns.toString()}
                  onValueChange={(value) => {
                    const newColumns = Number(value)
                    setColumns(newColumns)
                    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.column < newColumns))
                  }}
                >
                  <SelectTrigger id="columns-select">
                    <SelectValue placeholder="Select number of columns" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="levels-select">Number of Levels</Label>
                <Select
                  value={levels.toString()}
                  onValueChange={(value) => {
                    const newLevels = Number(value)
                    setLevels(newLevels)
                    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.level < newLevels))
                    // Always set stack height to match levels when changing levels
                    setStackHeight(newLevels)
                  }}
                >
                  <SelectTrigger id="levels-select">
                    <SelectValue placeholder="Select number of levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}

// TODO: Review for Stage 1 completeness

