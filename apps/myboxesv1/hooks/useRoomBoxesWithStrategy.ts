"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useBoxContext } from "@/context/BoxContext"
import { useRoomBoxManagerWrapper } from "@/utils/storage/room-box-manager-wrapper"
import type { Box } from "@/types/Box"
import { useToast } from "@/components/ui/use-toast"

export function useRoomBoxesWithStrategy(initialRoomId?: string) {
  const boxContext = useBoxContext()
  const roomBoxManager = useRoomBoxManagerWrapper()
  const { toast } = useToast()

  // State for the selected room
  const [selectedRoomId, setSelectedRoomId] = useState<string>("")

  // Use refs to track initialization and prevent update loops
  const isInitialLoadRef = useRef(true)
  const isSavingRef = useRef(false)
  const prevBoxesRef = useRef<Box[]>([])

  // State to track if data has been loaded
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize by loading the selected room ID
  useEffect(() => {
    async function loadInitialRoom() {
      try {
        const savedRoomId = await roomBoxManager.loadSelectedRoom()
        setSelectedRoomId(initialRoomId || savedRoomId || "")
      } catch (error) {
        console.error("Failed to load initial room:", error)
      }
    }

    loadInitialRoom()
  }, [initialRoomId, roomBoxManager])

  // Initialize by migrating global data if needed - only run once
  useEffect(() => {
    if (selectedRoomId && isInitialLoadRef.current) {
      roomBoxManager.migrateGlobalBoxDataToRooms(selectedRoomId)
      isInitialLoadRef.current = false
    }
  }, [selectedRoomId, roomBoxManager])

  // Load room-specific box data when room changes
  useEffect(() => {
    if (!selectedRoomId) return

    async function loadRoomData() {
      try {
        // Load room-specific data
        const roomData = await roomBoxManager.loadRoomBoxData(selectedRoomId)

        if (roomData) {
          // Prevent saving during this update
          isSavingRef.current = true

          // Update the global context with room-specific data
          boxContext.setBoxes(roomData.boxes)
          boxContext.setLog(roomData.log)
          boxContext.setSnapshots(roomData.snapshots)
          boxContext.setCustomerColorPreferences(roomData.customerColorPreferences)

          // Store current boxes for comparison
          prevBoxesRef.current = roomData.boxes

          console.log(`Loaded ${roomData.boxes.length} boxes for room ${selectedRoomId}`)
        }

        setIsLoaded(true)

        // Allow saving again after a short delay
        setTimeout(() => {
          isSavingRef.current = false
        }, 100)
      } catch (error) {
        console.error(`Error loading data for room ${selectedRoomId}:`, error)
        toast({
          title: "Error Loading Room Data",
          description: "Failed to load box data for this room.",
          variant: "destructive",
        })
      }
    }

    loadRoomData()
  }, [selectedRoomId, boxContext, toast, roomBoxManager])

  // Save room-specific box data when boxes change
  useEffect(() => {
    // Skip saving if:
    // 1. No room is selected
    // 2. Initial data hasn't been loaded yet
    // 3. We're in the middle of loading data
    // 4. Boxes haven't actually changed (deep comparison)
    if (!selectedRoomId || !isLoaded || isSavingRef.current) return

    // Check if boxes have actually changed
    const boxesChanged = JSON.stringify(boxContext.boxes) !== JSON.stringify(prevBoxesRef.current)

    if (boxesChanged) {
      // Update our reference
      prevBoxesRef.current = [...boxContext.boxes]

      // Save the data
      roomBoxManager.saveRoomBoxData(
        selectedRoomId,
        boxContext.boxes,
        boxContext.log,
        boxContext.snapshots,
        boxContext.customerColorPreferences,
      )
    }
  }, [selectedRoomId, boxContext, isLoaded, roomBoxManager])

  // Change the selected room
  const changeRoom = useCallback(
    async (roomId: string) => {
      if (!roomId || roomId === selectedRoomId) return

      // Save current room data before switching
      if (selectedRoomId && isLoaded && !isSavingRef.current) {
        await roomBoxManager.saveRoomBoxData(
          selectedRoomId,
          boxContext.boxes,
          boxContext.log,
          boxContext.snapshots,
          boxContext.customerColorPreferences,
        )
      }

      // Update selected room
      setSelectedRoomId(roomId)
      await roomBoxManager.saveSelectedRoom(roomId)

      // Reset loading state to trigger data load
      setIsLoaded(false)

      toast({
        title: "Room Changed",
        description: `Switched to room ${roomId}`,
        duration: 2000,
      })
    },
    [selectedRoomId, isLoaded, boxContext, toast, roomBoxManager],
  )

  // Add a box to the current room
  const addBoxToRoom = useCallback(
    (box: Box) => {
      if (!selectedRoomId) return

      boxContext.addBox(box)
    },
    [selectedRoomId, boxContext],
  )

  // Remove a box from the current room
  const removeBoxFromRoom = useCallback(
    (boxId: string) => {
      if (!selectedRoomId) return

      boxContext.removeBox(boxId)
    },
    [selectedRoomId, boxContext],
  )

  // Create a snapshot for the current room
  const createRoomSnapshot = useCallback(
    (name: string, description?: string) => {
      if (!selectedRoomId) return

      boxContext.createSnapshot(name, description)
    },
    [selectedRoomId, boxContext],
  )

  return {
    selectedRoomId,
    changeRoom,
    addBoxToRoom,
    removeBoxFromRoom,
    createRoomSnapshot,
    isLoaded,
    // Expose the box context for convenience
    boxes: boxContext.boxes,
    log: boxContext.log,
    snapshots: boxContext.snapshots,
  }
}

