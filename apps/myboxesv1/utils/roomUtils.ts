// Add a new utility function to generate 3D data from 2D room data

/**
 * Generates 3D JSON data from 2D room data
 * @param roomData The 2D room data
 * @returns The 3D representation of the room data
 */
export function generate3DDataFromRoom(data: any): any {
  try {
    console.log("Generating 3D data from room:", data.roomName)

    // Create a deep copy of the data to avoid modifying the original
    const data3D = JSON.parse(JSON.stringify(data))

    // Set the data type to 3D
    data3D.dataType = "3d"

    // Add 3D-specific properties
    data3D.version = "1.0"
    data3D.renderSettings = {
      lighting: {
        ambient: 0.5,
        directional: 0.8,
        shadows: true,
      },
      materials: {
        floor: {
          color: "#f0f0f0",
          roughness: 0.8,
          metalness: 0.2,
        },
        walls: {
          color: "#ffffff",
          roughness: 0.9,
          metalness: 0.1,
        },
        ceiling: {
          color: "#ffffff",
          roughness: 0.95,
          metalness: 0.05,
        },
        boxes: {
          defaultColor: "#3b82f6",
          highlightColor: "#ef4444",
          roughness: 0.7,
          metalness: 0.3,
        },
      },
      camera: {
        defaultPosition: [0, 10, 20],
        defaultTarget: [0, 0, 0],
        fov: 50,
        near: 0.1,
        far: 1000,
      },
    }

    // Process storage positions
    data3D.storagePositions = []

    // Handle different room shapes
    if (data.roomShape === "split-side") {
      // Process left side storage positions
      if (data.storageConfig && data.storageConfig.leftSide) {
        const leftSide = data.storageConfig.leftSide
        const rowCount = leftSide.rows.count
        const colCount = leftSide.columns.count
        const stackHeight = leftSide.stackHeight || 1

        // Calculate position offsets based on room dimensions
        const leftLength = data.dimensions.leftSideLength
        const leftWidth = data.dimensions.leftSideWidth

        // Generate positions for each storage location
        for (let row = 0; row < rowCount; row++) {
          for (let col = 0; col < colCount; col++) {
            for (let level = 0; level < stackHeight; level++) {
              // Calculate position (simplified for example)
              const x = (col / colCount) * leftLength - leftLength / 2 + leftLength / colCount / 2
              const z = (row / rowCount) * leftWidth - leftWidth / 2 + leftWidth / rowCount / 2
              const y = level * 1.5 + 0.75 // 1.5m per level, centered at 0.75m

              data3D.storagePositions.push({
                id: `L-${row}-${col}-${level}`,
                position: [x, y, z],
                size: [1, 1.5, 1], // 1m x 1.5m x 1m box
                side: "left",
                row,
                column: col,
                level,
                status: "empty",
              })
            }
          }
        }
      }

      // Process right side storage positions
      if (data.storageConfig && data.storageConfig.rightSide) {
        const rightSide = data.storageConfig.rightSide
        const rowCount = rightSide.rows.count
        const colCount = rightSide.columns.count
        const stackHeight = rightSide.stackHeight || 1

        // Calculate position offsets based on room dimensions
        const rightLength = data.dimensions.rightSideLength
        const rightWidth = data.dimensions.rightSideWidth
        const corridorWidth = data.corridorConfig.width || 0

        // Generate positions for each storage location
        for (let row = 0; row < rowCount; row++) {
          for (let col = 0; col < colCount; col++) {
            for (let level = 0; level < stackHeight; level++) {
              // Calculate position (simplified for example)
              const x = (col / colCount) * rightLength - rightLength / 2 + rightLength / colCount / 2
              const z =
                (row / rowCount) * rightWidth -
                rightWidth / 2 +
                rightWidth / rowCount / 2 +
                data.dimensions.leftSideWidth +
                corridorWidth
              const y = level * 1.5 + 0.75 // 1.5m per level, centered at 0.75m

              data3D.storagePositions.push({
                id: `R-${row}-${col}-${level}`,
                position: [x, y, z],
                size: [1, 1.5, 1], // 1m x 1.5m x 1m box
                side: "right",
                row,
                column: col,
                level,
                status: "empty",
              })
            }
          }
        }
      }
    } else {
      // Process regular room storage positions
      if (data.storageConfig) {
        const rowCount = data.storageConfig.rows.count
        const colCount = data.storageConfig.columns.count
        const stackHeight = data.storageConfig.stackHeight || 1

        // Calculate position offsets based on room dimensions
        const length = data.dimensions.length
        const width = data.dimensions.width

        // Generate positions for each storage location
        for (let row = 0; row < rowCount; row++) {
          for (let col = 0; col < colCount; col++) {
            for (let level = 0; level < stackHeight; level++) {
              // Calculate position (simplified for example)
              const x = (col / colCount) * length - length / 2 + length / colCount / 2
              const z = (row / rowCount) * width - width / 2 + width / rowCount / 2
              const y = level * 1.5 + 0.75 // 1.5m per level, centered at 0.75m

              data3D.storagePositions.push({
                id: `${row}-${col}-${level}`,
                position: [x, y, z],
                size: [1, 1.5, 1], // 1m x 1.5m x 1m box
                row,
                column: col,
                level,
                status: "empty",
              })
            }
          }
        }
      }
    }

    // Add 3D models for walls, floor, ceiling
    data3D.structureElements = []

    // Add floor
    if (data.roomShape === "split-side") {
      const totalLength = Math.max(data.dimensions.leftSideLength, data.dimensions.rightSideLength)
      const totalWidth =
        data.dimensions.leftSideWidth + data.dimensions.rightSideWidth + (data.corridorConfig.width || 0)

      data3D.structureElements.push({
        type: "floor",
        position: [0, 0, 0],
        size: [totalLength, 0.1, totalWidth],
        color: "#f0f0f0",
      })
    } else {
      data3D.structureElements.push({
        type: "floor",
        position: [0, 0, 0],
        size: [data.dimensions.length, 0.1, data.dimensions.width],
        color: "#f0f0f0",
      })
    }

    // Add walls, ceiling, etc. (simplified for example)

    return data3D
  } catch (error) {
    console.error("Error generating 3D data:", error)

    // Return a minimal valid 3D data structure to avoid further errors
    return {
      ...data,
      dataType: "3d",
      version: "1.0",
      storagePositions: [],
      structureElements: [],
      renderSettings: {
        lighting: { ambient: 0.5, directional: 0.8, shadows: true },
        materials: {
          floor: { color: "#f0f0f0" },
          walls: { color: "#ffffff" },
          boxes: { defaultColor: "#3b82f6" },
        },
        camera: { defaultPosition: [0, 10, 20], defaultTarget: [0, 0, 0] },
      },
    }
  }
}

// Add this function to check if a room is a 3D room

/**
 * Checks if the given room data is a 3D room
 * @param roomData The room data to check
 * @returns True if the room is a 3D room, false otherwise
 */
export function is3DRoom(roomData) {
  return roomData.dataType === "3d" || roomData.version === "3D" || roomData.renderType === "3D"
}

// Keep the existing generate3DDataFromRoom function

