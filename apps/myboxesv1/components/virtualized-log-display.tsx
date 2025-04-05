"use client"

import { useCallback } from "react"
import { useBoxContext } from "@/context/BoxContext"
import { ChevronDown, ChevronUp } from "lucide-react"
import { FixedSizeList as List } from "react-window"

export default function VirtualizedLogDisplay() {
  const { log, isLogVisible, setIsLogVisible, selectedLogIndex, handleLogEntrySelect } = useBoxContext()

  const renderRow = useCallback(
    ({ index, style }) => {
      const entry = log[index]
      return (
        <div
          style={style}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedLogIndex === index ? "bg-green-100 border-green-500" : "bg-white hover:bg-gray-50 border-gray-200"
          }`}
          onClick={() => handleLogEntrySelect(index)}
        >
          <div className="flex flex-wrap justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{entry.customerName}</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {entry.boxCount} {entry.boxSize} boxes
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-semibold">Variety:</span> {entry.varietyName}
            </div>
            <div>
              <span className="font-semibold">Grade:</span> {entry.grade}
            </div>
            <div>
              <span className="font-semibold">Loading Date:</span> {entry.loadingDate}
            </div>
          </div>
        </div>
      )
    },
    [selectedLogIndex, handleLogEntrySelect, log],
  )

  if (!isLogVisible) {
    return (
      <button
        onClick={() => setIsLogVisible(true)}
        className="flex items-center text-lg font-semibold mb-2 hover:text-blue-600"
      >
        Box Log <ChevronDown className="ml-2" />
      </button>
    )
  }

  return (
    <div className="mt-6 w-full max-w-5xl">
      <button
        onClick={() => setIsLogVisible(false)}
        className="flex items-center text-lg font-semibold mb-2 hover:text-blue-600"
      >
        Box Log <ChevronUp className="ml-2" />
      </button>
      <List height={400} width="100%" itemCount={log.length} itemSize={150}>
        {renderRow}
      </List>
    </div>
  )
}

