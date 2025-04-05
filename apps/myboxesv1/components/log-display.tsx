"use client"

import { useBoxContext } from "@/context/BoxContext"
import { ChevronDown, ChevronUp, Filter, Clock, User, Package, Tag, Calendar, MapPin } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LogDisplay() {
  const { log, isLogVisible, setIsLogVisible, selectedLogIndex, handleLogEntrySelect } = useBoxContext()
  const [filterVisible, setFilterVisible] = useState(false)

  return (
    <Card className="card">
      <CardHeader className="card-header flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Box Log
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button onClick={() => setFilterVisible(!filterVisible)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setIsLogVisible(!isLogVisible)} className="flex items-center gap-2">
            {isLogVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isLogVisible ? "Hide" : "Show"}
          </Button>
        </div>
      </CardHeader>
      {isLogVisible && (
        <CardContent className="card-content">
          {filterVisible && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="text-sm font-medium mb-3">Filter Log Entries</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                    placeholder="Filter by customer..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Box Size</label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm">
                    <option value="">All sizes</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Date Range</label>
                  <input type="date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {log.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium">No box log entries yet</p>
                <p className="text-sm">Box operations will be recorded here</p>
              </div>
            ) : (
              log.map((entry, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors log-item ${
                    selectedLogIndex === index
                      ? "bg-green-50 border-green-300"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => handleLogEntrySelect(index)}
                >
                  <div className="flex flex-wrap justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <h3 className="text-lg font-medium">{entry.customerName || "Unknown Customer"}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                        <Package className="h-3.5 w-3.5 mr-1" />
                        {Math.abs(entry.boxCount || 0)} {entry.boxSize || "unknown"} boxes
                      </span>
                      <div
                        className="h-4 w-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: entry.customerBoxColor || "#CCCCCC" }}
                        title={`Box color: ${entry.customerBoxColor || "unknown"}`}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-gray-500" />
                      <span className="font-medium text-gray-700">Variety:</span>
                      <span>{entry.varietyName || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-gray-500" />
                      <span className="font-medium text-gray-700">Grade:</span>
                      <span>{entry.grade || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span className="font-medium text-gray-700">Loading:</span>
                      <span>{entry.loadingDate || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-700">Row:</span>
                      <span>{entry.startingRow || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-700">Height:</span>
                      <span>{entry.stackHeight || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      <span className="font-medium text-gray-700">Locations:</span>
                      <span>{Array.isArray(entry.locations) ? entry.locations.join(", ") : "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

