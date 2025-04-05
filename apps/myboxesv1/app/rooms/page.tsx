"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Updated import to use shared Button component
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { RoomPreview } from "@/components/room-preview"
import { fetchRooms } from "@/lib/api-helpers"
import { debounce } from "@/utils/debounce"

// moved to shared folder for reuse and NX prep

export default function RoomsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("dateCreated")
  const [sortOrder, setSortOrder] = useState("desc")

  // Fetch rooms on component mount
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true)
        const data = await fetchRooms()
        setRooms(data)
        setFilteredRooms(data)
      } catch (error) {
        console.error("Failed to load rooms:", error)
        toast({
          title: "Error",
          description: "Failed to load rooms. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRooms()
  }, [toast])

  // Filter and sort rooms when dependencies change
  useEffect(() => {
    const filterAndSortRooms = () => {
      let result = [...rooms]

      // Apply search filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase()
        result = result.filter(
          (room) =>
            room.name?.toLowerCase().includes(lowerSearchTerm) ||
            room.description?.toLowerCase().includes(lowerSearchTerm),
        )
      }

      // Apply sorting
      result.sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case "name":
            comparison = (a.name || "").localeCompare(b.name || "")
            break
          case "capacity":
            const aCapacity = (a.rows || 0) * (a.columns || 0) * (a.levels || 0)
            const bCapacity = (b.rows || 0) * (b.columns || 0) * (b.levels || 0)
            comparison = aCapacity - bCapacity
            break
          case "dateCreated":
          default:
            comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            break
        }

        return sortOrder === "asc" ? comparison : -comparison
      })

      setFilteredRooms(result)
    }

    filterAndSortRooms()
  }, [rooms, searchTerm, sortBy, sortOrder])

  // Debounced search handler
  const handleSearch = debounce((value) => {
    setSearchTerm(value)
  }, 300)

  // Handle sort changes
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new sort field and default to ascending
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Handle room selection
  const handleRoomSelect = (roomId) => {
    router.push(`/rooms/${roomId}`)
  }

  // Handle add new room
  const handleAddRoom = () => {
    router.push("/add-room")
  }

  // Calculate room capacity
  const calculateCapacity = (room) => {
    return (room.rows || 0) * (room.columns || 0) * (room.levels || 0)
  }

  // Format dimensions
  const formatDimensions = (room) => {
    return `${room.rows || 0} × ${room.columns || 0} × ${room.levels || 0}`
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Button onClick={handleAddRoom}>Add New Room</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Management</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Search and sort */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search-rooms">Search Rooms</Label>
                <Input
                  id="search-rooms"
                  placeholder="Search by name or description..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="sort-by">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="capacity">Capacity</SelectItem>
                    <SelectItem value="dateCreated">Date Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-order">Order</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger id="sort-order">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Room list */}
            {loading ? (
              <div className="text-center py-8">Loading rooms...</div>
            ) : filteredRooms.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRooms.map((room) => (
                    <RoomPreview
                      key={room.id}
                      room={room}
                      onClick={() => handleRoomSelect(room.id)}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    />
                  ))}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSortChange("name")}>
                        Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSortChange("capacity")}>
                        Capacity {sortBy === "capacity" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSortChange("dateCreated")}
                      >
                        Created {sortBy === "dateCreated" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>{formatDimensions(room)}</TableCell>
                        <TableCell>{calculateCapacity(room)} boxes</TableCell>
                        <TableCell>{new Date(room.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRoomSelect(room.id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">No rooms found matching your criteria</div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

