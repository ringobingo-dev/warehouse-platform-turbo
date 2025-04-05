"use client"

import { useBoxContext } from "@/context/BoxContext"
import { ChevronDown, ChevronUp } from "lucide-react"

export function LogDisplay() {
  const { log, isLogVisible, setIsLogVisible, selectedLogIndex, handleLogEntrySelect } = useBoxContext()

  return (
    <div className="mt-6 w-full max-w-5xl">
      <button
        onClick={() => setIsLogVisible(!isLogVisible)}
        className="flex items-center text-lg font-semibold mb-2 hover:text-blue-600"
      >
        Box Log
        {isLogVisible ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
      </button>
      {isLogVisible && (
        <div className="space-y-3">
          {log.map((entry, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedLogIndex === index
                  ? "bg-green-100 border-green-500"
                  : "bg-white hover:bg-gray-50 border-gray-200"
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
                <div>
                  <span className="font-semibold">Starting Row:</span> {entry.startingRow}
                </div>
                <div>
                  <span className="font-semibold">Stack Height:</span> {entry.stackHeight}
                </div>
                <div>
                  <span className="font-semibold">Locations:</span> {entry.locations.join(", ")}
                </div>
                <div className="col-span-3">
                  <span className="font-semibold">Customer Box Color:</span>
                  <span
                    className="inline-block w-4 h-4 ml-2 align-middle"
                    style={{ backgroundColor: entry.customerBoxColor }}
                  ></span>
                  <span className="ml-2">{entry.customerBoxColor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

