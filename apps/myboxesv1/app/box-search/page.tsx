"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoomInfo } from "@/components/room-info"
import { useBoxContext } from "@/context/BoxContext"
import { StandardRoomView } from "@/components/standard-room-view"
import { getAllRoomsFromLocalStorage } from "@/lib/client-storage-utils"
import { useToast } from "@/components/ui/use-toast"
import { ensureMock3DRoomsExist } from "@/utils/mockRoomGenerator"
import { BoxSummaryTable } from "@/components/box-summary-table"
import { SearchFilterControl } from "@/components/search-filter-control"
import type { Box } from "@/types/Box"
import { useRoomBoxes } from "@/hooks/useRoomBoxes"

// Simplified room data type
interface RoomData {
  id: string
  name: string
  displayName?: string
  rows?: number
  columns?: number
  levels?: number
}

export default function BoxSearchPage() {
  const { rows, columns, levels, boxes, setBoxes, getRoomCapacity, highlightBox } = useBoxContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null)
  const [availableRooms, setAvailableRooms] = useState<RoomData[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const { toast } = useToast()

  // Add filter state
  const [filters, setFilters] = useState({
    customer: "",
    variety: "",
    grade: "",
  })

  // Use our new hook for room-specific box management
  const { selectedRoomId, changeRoom, isLoaded } = useRoomBoxes()

  // Use a ref to track if rooms have been loaded
  const roomsLoadedRef = useRef(false)

  // Use a ref to track if we're currently updating highlights
  const updatingHighlightsRef = useRef(false)

  // Add state for tracking highlighted group
  const [highlightedGroup, setHighlightedGroup] = useState<{
    customer: string
    variety: string
    grade: string
  } | null>(null)

  // Load saved rooms from localStorage - only once
  useEffect(() => {
    // Skip if we've already loaded rooms
    if (roomsLoadedRef.current) return

    const loadRooms = () => {
      try {
        // Ensure mock 3D rooms exist if no 3D rooms are found
        const mockResult = ensureMock3DRoomsExist()
        if (mockResult.added) {
          toast({
            title: "Mock 3D Rooms Added",
            description: `Added ${mockResult.count} mock 3D rooms for demonstration`,
            duration: 3000,
          })
        }

        // Get all rooms from localStorage
        const allRooms = getAllRoomsFromLocalStorage()

        // Filter to include 3D rooms and split room sides
        const rooms3D = allRooms.filter((room) => {
          // Check if it's a 3D room
          const is3D = room.dataType === "3d" || room.version === "3D" || room.renderType === "3D"

          // Check if it's a split room side (EAST or WEST)
          const isSplitSide =
            room.sideType === "EAST" ||
            room.sideType === "WEST" ||
            (room.name && (room.name.includes("EAST") || room.name.includes("WEST")))

          return is3D || isSplitSide
        })

        if (rooms3D.length > 0) {
          const formattedRooms = rooms3D.map((room: any) => ({
            id: room.id,
            name: room.roomName || room.name || `Room ${room.id}`,
            displayName: room.sideType
              ? `${room.roomName || room.name} (${room.sideType} Side)`
              : room.name && (room.name.includes("EAST") || room.name.includes("WEST"))
                ? room.roomName || room.name
                : room.roomName || room.name || `Room ${room.id}`,
            rows: Number(room.rows?.count || room.rows || 5),
            columns: Number(room.columns?.count || room.columns || 5),
            levels: Number(room.levels || 3),
          }))

          setAvailableRooms(formattedRooms)

          // Set the first room as selected by default if none is selected
          if (!selectedRoomId && rooms3D.length > 0) {
            changeRoom(rooms3D[0].id)
          }

          // Mark rooms as loaded
          roomsLoadedRef.current = true
        } else {
          toast({
            title: "No 3D Rooms Found",
            description: "No 3D room data found in storage. This is unexpected as mock rooms should have been added.",
            variant: "destructive",
          })
          setAvailableRooms([])
        }
      } catch (error) {
        console.error("Error loading 3D rooms:", error)
        toast({
          title: "Error Loading Rooms",
          description: "Failed to load 3D room data from storage.",
          variant: "destructive",
        })
        setAvailableRooms([])
      }
    }

    loadRooms()
  }, [toast]) // Remove selectedRoomId and changeRoom from dependencies

  // Effect to update box highlighting when group changes
  useEffect(() => {
    // Skip if we're already updating highlights
    if (updatingHighlightsRef.current) return

    // Set the flag to prevent re-entry
    updatingHighlightsRef.current = true

    try {
      if (highlightedGroup) {
        const { customer, variety, grade } = highlightedGroup

        // Update boxes to highlight the selected group
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => ({
            ...box,
            highlighted: box.customerName === customer && box.varietyName === variety && box.grade === grade,
          })),
        )
      } else {
        // Clear all highlights
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => ({
            ...box,
            highlighted: false,
          })),
        )
      }

      // Refresh the 3D view
      setRefreshKey((prev) => prev + 1)
    } finally {
      // Clear the flag after a short delay to allow state to settle
      setTimeout(() => {
        updatingHighlightsRef.current = false
      }, 100)
    }
  }, [highlightedGroup, setBoxes])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilter = (newFilters: { customer: string; variety: string; grade: string }) => {
    setFilters(newFilters)
  }

  const handleBoxSelect = (box: Box) => {
    const boxId = `${box.row}-${box.column}-${box.level}`

    if (selectedBoxId === boxId) {
      setSelectedBoxId(null)
      // Clear highlight
      highlightBox(0, 0, 0)
    } else {
      setSelectedBoxId(boxId)
      // Highlight the selected box in the 3D view
      highlightBox(box.row, box.column, box.level)
    }

    // Clear any group highlighting when selecting individual box
    setHighlightedGroup(null)

    setRefreshKey((prev) => prev + 1)
  }

  const handleRoomChange = (roomId: string) => {
    // Skip if it's the same room
    if (roomId === selectedRoomId) return

    // Use our room-specific change function
    changeRoom(roomId)

    setSelectedBoxId(null)
    setHighlightedGroup(null) // Clear group highlighting

    // Trigger a refresh of the view
    setRefreshKey((prev) => prev + 1)
  }

  // Extract unique customers, varieties, and grades for filter options
  const filterOptions = useMemo(() => {
    const customers = new Set<string>()
    const varieties = new Set<string>()
    const grades = new Set<string>()

    boxes.forEach((box) => {
      if (box.customerName) customers.add(box.customerName)
      if (box.varietyName) varieties.add(box.varietyName)
      if (box.grade) grades.add(box.grade)
    })

    return {
      customers: Array.from(customers).map((value) => ({ value, label: value })),
      varieties: Array.from(varieties).map((value) => ({ value, label: value })),
      grades: Array.from(grades).map((value) => ({ value, label: value })),
    }
  }, [boxes])

  // Filter boxes based on search term and filters
  const filteredBoxes = useMemo(() => {
    return boxes.filter((box) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        (box.customerName && box.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (box.varietyName && box.varietyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (box.grade && box.grade.toLowerCase().includes(searchTerm.toLowerCase()))

      // Customer filter
      const matchesCustomer = filters.customer === "" || box.customerName === filters.customer

      // Variety filter
      const matchesVariety = filters.variety === "" || box.varietyName === filters.variety

      // Grade filter
      const matchesGrade = filters.grade === "" || box.grade === filters.grade

      return matchesSearch && matchesCustomer && matchesVariety && matchesGrade
    })
  }, [boxes, searchTerm, filters])

  // Get the selected room object
  const selectedRoomObject = availableRooms.find((r) => r.id === selectedRoomId)

  // Format box location for display
  const formatBoxLocation = (box: Box) => {
    return `Row ${box.row}, Col ${box.column}, Level ${box.level}`
  }

  // Add handler for group selection
  const handleGroupSelect = (customer: string, variety: string, grade: string) => {
    // If selecting the same group, toggle it off
    if (
      highlightedGroup &&
      highlightedGroup.customer === customer &&
      highlightedGroup.variety === variety &&
      highlightedGroup.grade === grade
    ) {
      setHighlightedGroup(null)
      setSelectedBoxId(null)
    } else {
      // Set the new highlighted group
      setHighlightedGroup({ customer, variety, grade })

      // Find a box from this group to focus on
      const matchingBox = boxes.find(
        (box) => box.customerName === customer && box.varietyName === variety && box.grade === grade,
      )

      if (matchingBox) {
        const boxId = `${matchingBox.row}-${matchingBox.column}-${matchingBox.level}`
        setSelectedBoxId(boxId)
      } else {
        setSelectedBoxId(null)
      }
    }
  }

  // Count boxes in the highlighted group
  const highlightedBoxCount = useMemo(() => {
    if (!highlightedGroup) return 0

    const { customer, variety, grade } = highlightedGroup
    return boxes.filter((box) => box.customerName === customer && box.varietyName === variety && box.grade === grade)
      .length
  }, [boxes, highlightedGroup])

  // Show loading state while room data is being loaded
  if (!isLoaded) {
    return <div className="w-full px-4 py-6">Loading room data...</div>
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Box Search</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Room:</span>
          <Select value={selectedRoomId} onValueChange={handleRoomChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.displayName || room.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No 3D rooms available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* RoomInfo component with matching padding/margin */}
      <RoomInfo rows={rows} columns={columns} levels={levels} totalBoxes={boxes.length} capacity={getRoomCapacity()} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Box Search - Now on the left */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Box Search</CardTitle>
            <div className="mt-2">
              <SearchFilterControl
                onSearch={handleSearch}
                onFilter={handleFilter}
                customers={filterOptions.customers}
                varieties={filterOptions.varieties}
                grades={filterOptions.grades}
                placeholder="Search boxes..."
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium mb-2">Box Inventory Summary</div>
            <div className="text-sm text-muted-foreground mb-4">
              Showing boxes in{" "}
              {selectedRoomObject ? selectedRoomObject.displayName || selectedRoomObject.name : "selected room"}
            </div>

            {/* Box Summary Table - Using actual box data from context */}
            <BoxSummaryTable boxes={boxes} onSelectGroup={handleGroupSelect} />

            {/* Highlighted Group Info */}
            {highlightedGroup && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-green-800">Highlighted Group</h4>
                    <p className="text-sm text-green-700">
                      {highlightedGroup.customer} - {highlightedGroup.variety} - {highlightedGroup.grade}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-700">{highlightedBoxCount} boxes</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 h-7 border-green-300 text-green-700 hover:bg-green-100"
                      onClick={() => setHighlightedGroup(null)}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results (only show if search term is entered or filters are applied) */}
            {(searchTerm || filters.customer || filters.variety || filters.grade) && (
              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Search Results</div>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Variety</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBoxes.length > 0 ? (
                        filteredBoxes.slice(0, 10).map((box, index) => {
                          const boxId = `${box.row}-${box.column}-${box.level}`
                          const isHighlighted =
                            highlightedGroup &&
                            box.customerName === highlightedGroup.customer &&
                            box.varietyName === highlightedGroup.variety &&
                            box.grade === highlightedGroup.grade

                          return (
                            <TableRow
                              key={boxId + index}
                              className={`
                                ${boxId === selectedBoxId ? "bg-muted" : ""}
                                ${isHighlighted ? "bg-green-50" : ""}
                              `}
                            >
                              <TableCell className="font-medium">{box.customerName}</TableCell>
                              <TableCell>{box.varietyName}</TableCell>
                              <TableCell>{box.grade}</TableCell>
                              <TableCell>{formatBoxLocation(box)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleBoxSelect(box)}>
                                  Select
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No boxes found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  Showing {Math.min(filteredBoxes.length, 10)} of {filteredBoxes.length} boxes
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Room Visualization - Now on the right */}
        <div className="lg:col-span-8 h-full">
          <StandardRoomView
            refreshKey={refreshKey}
            onRefresh={() => setRefreshKey((prev) => prev + 1)}
            roomId={selectedRoomId}
            boxCount={boxes.length}
            roomName={
              selectedRoomObject ? selectedRoomObject.displayName || selectedRoomObject.name : "No Room Selected"
            }
          />
        </div>
      </div>
    </div>
  )
}

