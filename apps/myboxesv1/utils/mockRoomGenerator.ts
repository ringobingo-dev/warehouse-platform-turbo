import { v4 as uuidv4 } from "uuid"

/**
 * Generates mock 3D room data for demonstration purposes
 * @returns An array of mock 3D room data objects
 */
export function generateMock3DRooms() {
  // Create IDs for the split room and its sides
  const splitRoomId = uuidv4()
  const eastSideId = uuidv4()
  const westSideId = uuidv4()

  // Create three different mock 3D rooms
  return [
    {
      id: uuidv4(),
      roomName: "Cold Storage 3D",
      roomType: "cold-storage",
      roomCategory: "produce",
      dataType: "3d",
      version: "3D",
      renderType: "3D",
      rows: { count: 8, spacing: 2.5 },
      columns: { count: 12, spacing: 2.5 },
      levels: 4,
      dimensions: {
        width: 30,
        length: 20,
        height: 12,
      },
      cameraPosition: { x: 0, y: 5, z: 10 },
      lighting: {
        ambient: { intensity: 0.5 },
        directional: { intensity: 0.8, position: { x: 5, y: 10, z: 5 } },
      },
    },
    {
      id: uuidv4(),
      roomName: "Square Room 3D",
      roomType: "dry-storage",
      roomCategory: "boxed-goods",
      dataType: "3d",
      version: "3D",
      renderType: "3D",
      rows: { count: 10, spacing: 2 },
      columns: { count: 10, spacing: 2 },
      levels: 3,
      dimensions: {
        width: 20,
        length: 20,
        height: 9,
      },
      cameraPosition: { x: 0, y: 4, z: 8 },
      lighting: {
        ambient: { intensity: 0.6 },
        directional: { intensity: 0.7, position: { x: 3, y: 8, z: 3 } },
      },
    },
    // Main split room
    {
      id: splitRoomId,
      roomName: "Split Storage 3D",
      roomType: "climate-controlled",
      roomCategory: "fruits",
      dataType: "3d",
      version: "3D",
      renderType: "3D",
      rows: { count: 15, spacing: 1.8 },
      columns: { count: 20, spacing: 1.8 },
      levels: 5,
      dimensions: {
        width: 36,
        length: 27,
        height: 15,
      },
      cameraPosition: { x: 0, y: 7, z: 12 },
      lighting: {
        ambient: { intensity: 0.4 },
        directional: { intensity: 0.9, position: { x: 6, y: 12, z: 6 } },
      },
      splitRoom: {
        enabled: true,
        eastSideId: eastSideId,
        westSideId: westSideId,
      },
    },
    // East side of split room
    {
      id: eastSideId,
      roomName: "Split Storage 3D - East Side",
      roomType: "climate-controlled",
      roomCategory: "fruits",
      dataType: "3d",
      version: "3D",
      renderType: "3D",
      rows: { count: 15, spacing: 1.8 },
      columns: { count: 10, spacing: 1.8 },
      levels: 5,
      dimensions: {
        width: 18,
        length: 27,
        height: 15,
      },
      cameraPosition: { x: 9, y: 7, z: 12 },
      lighting: {
        ambient: { intensity: 0.4 },
        directional: { intensity: 0.9, position: { x: 6, y: 12, z: 6 } },
      },
      parentRoomId: splitRoomId,
      sideType: "EAST",
    },
    // West side of split room
    {
      id: westSideId,
      roomName: "Split Storage 3D - West Side",
      roomType: "climate-controlled",
      roomCategory: "fruits",
      dataType: "3d",
      version: "3D",
      renderType: "3D",
      rows: { count: 15, spacing: 1.8 },
      columns: { count: 10, spacing: 1.8 },
      levels: 5,
      dimensions: {
        width: 18,
        length: 27,
        height: 15,
      },
      cameraPosition: { x: -9, y: 7, z: 12 },
      lighting: {
        ambient: { intensity: 0.4 },
        directional: { intensity: 0.9, position: { x: 6, y: 12, z: 6 } },
      },
      parentRoomId: splitRoomId,
      sideType: "WEST",
    },
  ]
}

/**
 * Ensures that mock 3D rooms exist in localStorage
 * If no 3D rooms are found, adds mock rooms to localStorage
 */
export function ensureMock3DRoomsExist() {
  try {
    // Get existing rooms from localStorage
    const savedRoomsData = localStorage.getItem("savedRooms")
    const savedRooms = savedRoomsData ? JSON.parse(savedRoomsData) : []

    // Check if there are any 3D rooms
    const has3DRooms = savedRooms.some(
      (room) => room.dataType === "3d" || room.version === "3D" || room.renderType === "3D",
    )

    // If no 3D rooms exist, add mock rooms
    if (!has3DRooms) {
      console.log("No 3D rooms found, adding mock 3D rooms")
      const mockRooms = generateMock3DRooms()

      // Add mock rooms to existing rooms
      const updatedRooms = [...savedRooms, ...mockRooms]

      // Save back to localStorage
      localStorage.setItem("savedRooms", JSON.stringify(updatedRooms))

      return {
        added: true,
        count: mockRooms.length,
        rooms: mockRooms,
      }
    }

    return {
      added: false,
      count: 0,
      rooms: [],
    }
  } catch (error) {
    console.error("Error ensuring mock 3D rooms exist:", error)
    return {
      added: false,
      count: 0,
      rooms: [],
      error,
    }
  }
}

// TODO: Review for Stage 1 completeness
// This file likely contains @/ imports that need to be updated

