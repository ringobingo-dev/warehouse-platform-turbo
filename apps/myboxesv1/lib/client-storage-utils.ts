/**
 * Client-side utility functions for handling room storage data
 * These functions use localStorage instead of S3/MinIO
 */

// Function to save room data to localStorage
export function saveRoomDataToLocalStorage(data: any, dataType: "2d" | "3d") {
  try {
    const { id, roomName } = data

    if (!id || !roomName) {
      throw new Error("Missing required fields: id or roomName")
    }

    // Get existing rooms or initialize empty array
    const savedRoomsData = localStorage.getItem("savedRooms")
    const savedRooms = savedRoomsData ? JSON.parse(savedRoomsData) : []

    // Check if room already exists
    const existingRoomIndex = savedRooms.findIndex((room: any) => room.id === id)

    if (existingRoomIndex >= 0) {
      // Update existing room
      savedRooms[existingRoomIndex] = data
    } else {
      // Add new room
      savedRooms.push(data)
    }

    // Save back to localStorage
    localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

    return {
      success: true,
      message: `Room ${dataType} data saved successfully to localStorage`,
    }
  } catch (error) {
    console.error(`Error saving ${dataType} room data to localStorage:`, error)
    throw error
  }
}

// Function to save split room sides to localStorage
export function saveSplitRoomSidesToLocalStorage(mainRoom: any, eastSide: any, westSide: any) {
  try {
    // Get existing rooms or initialize empty array
    const savedRoomsData = localStorage.getItem("savedRooms")
    const savedRooms = savedRoomsData ? JSON.parse(savedRoomsData) : []

    // Function to update or add a room
    const updateOrAddRoom = (room: any) => {
      const existingRoomIndex = savedRooms.findIndex((r: any) => r.id === room.id)

      if (existingRoomIndex >= 0) {
        savedRooms[existingRoomIndex] = room
      } else {
        savedRooms.push(room)
      }
    }

    // Update or add all three rooms
    updateOrAddRoom(mainRoom)
    updateOrAddRoom(eastSide)
    updateOrAddRoom(westSide)

    // Save back to localStorage
    localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

    return {
      success: true,
      message: "Split room and both sides saved successfully to localStorage",
    }
  } catch (error) {
    console.error("Error saving split room sides to localStorage:", error)
    throw error
  }
}

// Enhance the loadRoomDataFromLocalStorage function to provide better error handling and logging

// Update the loadRoomDataFromLocalStorage function
export function loadRoomDataFromLocalStorage(roomId: string) {
  try {
    console.log("Loading room data from localStorage for ID:", roomId)
    const savedRoomsData = localStorage.getItem("savedRooms")

    if (!savedRoomsData) {
      console.error("No saved rooms found in localStorage")
      throw new Error("No saved rooms found in localStorage")
    }

    const savedRooms = JSON.parse(savedRoomsData)
    console.log(`Found ${savedRooms.length} rooms in localStorage`)

    const room = savedRooms.find((r: any) => r.id === roomId)

    if (!room) {
      console.error(`Room with ID ${roomId} not found in localStorage`)
      throw new Error(`Room with ID ${roomId} not found in localStorage`)
    }

    console.log("Successfully loaded room data:", {
      id: room.id,
      name: room.roomName || room.name,
      type: room.dataType || room.version || room.renderType,
      isSplitSide: room.sideType ? true : false,
      sideType: room.sideType,
    })

    return room
  } catch (error) {
    console.error("Error loading room data from localStorage:", error)
    throw error
  }
}

// Function to get all rooms from localStorage
export function getAllRoomsFromLocalStorage() {
  try {
    const savedRoomsData = localStorage.getItem("savedRooms")
    return savedRoomsData ? JSON.parse(savedRoomsData) : []
  } catch (error) {
    console.error("Error getting all rooms from localStorage:", error)
    return []
  }
}

// Function to get only 3D rooms from localStorage
export function get3DRoomsFromLocalStorage() {
  try {
    const savedRoomsData = localStorage.getItem("savedRooms")
    if (!savedRoomsData) return []

    const allRooms = JSON.parse(savedRoomsData)

    // Filter to only include 3D rooms
    return allRooms.filter((room) => room.dataType === "3d" || room.version === "3D" || room.renderType === "3D")
  } catch (error) {
    console.error("Error getting 3D rooms from localStorage:", error)
    return []
  }
}

// TODO: Review for Stage 1 completeness
// This file likely contains @/ imports that need to be updated

