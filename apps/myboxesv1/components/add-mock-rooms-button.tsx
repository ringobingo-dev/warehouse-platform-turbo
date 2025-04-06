"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { generateMock3DRooms } from "@/utils/mockRoomGenerator"
import { getAllRoomsFromLocalStorage } from "@/lib/client-storage-utils"

export function AddMockRoomsButton() {
  const { toast } = useToast()

  const handleAddMockRooms = () => {
    try {
      // Get existing rooms
      const existingRooms = getAllRoomsFromLocalStorage()

      // Generate mock rooms
      const mockRooms = generateMock3DRooms()

      // Combine existing and mock rooms
      const updatedRooms = [...existingRooms, ...mockRooms]

      // Save to localStorage
      localStorage.setItem("savedRooms", JSON.stringify(updatedRooms))

      toast({
        title: "Mock Rooms Added",
        description: `Added ${mockRooms.length} mock 3D rooms for demonstration`,
        duration: 3000,
      })

      // Reload the page to see the new rooms
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error("Error adding mock rooms:", error)
      toast({
        title: "Error",
        description: "Failed to add mock rooms",
        variant: "destructive",
      })
    }
  }

  return (
    <Button onClick={handleAddMockRooms} variant="outline" size="sm">
      Add Mock 3D Rooms
    </Button>
  )
}

