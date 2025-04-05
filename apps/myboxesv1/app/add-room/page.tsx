"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useBoxContext } from "@/context/BoxContext"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import { generate3DDataFromRoom } from "@/utils/roomUtils" // Import the 3D data generation function

// Import our new components
import { StepProgressIndicator } from "@/components/add-room/step-progress-indicator"
import { RoomDetailsForm } from "@/components/add-room/room-details-form"
import { RoomSummary } from "@/components/add-room/room-summary"
import { AccessConfigSection } from "@/components/add-room/access-config-section"
import { StorageLayoutSection } from "@/components/add-room/storage-layout-section"
import { RoomSaveForm } from "@/components/add-room/room-save-form"
import { RoomPreviewForm } from "@/components/add-room/room-preview-form"
import { RoomLayoutVisualization } from "@/components/room-layout-visualization"
import { SplitSideRoomVisualization } from "@/components/split-side-room-visualization"
import { StepTransitionHandler } from "@/components/step-transition-handler"
import { AddRoomContainer } from "@/components/add-room/add-room-container"
import { StandardizedStepContent } from "@/components/add-room/standardized-step-content"

// Import the StepContainer
import { StepContainer } from "@/components/add-room/step-container"

// Add this import at the top of the file, after the other imports
import "./add-room-styles.css"

// Define types for door and corridor configuration
interface DoorConfig {
  wall: "front" | "back" | "left" | "right"
  offset: number
  width: number
}

interface CorridorConfig {
  wall: "front" | "back" | "left" | "right"
  width: number
}

export default function AddRoomPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setRows, setColumns, setLevels, setBoxes } = useBoxContext()

  // Room details (Step 1)
  const [roomName, setRoomName] = useState("")
  const [roomCategory, setRoomCategory] = useState("")
  const [roomType, setRoomType] = useState("")
  const [roomShape, setRoomShape] = useState("")
  const [length, setLength] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add these new state variables after the existing state declarations
  const [leftSideLength, setLeftSideLength] = useState<number>(10)
  const [leftSideWidth, setLeftSideWidth] = useState<number>(10)
  const [rightSideLength, setRightSideLength] = useState<number>(10)
  const [rightSideWidth, setRightSideWidth] = useState<number>(10)

  const [leftSideName, setLeftSideName] = useState<string>("EAST")
  const [rightSideName, setRightSideName] = useState<string>("WEST")

  const [doorConfig, setDoorConfig] = useState<DoorConfig>({
    wall: "left",
    offset: 85,
    width: 2, // Changed from 2.5 to 2
  })

  const [corridorConfig, setCorridorConfig] = useState<CorridorConfig>({
    wall: "front",
    width: 2.5, // Changed from 0 to 2.5
  })

  const [storageConfig, setStorageConfig] = useState({
    rows: {
      count: 0,
      startWall: "front" as "front" | "back",
    },
    columns: {
      count: 0,
    },
    stackHeight: 1,
    // Add configurations for split-side rooms
    leftSide: {
      rows: {
        count: 0,
        startWall: "front" as "front" | "back",
      },
      columns: {
        count: 0,
      },
      stackHeight: 1,
    },
    rightSide: {
      rows: {
        count: 0,
      },
      startWall: "front" as "front" | "back",
      columns: {
        count: 0,
      },
      stackHeight: 1,
    },
  })

  // Save Room (Step 3) state
  const [roomDescription, setRoomDescription] = useState("")
  const [roomStatus, setRoomStatus] = useState("active")
  const [confirmChecklist, setConfirmChecklist] = useState({
    dimensions: false,
    layout: false,
    access: false,
  })

  useEffect(() => {
    // Update corridor width when room shape changes
    if (roomShape === "split-side") {
      setCorridorConfig((prev) => ({
        ...prev,
        wall: "center", // Special value for split-side rooms
        width: 3.5, // Default corridor width for split-side rooms (changed from 2 to 3.5)
      }))

      // For split-side rooms, door is always on front wall at the center
      setDoorConfig((prev) => ({
        ...prev,
        wall: "front",
        offset: 50, // Center position
        width: 3, // Default door width for split-side rooms (changed from 2 to 3)
      }))
    } else if (roomShape === "rectangle") {
      // For rectangle rooms, set door to left wall with 85% offset and 2m width
      setDoorConfig((prev) => ({
        ...prev,
        wall: "left",
        offset: 85,
        width: 2,
      }))
    } else {
      // For other room shapes, keep the corridor width as is or set a default
      setCorridorConfig((prev) => ({
        ...prev,
        wall: prev.wall, // Keep the current wall
        width: prev.width || 0, // Keep current width or default to 0
      }))
    }
  }, [roomShape])

  // Flag to control visibility of storage layout section
  const [showStorageLayout, setShowStorageLayout] = useState(false)

  // Flags for each side's configuration status
  const [leftSideConfigured, setLeftSideConfigured] = useState(false)
  const [rightSideConfigured, setRightSideConfigured] = useState(false)

  // Add these state variables after the existing state declarations
  const [accessConfigApplied, setAccessConfigApplied] = useState(false)

  // Hidden created date field
  const createdDate = new Date().toISOString()

  // For steps
  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps, setTotalSteps] = useState(4) // Now we have 4 steps: Details, Layout, Save Room, Preview

  // Room data for preview and saving
  const [roomData, setRoomData] = useState<any>(null)

  // Calculate rows and columns based on room shape and storage configuration
  const calculatedRows =
    roomShape === "split-side"
      ? Math.max(storageConfig.leftSide.rows.count, storageConfig.rightSide.rows.count)
      : storageConfig.rows.count

  const calculatedColumns =
    roomShape === "split-side"
      ? storageConfig.leftSide.columns.count + storageConfig.rightSide.columns.count
      : storageConfig.columns.count

  // Add these useEffect hooks after the existing useEffect hooks
  useEffect(() => {
    // Reset left side configuration status when any left side value changes
    if (leftSideConfigured) {
      setLeftSideConfigured(false)
    }
  }, [
    storageConfig.leftSide.rows.count,
    storageConfig.leftSide.rows.startWall,
    storageConfig.leftSide.columns.count,
    storageConfig.leftSide.stackHeight,
  ])

  useEffect(() => {
    // Reset right side configuration status when any right side value changes
    if (rightSideConfigured) {
      setRightSideConfigured(false)
    }
  }, [
    storageConfig.rightSide.rows.count,
    storageConfig.rightSide.rows.startWall,
    storageConfig.rightSide.columns.count,
    storageConfig.rightSide.stackHeight,
  ])

  // Create a ref to access the RoomSaveForm methods
  const roomSaveFormRef = useRef<{
    handleSave: () => Promise<void>
  }>(null)

  // Other state and handlers...
  const handleSave = async () => {
    // Additional save logic for the step component
    console.log("Step3SaveRoom save handler executed")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!roomName.trim()) {
        throw new Error("Room name is required")
      }

      if (!roomCategory) {
        throw new Error("Room category is required")
      }

      if (!roomType) {
        throw new Error("Room type is required")
      }

      if (!roomShape) {
        throw new Error("Room shape is required")
      }

      // Validate dimensions based on room shape
      if (roomShape === "split-side") {
        if (!leftSideLength || leftSideLength <= 0) {
          throw new Error("Left side length must be a positive number")
        }
        if (!leftSideWidth || leftSideWidth <= 0) {
          throw new Error("Left side width must be a positive number")
        }
        if (!rightSideLength || rightSideLength <= 0) {
          throw new Error("Right side length must be a positive number")
        }
        if (!rightSideWidth || rightSideWidth <= 0) {
          throw new Error("Right side width must be a positive number")
        }
      } else {
        if (!length || length <= 0) {
          throw new Error("Length must be a positive number")
        }
        if (!width || width <= 0) {
          throw new Error("Width must be a positive number")
        }
      }

      // Instead of creating the room immediately, move to step 2
      setCurrentStep(2)
      setIsSubmitting(false)

      // Show a toast notification for successful validation
      toast({
        title: "Room Details Validated",
        description: "Now you can define the detailed layout of your room",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to validate room details",
        variant: "destructive",
        duration: 5000,
      })
      setIsSubmitting(false)
    }
  }

  // Update the handleMoveToPreview function to be more robust
  const handleMoveToPreview = () => {
    try {
      // Validate required fields
      if (!roomDescription.trim()) {
        toast({
          title: "Missing Information",
          description: "Please provide a room description",
          variant: "destructive",
        })
        return
      }

      console.log("Starting room save process...")

      // Create a unique ID for the room
      const roomId = Date.now().toString()

      // Create the room data object that will be saved
      const data = {
        id: roomId,
        version: "1.0",
        dataType: "2d",
        roomName,
        roomCategory,
        roomType,
        roomShape,
        dimensions:
          roomShape === "split-side"
            ? {
                leftSideLength,
                leftSideWidth,
                rightSideLength,
                rightSideWidth,
                leftSideName,
                rightSideName,
                totalLength: Math.max(leftSideLength, rightSideLength),
                totalWidth: leftSideWidth + rightSideWidth + corridorConfig.width,
              }
            : { length, width },
        createdDate,
        lastUpdated: new Date().toISOString(),
        doorConfig,
        corridorConfig,
        storageConfig,
        rows: {
          count: calculatedRows,
          startWall: storageConfig.rows.startWall,
        },
        columns: {
          count: calculatedColumns,
        },
        levels: storageConfig.stackHeight > 0 ? storageConfig.stackHeight : 4,
        visualProperties: {
          gridColor: "#3b82f6",
          doorColor: "#ef4444",
          corridorColor: "#10b981",
          backgroundColor: "#f8fafc",
          labelColor: "#1e293b",
        },
        description: roomDescription,
        status: roomStatus,
        boxes: [],
        log: [
          {
            timestamp: new Date().toISOString(),
            action: "ROOM_CREATED",
            details: `Room "${roomName}" created with ${calculatedRows} rows, ${calculatedColumns} columns, and ${
              roomShape === "split-side"
                ? Math.max(storageConfig.leftSide.stackHeight, storageConfig.rightSide.stackHeight)
                : storageConfig.stackHeight
            } levels`,
          },
        ],
      }

      // Sanitize room name for filenames
      const sanitizedRoomName = roomName.replace(/[^a-z0-9]/gi, "_").toLowerCase()

      // Create filenames for 2D and 3D data
      const filename2D = `${sanitizedRoomName}_${roomId}_2d.json`
      const filename3D = `${sanitizedRoomName}_${roomId}_3d.json`

      // Save 2D data to localStorage
      localStorage.setItem(filename2D, JSON.stringify(data))

      // Generate 3D data from 2D data
      console.log("Generating 3D data...")
      let data3D
      try {
        data3D = generate3DDataFromRoom(data)
        console.log("3D data generated successfully")
      } catch (error) {
        console.error("Error generating 3D data:", error)
        // Create a minimal valid 3D data structure
        data3D = {
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

      // Save 3D data to localStorage
      localStorage.setItem(filename3D, JSON.stringify(data3D))

      // Add log entry for 3D conversion
      data.log.push({
        timestamp: new Date().toISOString(),
        action: "CONVERTED_TO_3D",
        details: `Room "${roomName}" converted to 3D format`,
      })

      // For split-side rooms, create separate entries for each side
      let eastSideFilename2D, eastSideFilename3D, westSideFilename2D, westSideFilename3D

      if (roomShape === "split-side") {
        // Add specific log entries for each side
        data.log.push({
          timestamp: new Date().toISOString(),
          action: "SPLIT_SIDE_CREATED",
          details: `${leftSideName} side: ${storageConfig.leftSide.rows.count} rows, ${storageConfig.leftSide.columns.count} columns, ${storageConfig.leftSide.stackHeight} levels`,
        })

        data.log.push({
          timestamp: new Date().toISOString(),
          action: "SPLIT_SIDE_CREATED",
          details: `${rightSideName} side: ${storageConfig.rightSide.rows.count} rows, ${storageConfig.rightSide.columns.count} columns, ${storageConfig.rightSide.stackHeight} levels`,
        })

        // Create separate room data objects for each side (for future use if needed)
        const eastSideData = {
          ...data,
          id: `${roomId}-east`,
          roomName: `${roomName} - ${leftSideName}`,
          roomShape: "rectangle",
          dimensions: {
            length: leftSideLength,
            width: leftSideWidth,
          },
          rows: {
            count: storageConfig.leftSide.rows.count,
            startWall: storageConfig.leftSide.rows.startWall,
          },
          columns: {
            count: storageConfig.leftSide.columns.count,
          },
          levels: storageConfig.leftSide.stackHeight,
          parentRoomId: roomId,
          sideName: leftSideName,
        }

        const westSideData = {
          ...data,
          id: `${roomId}-west`,
          roomName: `${roomName} - ${rightSideName}`,
          roomShape: "rectangle",
          dimensions: {
            length: rightSideLength,
            width: rightSideWidth,
          },
          rows: {
            count: storageConfig.rightSide.rows.count,
            startWall: storageConfig.rightSide.rows.startWall,
          },
          columns: {
            count: storageConfig.rightSide.columns.count,
          },
          levels: storageConfig.rightSide.stackHeight,
          parentRoomId: roomId,
          sideName: rightSideName,
        }

        // Create filenames for side-specific 2D and 3D data
        eastSideFilename2D = `${sanitizedRoomName}_${roomId}_${leftSideName}_2d.json`
        eastSideFilename3D = `${sanitizedRoomName}_${roomId}_${leftSideName}_3d.json`
        westSideFilename2D = `${sanitizedRoomName}_${roomId}_${rightSideName}_2d.json`
        westSideFilename3D = `${sanitizedRoomName}_${roomId}_${rightSideName}_3d.json`

        // Save 2D data for each side
        localStorage.setItem(eastSideFilename2D, JSON.stringify(eastSideData))
        localStorage.setItem(westSideFilename2D, JSON.stringify(westSideData))

        // Generate and save 3D data for each side
        let eastSideData3D, westSideData3D

        try {
          eastSideData3D = generate3DDataFromRoom(eastSideData)
          westSideData3D = generate3DDataFromRoom(westSideData)
        } catch (error) {
          console.error("Error generating side-specific 3D data:", error)
          // Create minimal valid 3D data structures
          eastSideData3D = {
            ...eastSideData,
            dataType: "3d",
            version: "1.0",
            storagePositions: [],
            structureElements: [],
          }
          westSideData3D = {
            ...westSideData,
            dataType: "3d",
            version: "1.0",
            storagePositions: [],
            structureElements: [],
          }
        }

        localStorage.setItem(eastSideFilename3D, JSON.stringify(eastSideData3D))
        localStorage.setItem(westSideFilename3D, JSON.stringify(westSideData3D))
      } else {
        // Add dedicated handling for non-split-side rooms
        data.log.push({
          timestamp: new Date().toISOString(),
          action: "STANDARD_ROOM_CREATED",
          details: `Standard room with ${storageConfig.rows.count} rows, ${storageConfig.columns.count}, and ${storageConfig.stackHeight} levels`,
        })

        // Create a standardized data structure that matches what the preview expects
        const standardRoomData = {
          id: `${roomId}-standard`,
          roomName: roomName,
          roomShape: roomShape,
          dimensions: {
            length: length,
            width: width,
          },
          rows: {
            count: storageConfig.rows.count,
            startWall: storageConfig.rows.startWall,
          },
          columns: {
            count: storageConfig.columns.count,
          },
          levels: storageConfig.stackHeight,
          // Add any other fields that might be needed for preview
        }

        // If needed, save this standardized data
        const standardRoomFilename = `${sanitizedRoomName}_${roomId}_standard.json`
        localStorage.setItem(standardRoomFilename, JSON.stringify(standardRoomData))

        // Reference this file in the main data object if needed
        data.standardRoomFile = standardRoomFilename
      }

      // Create a simplified room object for the list view
      const savedRoom = {
        id: roomId,
        roomName,
        roomCategory,
        roomType,
        roomShape,
        length: roomShape === "split-side" ? Math.max(leftSideLength, rightSideLength) : length,
        width: roomShape === "split-side" ? leftSideWidth + rightSideWidth + corridorConfig.width : width,
        rows: {
          count: calculatedRows,
        },
        columns: {
          count: calculatedColumns,
        },
        levels: storageConfig.stackHeight > 0 ? storageConfig.stackHeight : 4,
        createdDate: new Date().toISOString(),
        filename2D: filename2D,
        filename3D: filename3D,
        dataType: "3d", // Mark as 3D room
        // For split-side rooms, add references to the side-specific files
        sideFiles:
          roomShape === "split-side"
            ? {
                east: {
                  "2d": eastSideFilename2D,
                  "3d": eastSideFilename3D,
                },
                west: {
                  "2d": westSideFilename2D,
                  "3d": westSideFilename3D,
                },
              }
            : undefined,
      }

      // Get existing saved rooms or initialize empty array
      const existingSavedRooms = localStorage.getItem("savedRooms")
      const savedRooms = existingSavedRooms ? JSON.parse(existingSavedRooms) : []

      // Add new room to the array
      savedRooms.push(savedRoom)

      // Save updated array back to localStorage
      localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

      // Store the current room data for preview
      setRoomData(data)

      // Ensure boxCount is a simple number, not an object
      setBoxCount(0)

      // Show success message
      toast({
        title: "Room Saved",
        description: `${roomName} has been saved successfully. Please review the final preview.`,
        duration: 3000,
      })

      // Force a direct state update to step 4
      console.log("Directly setting step to 4")
      setCurrentStep(4)
    } catch (error) {
      console.error("Error in handleMoveToPreview:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save room",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Add a function to go back to the previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Calculate room capacity based on dimensions
  const calculateCapacity = () => {
    const rows = Math.floor(length)
    const columns = Math.floor(width)
    return rows * columns * 4 // Assuming 4 levels
  }

  // Calculate floor area
  const calculateFloorArea = () => {
    if (roomShape === "split-side") {
      return leftSideLength * leftSideWidth + rightSideLength * rightSideWidth
    }
    return length * width
  }

  // Calculate volume (assuming 4m height)
  const calculateVolume = () => {
    return calculateFloorArea() * 4
  }

  // Calculate total storage positions
  const calculateTotalPositions = () => {
    if (roomShape === "split-side") {
      return (
        storageConfig.leftSide.rows.count * storageConfig.leftSide.columns.count +
        storageConfig.rightSide.rows.count * storageConfig.rightSide.columns.count
      )
    }
    return storageConfig.rows.count * storageConfig.columns.count
  }

  // Get max stack height
  const getMaxStackHeight = () => {
    if (roomShape === "split-side") {
      return Math.max(storageConfig.leftSide.stackHeight, storageConfig.rightSide.stackHeight)
    }
    return storageConfig.stackHeight
  }

  const handleApplyAccessConfig = () => {
    // Validate door offset is within bounds (0-90%)
    if (doorConfig.offset < 0 || doorConfig.offset > 90) {
      toast({
        title: "Invalid Door Position",
        description: "Door offset must be between 0% and 90% of the wall length",
        variant: "destructive",
      })
      return
    }

    // Validate corridor width is reasonable (0-5m)
    if (corridorConfig.width < 0 || corridorConfig.width > 5) {
      toast({
        title: "Invalid Corridor Width",
        description: "Corridor width must be between 0 and 5 meters",
        variant: "destructive",
      })
      return
    }

    // Validate door and corridor are not on opposing walls
    if (
      (doorConfig.wall === "front" && corridorConfig.wall === "back") ||
      (doorConfig.wall === "back" && corridorConfig.wall === "front") ||
      (doorConfig.wall === "left" && corridorConfig.wall === "right") ||
      (doorConfig.wall === "right" && corridorConfig.wall === "left")
    ) {
      toast({
        title: "Invalid Configuration",
        description: "Door and corridor cannot be on opposing walls",
        variant: "destructive",
      })
      return
    }

    // Set default values for rows and columns based on room dimensions
    // but preserve any existing values the user has already set
    setStorageConfig((prev) => {
      if (roomShape === "split-side") {
        return {
          ...prev,
          leftSide: {
            rows: {
              count: prev.leftSide.rows.count > 0 ? prev.leftSide.rows.count : 0,
              startWall: "front" as "front" | "back",
            },
            columns: {
              count: prev.leftSide.columns.count > 0 ? prev.leftSide.columns.count : 0,
            },
            stackHeight: prev.leftSide.stackHeight > 0 ? prev.leftSide.stackHeight : 0,
          },
          rightSide: {
            rows: {
              count: prev.rightSide.rows.count > 0 ? prev.rightSide.rows.count : 0,
              startWall: "front" as "front" | "back",
            },
            columns: {
              count: prev.rightSide.columns.count > 0 ? prev.rightSide.columns.count : 0,
            },
            stackHeight: prev.rightSide.stackHeight > 0 ? prev.rightSide.stackHeight : 0,
          },
        }
      } else {
        return {
          ...prev,
          rows: {
            count: prev.rows.count > 0 ? prev.rows.count : 0,
            startWall: "front" as "front" | "back",
          },
          columns: {
            count: prev.columns.count > 0 ? prev.columns.count : 0,
          },
          stackHeight: prev.stackHeight > 0 ? prev.stackHeight : 0,
        }
      }
    })

    // Show the storage layout section
    setShowStorageLayout(true)

    // Toggle the access config applied state
    setAccessConfigApplied(true)

    // Show success message
    toast({
      title: "Access Configuration Applied",
      description:
        "Storage layout controls are now active. Adjust the rows and columns to organize your storage space.",
      duration: 3000,
    })

    // Scroll to the storage layout section
    const storageLayoutSection = document.getElementById("storage-layout-section")
    if (storageLayoutSection) {
      storageLayoutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handler for applying left side configuration
  const handleApplyLeftSideConfig = () => {
    // Validate left side configuration
    if (storageConfig.leftSide.rows.count === 0 || storageConfig.leftSide.columns.count === 0) {
      toast({
        title: "Invalid Configuration",
        description: `Please select the number of rows and columns for the ${leftSideName} side`,
        variant: "destructive",
      })
      return
    }

    // Mark left side as configured
    setLeftSideConfigured(true)

    // Show success message
    toast({
      title: `${leftSideName} Side Configuration Applied`,
      description: `Storage layout for ${leftSideName} side has been configured with ${storageConfig.leftSide.rows.count} rows and ${storageConfig.leftSide.columns.count} columns.`,
      duration: 3000,
    })
  }

  // Handler for applying right side configuration
  const handleApplyRightSideConfig = () => {
    // Validate right side configuration
    if (storageConfig.rightSide.rows.count === 0 || storageConfig.rightSide.columns.count === 0) {
      toast({
        title: "Invalid Configuration",
        description: `Please select the number of rows and columns for the ${rightSideName} side`,
        variant: "destructive",
      })
      return
    }

    // Mark right side as configured
    setRightSideConfigured(true)

    // Show success message
    toast({
      title: `${rightSideName} Side Configuration Applied`,
      description: `Storage layout for ${rightSideName} side has been configured with ${storageConfig.rightSide.rows.count} rows and ${storageConfig.rightSide.columns.count} columns.`,
      duration: 3000,
    })
  }

  // Get step title and description
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Step 1: Room Details"
      case 2:
        return "Step 2: Define Room Layout"
      case 3:
        return "Step 3: Save Room"
      case 4:
        return "Step 4: Preview and Confirm"
      default:
        return "Add New Room"
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Enter the basic information about your new storage room"
      case 2:
        return "Customize the detailed layout of your storage room"
      case 3:
        return "Add additional information and save your room configuration"
      case 4:
        return "Review your room configuration before saving"
      default:
        return ""
    }
  }

  // Find the handlePreparePreview function and change it to set currentStep to 3 instead of 4
  const handlePreparePreview = () => {
    setCurrentStep(3)
  }

  const onFinalSubmit = () => {
    try {
      // Get the current room data
      if (!roomData || !roomData.id) {
        throw new Error("Room data is missing or invalid")
      }

      const roomId = roomData.id
      const sanitizedRoomName = roomName.replace(/[^a-z0-9]/gi, "_").toLowerCase()

      // Log the final submission
      console.log(`Finalizing room ${roomName} (ID: ${roomId})`)

      // Add a final log entry to the room data
      roomData.log.push({
        timestamp: new Date().toISOString(),
        action: "ROOM_FINALIZED",
        details: `Room "${roomName}" finalized and saved to storage`,
      })

      // Update the room data in localStorage
      const filename2D = `${sanitizedRoomName}_${roomId}_2d.json`
      localStorage.setItem(filename2D, JSON.stringify(roomData))

      // Show success message
      toast({
        title: "Room Finalized",
        description: `${roomName} has been finalized and saved successfully.`,
        duration: 3000,
      })

      // Navigate to the dimensions page to view the new room
      router.push("/dimensions")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to finalize room",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Add state variables for 3D room view
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [boxCount, setBoxCount] = useState<number>(0)
  const [refreshKey, setRefreshKey] = useState(0)

  // Function to handle refresh
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  // Add error handling for step transitions
  const safeSetCurrentStep = (step: number) => {
    try {
      console.log(`Transitioning from step ${currentStep} to step ${step}`)
      setCurrentStep(step)
    } catch (error) {
      console.error("Error during step transition:", error)
      // Fallback to a safe step if there's an error
      setCurrentStep(1)
      toast({
        title: "Navigation Error",
        description: "There was an error navigating between steps. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add this after your other useEffect hooks
  useEffect(() => {
    console.log(`Current step changed to: ${currentStep}`)
  }, [currentStep])

  return (
    <div>
      {/* Other components and steps */}

      {/* RoomSaveForm with ref */}
      {/* <RoomSaveForm
        ref={roomSaveFormRef}
        roomShape="rectangle"
        length={10}
        width={8}
        doorConfig={{ wall: "front", offset: 2, width: 1 }}
        corridorConfig={{ wall: "front", width: 2 }}
        storageConfig={{
          rows: { count: 4, startWall: "back" },
          columns: { count: 3 },
          stackHeight: 3
        }}
        leftSideLength={0}
        leftSideWidth={0}
        rightSideLength={0}
        rightSideWidth={0}
        leftSideName=""
        rightSideName=""
        leftSideConfigured={false}
        rightSideConfigured={false}
        roomDescription=""
        setRoomDescription={() => {}}
        roomStatus="active"
        setRoomStatus={() => {}}
        calculateFloorArea={() => 80}
        calculateTotalPositions={() => 12}
        getMaxStackHeight={() => 3}
        onSave={() => console.log("Room saved")}
      /> */}

      {/* Step3SaveRoom with roomSaveFormRef */}
      {/* <Step3SaveRoom
        handleBack={() => console.log("Back button clicked")}
        handleSave={handleSave}
        isValid={true}
        roomSaveFormRef={roomSaveFormRef}
      /> */}

      <AddRoomContainer>
        {/* Existing content */}
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Add Room</h1>
            <p className="text-muted-foreground">Create and configure a new storage room</p>
          </div>
          <div className="w-full">
            {/* Step content */}
            {/* {currentStep === 1 && <Step1RoomDetails {...stepProps} />}
          {currentStep === 2 && <Step2RoomLayout {...stepProps} />}
          {currentStep === 3 && <Step3SaveRoom {...stepProps} />}
          {currentStep === 4 && <Step4Preview {...stepProps} />} */}
            <div className="w-full max-w-full py-6">
              {/* Step Progress Indicator */}
              <StepProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

              {/* Add the transition handler */}
              <StepTransitionHandler
                currentStep={currentStep}
                setCurrentStep={safeSetCurrentStep}
                totalSteps={totalSteps}
              />

              <form onSubmit={handleSubmit} className="w-full max-w-full">
                <Card className="w-full">
                  <CardHeader className="pb-4">
                    <CardTitle>{getStepTitle()}</CardTitle>
                    <CardDescription>{getStepDescription()}</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full max-w-none card-content-full-width p-0 sm:p-6">
                    <div className="w-full px-0 sm:px-6">
                      <StepContainer>
                        {currentStep === 1 ? (
                          <StandardizedStepContent>
                            <RoomDetailsForm
                              roomName={roomName}
                              setRoomName={setRoomName}
                              roomCategory={roomCategory}
                              setRoomCategory={setRoomCategory}
                              roomType={roomType}
                              setRoomType={setRoomType}
                              roomShape={roomShape}
                              setRoomShape={setRoomShape}
                              length={length}
                              setLength={setLength}
                              width={width}
                              setWidth={setWidth}
                              leftSideName={leftSideName}
                              setLeftSideName={setLeftSideName}
                              leftSideLength={leftSideLength}
                              setLeftSideLength={setLeftSideLength}
                              leftSideWidth={leftSideWidth}
                              setLeftSideWidth={setLeftSideWidth}
                              rightSideName={rightSideName}
                              setRightSideName={setRightSideName}
                              rightSideLength={rightSideLength}
                              setRightSideLength={setRightSideLength}
                              rightSideWidth={rightSideWidth}
                              setRightSideWidth={setRightSideWidth}
                            />
                          </StandardizedStepContent>
                        ) : currentStep === 2 ? (
                          /* Step 2: Define Room Layout */
                          <StandardizedStepContent>
                            <div className="space-y-6 w-full">
                              {/* Room Summary */}
                              <RoomSummary roomName={roomName} roomType={roomType} roomShape={roomShape} />

                              {/* Room Layout Visualization */}
                              <div className="border rounded-lg p-4 mb-4 w-full">
                                <h3 className="text-lg font-medium mb-4">Room Layout Visualization</h3>
                                {/* Updated container with min-height and consistent sizing */}
                                <div className="w-full h-[400px] min-h-[350px] bg-white rounded-md border overflow-hidden flex items-center justify-center">
                                  {roomShape === "split-side" ? (
                                    <SplitSideRoomVisualization
                                      leftSideLength={leftSideLength}
                                      leftSideWidth={leftSideWidth}
                                      rightSideLength={rightSideLength}
                                      rightSideWidth={rightSideWidth}
                                      leftSideName={leftSideName}
                                      rightSideName={rightSideName}
                                      doorConfig={doorConfig}
                                      corridorConfig={corridorConfig}
                                      storageConfig={storageConfig}
                                      leftSideConfig={storageConfig.leftSide}
                                      rightSideConfig={storageConfig.rightSide}
                                      leftSideConfigured={leftSideConfigured}
                                      rightSideConfigured={rightSideConfigured}
                                    />
                                  ) : (
                                    <RoomLayoutVisualization
                                      roomShape={roomShape}
                                      length={length}
                                      width={width}
                                      doorConfig={doorConfig}
                                      corridorConfig={corridorConfig}
                                      storageConfig={storageConfig}
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Layout Editor */}
                              <div className="border rounded-lg w-full">
                                {/* Access Configuration Section */}
                                <AccessConfigSection
                                  roomShape={roomShape}
                                  doorConfig={doorConfig}
                                  setDoorConfig={setDoorConfig}
                                  corridorConfig={corridorConfig}
                                  setCorridorConfig={setCorridorConfig}
                                  accessConfigApplied={accessConfigApplied}
                                  handleApplyAccessConfig={handleApplyAccessConfig}
                                />

                                {/* Storage Layout Section */}
                                <StorageLayoutSection
                                  roomShape={roomShape}
                                  storageConfig={storageConfig}
                                  setStorageConfig={setStorageConfig}
                                  showStorageLayout={showStorageLayout}
                                  leftSideConfigured={leftSideConfigured}
                                  rightSideConfigured={rightSideConfigured}
                                  leftSideName={leftSideName}
                                  rightSideName={rightSideName}
                                  handleApplyLeftSideConfig={handleApplyLeftSideConfig}
                                  handleApplyRightSideConfig={handleApplyRightSideConfig}
                                />
                              </div>
                            </div>
                          </StandardizedStepContent>
                        ) : currentStep === 3 ? (
                          /* Step 3: Save Room */
                          <StandardizedStepContent className="full-width-container">
                            <RoomSaveForm
                              roomShape={roomShape}
                              length={length}
                              width={width}
                              doorConfig={doorConfig}
                              corridorConfig={corridorConfig}
                              storageConfig={storageConfig}
                              leftSideLength={leftSideLength}
                              leftSideWidth={leftSideWidth}
                              rightSideLength={rightSideLength}
                              rightSideWidth={rightSideWidth}
                              leftSideName={leftSideName}
                              rightSideName={rightSideName}
                              leftSideConfigured={leftSideConfigured}
                              rightSideConfigured={rightSideConfigured}
                              roomDescription={roomDescription}
                              setRoomDescription={setRoomDescription}
                              roomStatus={roomStatus}
                              setRoomStatus={setRoomStatus}
                              calculateFloorArea={calculateFloorArea}
                              calculateTotalPositions={calculateTotalPositions}
                              getMaxStackHeight={getMaxStackHeight}
                            />
                          </StandardizedStepContent>
                        ) : (
                          /* Step 4: Preview and Confirm */
                          <StandardizedStepContent className="full-width-container">
                            <RoomPreviewForm
                              roomData={roomData}
                              selectedRoom={selectedRoom}
                              boxCount={boxCount}
                              refreshKey={refreshKey}
                              handleRefresh={handleRefresh}
                              roomShape={roomShape}
                              doorConfig={doorConfig}
                              corridorConfig={corridorConfig}
                              leftSideName={leftSideName}
                              rightSideName={rightSideName}
                            />
                          </StandardizedStepContent>
                        )}
                      </StepContainer>
                    </div>

                    {/* Hidden Created Date field - not shown in UI but will be saved */}
                    <input type="hidden" name="createdDate" value={createdDate} />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    {currentStep === 1 ? (
                      <>
                        <Button variant="outline" type="button" onClick={() => router.back()} size="lg">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} size="lg">
                          {isSubmitting ? "Validating..." : "Next: Define Layout"}
                        </Button>
                      </>
                    ) : currentStep === 2 ? (
                      <>
                        <Button variant="outline" type="button" onClick={handlePreviousStep} size="lg">
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
                        </Button>
                        {showStorageLayout ? (
                          <Button
                            type="button"
                            onClick={handlePreparePreview}
                            size="lg"
                            disabled={
                              roomShape === "split-side"
                                ? !leftSideConfigured || !rightSideConfigured
                                : storageConfig.rows.count === 0 || storageConfig.columns.count === 0
                            }
                          >
                            Next: Save Room <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button type="button" disabled size="lg">
                            Next: Save Room <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        <Button variant="outline" type="button" onClick={handlePreviousStep} size="lg">
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Layout
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            console.log("Save 3D Room button clicked")
                            // Ensure boxCount is set to a number before moving to preview
                            setBoxCount(0)
                            handleMoveToPreview()
                          }}
                          size="lg"
                          disabled={!roomDescription.trim()}
                        >
                          Save 3D Room <Save className="ml-2 h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" type="button" onClick={handlePreviousStep} size="lg">
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Save Room
                        </Button>
                        <Button type="button" onClick={onFinalSubmit} size="lg">
                          <Save className="mr-2 h-4 w-4" /> Save Room
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </AddRoomContainer>
    </div>
  )
}

