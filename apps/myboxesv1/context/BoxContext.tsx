"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode, useMemo, useCallback } from "react"
import type { FilterCriteria } from "@/types/Box"
import { handleError } from "@/utils/errorHandling"
import { toast } from "@/components/ui/use-toast"
import { useBoxOperations } from "@/hooks/useBoxOperations"
import { ROOM_DIMENSIONS, UI_CONSTANTS } from "@/config/constants"
import { saveBoxData, loadBoxData } from "@/utils/storage-utils"
import { BoxAddMagic } from "@/components/box-add-magic"
import { BoxRemovalMagic } from "@/components/box-removal-magic"
import boxData from "@/data/boxData.json"

// Define the shape of our box data
interface Box {
  id: string
  position: [number, number, number]
  size: [number, number, number]
  color: string
  timestamp: number
}

interface LogEntry {
  action: string
  boxId?: string
  timestamp: number
  details?: any
}

interface Snapshot {
  id: string
  name: string
  timestamp: number
  boxes: Box[]
  description?: string
}

interface BoxContextType {
  // Room configuration
  rows: number
  columns: number
  levels: number
  setRows: (rows: number) => void
  setColumns: (columns: number) => void
  setLevels: (levels: number) => void

  // Box state
  boxes: Box[]
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>
  filteredBoxes: Box[]
  setFilteredBoxes: React.Dispatch<React.SetStateAction<Box[]>>

  // Box configuration
  boxSize: "rectangle" | "square"
  setBoxSize: (size: "rectangle" | "square") => void
  stackHeight: number
  setStackHeight: (height: number) => void

  // Selection state
  selectedRow: string | null
  setSelectedRow: (row: string | null) => void
  availableRows: number[]

  // Customer/variety/grade selection
  selectedCustomer: string
  setSelectedCustomer: (customer: string) => void
  selectedVariety: string
  setSelectedVariety: (variety: string) => void
  selectedGrade: string
  setSelectedGrade: (grade: string) => void
  customerBoxColor: string
  setCustomerBoxColor: (color: string) => void

  // Box count
  boxCount: string
  setBoxCount: (count: string) => void

  // Date
  loadingDate: string
  setLoadingDate: (date: string) => void

  // Log
  log: LogEntry[]
  setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>
  selectedLogIndex: number | null
  setSelectedLogIndex: (index: number | null) => void

  // Snapshots
  snapshots: Snapshot[]
  setSnapshots: React.Dispatch<React.SetStateAction<Snapshot[]>>

  // UI state
  isLogVisible: boolean
  setIsLogVisible: (visible: boolean) => void
  isRoomDimensionsVisible: boolean
  setIsRoomDimensionsVisible: (visible: boolean) => void
  showRoomView: boolean
  setShowRoomView: (visible: boolean) => void

  // Error handling
  errorMessage: string | null
  setErrorMessage: (message: string | null) => void

  // Functions
  addBoxes: () => Promise<void>
  removeBoxes: () => void
  reapplyLastRemoved: () => void
  saveSnapshot: (customSnapshot?: Snapshot) => Snapshot | void
  loadSnapshot: (snapshot: Snapshot) => void
  handleLogEntrySelect: (index: number) => void
  getRoomCapacity: () => number
  handleSearch: (filters: FilterCriteria) => void
  highlightBox: (row: number, column: number, level: number) => void

  // Data export
  exportData: () => void

  // Customer color preferences
  customerColorPreferences: Record<string, string>
  setCustomerColorPreferences: React.Dispatch<React.SetStateAction<Record<string, string>>>

  addBox: (box: Box) => void
  removeBox: (id: string) => void
  updateBox: (id: string, updates: Partial<Box>) => void
  clearBoxes: () => void
  addLogEntry: (entry: LogEntry) => void
  createSnapshot: (name: string, description?: string) => void
  loadSnapshotById: (id: string) => void
  deleteSnapshot: (id: string) => void
  importData: (data: any) => void
}

// Create the context with a default undefined value
const BoxContext = createContext<BoxContextType | undefined>(undefined)

// Custom hook to use the box context
export function useBoxContext() {
  const context = useContext(BoxContext)
  if (context === undefined) {
    console.warn("useBoxContext must be used within a BoxProvider")
  }
  return context
}

interface BoxProviderProps {
  children: ReactNode
}

export function BoxProvider({ children }: BoxProviderProps) {
  const {
    boxes: initialBoxes,
    setBoxes: setInitialBoxes,
    log: initialLog,
    setLog: setInitialLog,
    validateBoxData,
  } = useBoxOperations(boxData.boxes, boxData.log || [])

  const [boxSize, setBoxSize] = useState<"rectangle" | "square">("rectangle")
  const [rows, setRows] = useState<number>(ROOM_DIMENSIONS.DEFAULT_ROWS)
  const [columns, setColumns] = useState<number>(ROOM_DIMENSIONS.DEFAULT_COLUMNS)
  const [levels, setLevels] = useState<number>(ROOM_DIMENSIONS.DEFAULT_LEVELS)
  const setLevelsAndUpdateStackHeight = useCallback((newLevels: number) => {
    setLevels(newLevels)
    setStackHeight((prevStackHeight) => Math.min(prevStackHeight, newLevels))
  }, [])
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [stackHeight, setStackHeight] = useState<number>(UI_CONSTANTS.DEFAULT_STACK_HEIGHT)
  const [boxCount, setBoxCount] = useState<string>("")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [availableRows, setAvailableRows] = useState<number[]>([])
  const [selectedVariety, setSelectedVariety] = useState<string>("")
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [loadingDate, setLoadingDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [isLogVisible, setIsLogVisible] = useState(true)
  const [customerBoxColor, setCustomerBoxColor] = useState<string>(UI_CONSTANTS.DEFAULT_BOX_COLOR)
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null)
  const [isRoomDimensionsVisible, setIsRoomDimensionsVisible] = useState(false)
  const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([])
  const [showRoomView, setShowRoomView] = useState(initialBoxes.length > 0)
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [customerColorPreferences, setCustomerColorPreferences] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false)

  // Initialize state with empty arrays to prevent undefined errors
  const [boxes, setBoxes] = useState<Box[]>([])
  const [log, setLog] = useState<LogEntry[]>([])

  // Initialize our magic components
  const { addBoxes: addBoxesMagic, findNextAvailableSpace } = BoxAddMagic({
    boxes,
    setBoxes,
    log,
    setLog,
    validateBoxData,
  })

  const { removeBoxes: removeBoxesMagic, reapplyLastRemoved: reapplyLastRemovedMagic } = BoxRemovalMagic({
    boxes,
    setBoxes,
    log,
    setLog,
    validateBoxData,
  })

  const updateAvailableRowsAndSelection = useCallback(() => {
    // Create a map to track box counts for each row
    const rowOccupancy = new Map<number, { columns: Set<number>; levels: Set<number> }>()

    // Initialize the map for all rows
    for (let i = 1; i <= rows; i++) {
      rowOccupancy.set(i, {
        columns: new Set(),
        levels: new Set(),
      })
    }

    // Count boxes in each row, tracking unique columns and levels
    boxes.forEach((box) => {
      const rowData = rowOccupancy.get(box.row)
      if (rowData) {
        rowData.columns.add(box.column)
        rowData.levels.add(box.level)
      }
    })

    // A row is available if it's not completely full
    const available = Array.from({ length: rows }, (_, i) => i + 1).filter((row) => {
      const rowData = rowOccupancy.get(row)
      if (!rowData) return true

      // Check if this row has reached capacity
      // A row is full when all columns have boxes stacked to the stackHeight
      const isRowFull =
        rowData.columns.size >= columns &&
        Array.from(rowData.columns).every((col) => {
          const boxesInColumn = boxes.filter((b) => b.row === row && b.column === col)
          return boxesInColumn.length >= stackHeight
        })

      return !isRowFull
    })

    setAvailableRows(available)

    // If the currently selected row is no longer available, select the first available row
    if (selectedRow && !available.includes(Number.parseInt(selectedRow))) {
      const nextAvailableRow = available[0]
      setSelectedRow(nextAvailableRow !== undefined ? nextAvailableRow.toString() : null)
    }

    // If no row is selected and there are available rows, select the first one
    if (!selectedRow && available.length > 0) {
      setSelectedRow(available[0].toString())
    }
  }, [rows, columns, stackHeight, boxes, selectedRow])

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Try to load data from localStorage first
      const storedData = loadBoxData()

      if (storedData && storedData.boxes) {
        setBoxes(storedData.boxes)
        setLog(storedData.log || [])
        setSnapshots(storedData.snapshots || [])
        // Load customer color preferences if available
        if (storedData.customerColorPreferences) {
          setCustomerColorPreferences(storedData.customerColorPreferences)
        }
        console.log("Loaded box data from localStorage")
      } else {
        // Fall back to the initial data from boxData.json
        // Ensure we're providing valid arrays even if boxData is incomplete
        setBoxes(boxData.boxes || [])
        setLog(boxData.log || [])
        console.log("Using initial box data from boxData.json")
      }

      // Safely validate the data
      try {
        validateBoxData(boxes, log)
      } catch (validationError) {
        console.error("Error during initial data validation:", validationError)
        // Don't throw, just log the error
      }
      setIsLoaded(true)
    } catch (error) {
      console.error("Error loading initial data:", error)
      // Set default empty arrays to prevent further errors
      setBoxes([])
      setLog([])
      setSnapshots([])
      setIsLoaded(true)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("boxData", JSON.stringify({ boxes, log, snapshots }))
      } catch (error) {
        console.error("Error saving data to localStorage:", error)
      }
    }
  }, [boxes, log, snapshots, isLoaded])

  useEffect(() => {
    updateAvailableRowsAndSelection()
  }, [rows, boxes, updateAvailableRowsAndSelection])

  useEffect(() => {
    // Add this to ensure the available rows are updated when stackHeight changes
    updateAvailableRowsAndSelection()
  }, [rows, columns, stackHeight, boxes, updateAvailableRowsAndSelection])

  useEffect(() => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => ({
        ...box,
        highlighted: selectedLogIndex !== null && box.logIndex === selectedLogIndex,
      })),
    )
  }, [selectedLogIndex])

  useEffect(() => {
    if (boxes.length > 0 && !showRoomView) {
      setShowRoomView(true)
    }
  }, [boxes.length, showRoomView])

  useEffect(() => {
    // Only save if we have actual data to save
    if (
      boxes.length > 0 ||
      log.length > 0 ||
      snapshots.length > 0 ||
      Object.keys(customerColorPreferences).length > 0
    ) {
      saveBoxData(boxes, log, snapshots, customerColorPreferences)
    }
  }, [boxes, log, snapshots, customerColorPreferences])

  useEffect(() => {
    if (selectedCustomer && customerColorPreferences[selectedCustomer]) {
      setCustomerBoxColor(customerColorPreferences[selectedCustomer])
    } else {
      setCustomerBoxColor(UI_CONSTANTS.DEFAULT_BOX_COLOR)
    }
  }, [selectedCustomer, customerColorPreferences])

  // Add a new box
  const addBox = (box: Box) => {
    setBoxes((prev) => [...prev, box])
    addLogEntry({
      action: "add_box",
      boxId: box.id,
      timestamp: Date.now(),
      details: { box },
    })
  }

  // Remove a box by id
  const removeBox = (id: string) => {
    setBoxes((prev) => prev.filter((box) => box.id !== id))
    addLogEntry({
      action: "remove_box",
      boxId: id,
      timestamp: Date.now(),
    })
  }

  // Update a box by id
  const updateBox = (id: string, updates: Partial<Box>) => {
    setBoxes((prev) => prev.map((box) => (box.id === id ? { ...box, ...updates } : box)))
    addLogEntry({
      action: "update_box",
      boxId: id,
      timestamp: Date.now(),
      details: { updates },
    })
  }

  // Clear all boxes
  const clearBoxes = () => {
    setBoxes([])
    addLogEntry({
      action: "clear_boxes",
      timestamp: Date.now(),
    })
  }

  // Add a log entry
  const addLogEntry = (entry: LogEntry) => {
    setLog((prev) => [...prev, entry])
  }

  // Create a snapshot of the current state
  const createSnapshot = (name: string, description?: string) => {
    const snapshot: Snapshot = {
      id: `snapshot_${Date.now()}`,
      name,
      timestamp: Date.now(),
      boxes: [...boxes],
      description,
    }
    setSnapshots((prev) => [...prev, snapshot])
    addLogEntry({
      action: "create_snapshot",
      timestamp: Date.now(),
      details: { snapshotId: snapshot.id, name },
    })
  }

  // Load a snapshot
  const loadSnapshotById = (id: string) => {
    const snapshot = snapshots.find((s) => s.id === id)
    if (snapshot) {
      setBoxes([...snapshot.boxes])
      addLogEntry({
        action: "load_snapshot",
        timestamp: Date.now(),
        details: { snapshotId: id, name: snapshot.name },
      })
    }
  }

  // Delete a snapshot
  const deleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id))
    addLogEntry({
      action: "delete_snapshot",
      timestamp: Date.now(),
      details: { snapshotId: id },
    })
  }

  /**
   * Handles the selection of a log entry, toggling the highlight state of associated boxes.
   * @param {number} index - The index of the selected log entry.
   */
  const handleLogEntrySelect = useCallback(
    (index: number) => {
      if (selectedLogIndex === index) {
        setSelectedLogIndex(null)
      } else {
        setSelectedLogIndex(index)
      }
    },
    [selectedLogIndex],
  )

  /**
   * Calculates and returns the total capacity of the room based on current dimensions.
   * @returns {number} The total number of boxes that can fit in the room.
   */
  const getRoomCapacity = useCallback(() => {
    return rows * columns * levels
  }, [rows, columns, levels])

  const getCustomerName = (customer: string) => customer
  const getVarietyName = (variety: string) => variety
  const getGradeName = (grade: string) => grade

  /**
   * Adds boxes to the room based on the current selection criteria.
   * Validates input, updates the box state, and refreshes the UI.
   * @throws {Error} If required fields are missing or if box addition fails.
   */
  const addBoxes = useCallback(() => {
    const addBoxesAsync = async () => {
      try {
        if (!boxSize || !selectedCustomer || !selectedRow || !boxCount || !selectedVariety || !selectedGrade) {
          setErrorMessage("Please fill in all required fields before adding boxes.")
          return
        }

        console.log(`Adding boxes with stack height: ${stackHeight}`) // Debug log

        // Check if the selected row is full
        const selectedRowNumber = Number.parseInt(selectedRow)
        const boxesInSelectedRow = boxes.filter((box) => box.row === selectedRowNumber)
        const rowCapacity = columns * stackHeight

        if (boxesInSelectedRow.length >= rowCapacity) {
          // Find the next available row
          const nextAvailableRow = availableRows.find((row) => row !== selectedRowNumber)

          if (nextAvailableRow) {
            toast({
              title: "Row Full",
              description: `Row ${selectedRowNumber} is full. Using Row ${nextAvailableRow} instead.`,
              duration: 3000,
            })

            // Update the selected row
            setSelectedRow(nextAvailableRow.toString())

            // Give a moment for the state to update
            await new Promise((resolve) => setTimeout(resolve, 100))
          } else {
            setErrorMessage("No available rows to add boxes. Please remove some boxes first.")
            return
          }
        }

        const customerName = getCustomerName(selectedCustomer)
        const varietyName = getVarietyName(selectedVariety)
        const gradeName = getGradeName(selectedGrade)

        if (!customerName || !varietyName || !gradeName) {
          setErrorMessage("Invalid selection data. Please check your selections.")
          return
        }

        await addBoxesMagic(
          boxSize,
          customerName,
          Number.parseInt(selectedRow),
          Number.parseInt(boxCount),
          varietyName,
          gradeName,
          loadingDate,
          customerBoxColor,
          rows,
          columns,
          levels,
          stackHeight,
        )

        // Save the customer color preference
        setCustomerColorPreferences((prev) => ({
          ...prev,
          [selectedCustomer]: customerBoxColor,
        }))

        setSelectedCustomer("")
        setBoxCount("")
        setSelectedRow(null)
        setSelectedVariety("")
        setSelectedGrade("")
        setLoadingDate(new Date().toISOString().split("T")[0])
        setCustomerBoxColor(UI_CONSTANTS.DEFAULT_BOX_COLOR)

        updateAvailableRowsAndSelection()

        toast({
          title: "Success",
          description: `Added boxes successfully.`,
        })
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to add boxes. Please try again.")
      }
    }

    addBoxesAsync()
  }, [
    boxSize,
    selectedCustomer,
    selectedRow,
    boxCount,
    selectedVariety,
    selectedGrade,
    loadingDate,
    customerBoxColor,
    rows,
    columns,
    levels,
    stackHeight,
    addBoxesMagic,
    updateAvailableRowsAndSelection,
    setErrorMessage,
    boxes,
    availableRows,
    toast,
    customerColorPreferences,
    setCustomerColorPreferences,
  ])

  /**
   * Removes boxes from the room based on the current selection criteria.
   * Validates input, updates the box state, and refreshes the UI.
   * @throws {Error} If required fields are missing or if box removal fails.
   */
  const removeBoxes = useCallback(() => {
    try {
      if (!selectedCustomer || !selectedVariety || !selectedGrade || !boxCount) {
        setErrorMessage("Please select a customer, variety, grade, and enter a box count to remove.")
        return
      }

      const customerName = getCustomerName(selectedCustomer)
      const varietyName = getVarietyName(selectedVariety)
      const gradeName = getGradeName(selectedGrade)

      if (!customerName || !varietyName || !gradeName) {
        setErrorMessage("Invalid selection data. Please check your selections.")
        return
      }

      removeBoxesMagic(customerName, varietyName, gradeName, Number.parseInt(boxCount), boxSize, customerBoxColor)

      updateAvailableRowsAndSelection()
      setBoxCount("")

      toast({
        title: "Success",
        description: `Removed boxes successfully using forklift-style removal.`,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to remove boxes. Please try again.")
    }
  }, [
    selectedCustomer,
    selectedVariety,
    selectedGrade,
    boxCount,
    boxSize,
    customerBoxColor,
    removeBoxesMagic,
    updateAvailableRowsAndSelection,
    setErrorMessage,
  ])

  /**
   * Reapplies the last removed boxes to the room.
   * Checks if the last action was a removal and if there are boxes to reapply.
   * Updates the box state and refreshes the UI.
   */
  const reapplyLastRemoved = useCallback(() => {
    if (log.length === 0) {
      alert("No boxes to reapply.")
      return
    }

    const lastEntry = log[log.length - 1]
    if (lastEntry.boxCount >= 0) {
      alert("The last action was not a removal. Cannot reapply.")
      return
    }

    reapplyLastRemovedMagic(columns, rows)
    updateAvailableRowsAndSelection()
  }, [log, columns, rows, reapplyLastRemovedMagic, updateAvailableRowsAndSelection])

  // Add these comments to the saveSnapshot function
  /**
   * Creates and saves a new snapshot of the current room state.
   * Updates the snapshots state and logs the updated box data.
   *
   * TODO: Replace with API calls to PostgreSQL and S3/MinIO
   * - Save snapshot metadata to PostgreSQL
   * - Save snapshot JSON to S3/MinIO
   *
   * API endpoints to implement:
   * - POST /api/snapshots - Save snapshot metadata
   * - POST /api/storage/snapshots/{id} - Upload snapshot JSON
   *
   * @param {Snapshot} [customSnapshot] - Optional custom snapshot to save instead of creating a new one.
   */
  const saveSnapshot = useCallback(
    (customSnapshot?: Snapshot) => {
      const newSnapshot: Snapshot = customSnapshot || {
        id: Date.now(),
        name: `snapshot_${Date.now()}`,
        timestamp: Date.now(),
        boxes: [...boxes],
      }

      // Update the snapshots state
      setSnapshots((prevSnapshots) => {
        const updatedSnapshots = [...prevSnapshots, newSnapshot]

        // Log the updated data
        console.log("Snapshot saved:", {
          id: newSnapshot.id,
          boxCount: newSnapshot.boxes.length,
          totalSnapshots: updatedSnapshots.length,
          name: newSnapshot.name || "Unnamed Snapshot",
        })

        return updatedSnapshots
      })

      toast({
        title: "Snapshot Saved",
        description: `Saved snapshot ${newSnapshot.name ? `"${newSnapshot.name}"` : ""} with ${boxes.length} boxes at ${new Date().toLocaleString()}`,
      })

      return newSnapshot
    },
    [boxes],
  )

  /**
   * Loads a previously saved snapshot, updating the current room state.
   * Validates the snapshot data before applying it.
   * @param {Snapshot} snapshot - The snapshot to load.
   * @throws {Error} If the snapshot data is invalid or loading fails.
   */
  const loadSnapshot = useCallback(
    (snapshot: Snapshot) => {
      try {
        if (!snapshot || !snapshot.boxes) {
          throw new Error("Invalid snapshot data.")
        }

        setBoxes(snapshot.boxes)

        const updatedBoxData = {
          boxes: snapshot.boxes,
          snapshots: snapshots,
        }
        console.log("Updated box data:", updatedBoxData)

        toast({
          title: "Success",
          description: "Snapshot loaded successfully.",
        })
      } catch (error) {
        handleError(error, "Failed to load snapshot. Please try again.")
      }
    },
    [snapshots, setBoxes],
  )

  // Export all data
  const exportData = () => {
    try {
      // Ensure arrays are initialized to prevent length errors
      const dataToExport = {
        boxes: boxes || [],
        log: log || [],
        snapshots: snapshots || [],
      }

      const dataStr = JSON.stringify(dataToExport, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `box_data_${new Date().toISOString()}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      addLogEntry({
        action: "export_data",
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      addLogEntry({
        action: "export_error",
        timestamp: Date.now(),
        details: { error: String(error) },
      })
    }
  }

  // Import data
  const importData = (data: any) => {
    try {
      if (data && typeof data === "object") {
        // Ensure we have valid arrays
        setBoxes(Array.isArray(data.boxes) ? data.boxes : [])
        setLog(Array.isArray(data.log) ? data.log : [])
        setSnapshots(Array.isArray(data.snapshots) ? data.snapshots : [])

        addLogEntry({
          action: "import_data",
          timestamp: Date.now(),
        })
      }
    } catch (error) {
      console.error("Error importing data:", error)
      addLogEntry({
        action: "import_error",
        timestamp: Date.now(),
        details: { error: String(error) },
      })
    }
  }

  /**
   * Filters the boxes based on the provided criteria.
   * Updates the filteredBoxes state with the results.
   * @param {FilterCriteria} filters - The criteria to filter the boxes by.
   */
  const handleSearch = useCallback(
    (filters: FilterCriteria) => {
      const filtered = boxes.filter((box) => {
        const matchesSearchTerm = Object.values(box).some((value) =>
          value.toString().toLowerCase().includes(filters.searchTerm.toLowerCase()),
        )
        const matchesCustomer = !filters.customer || filters.customer === "all" || box.customerName === filters.customer
        const matchesVariety = !filters.variety || filters.variety === "all" || box.varietyName === filters.variety
        const matchesGrade = !filters.grade || filters.grade === "all" || box.grade === filters.grade
        const matchesDateRange =
          (!filters.dateFrom || box.loadingDate >= filters.dateFrom) &&
          (!filters.dateTo || box.loadingDate <= filters.dateTo)

        return matchesSearchTerm && matchesCustomer && matchesVariety && matchesGrade && matchesDateRange
      })

      setFilteredBoxes(filtered)
    },
    [boxes],
  )

  const highlightBox = useCallback((row: number, column: number, level: number) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => ({
        ...box,
        highlighted: box.row === row && box.column === column && box.level === level,
      })),
    )
  }, [])

  const value = useMemo(
    () => ({
      rows,
      columns,
      levels,
      setRows,
      setColumns,
      setLevels: setLevelsAndUpdateStackHeight,
      boxes,
      setBoxes,
      filteredBoxes,
      setFilteredBoxes,
      boxSize,
      setBoxSize,
      stackHeight,
      setStackHeight,
      selectedRow,
      setSelectedRow,
      availableRows,
      selectedCustomer,
      setSelectedCustomer,
      selectedVariety,
      setSelectedVariety,
      selectedGrade,
      setSelectedGrade,
      customerBoxColor,
      setCustomerBoxColor,
      boxCount,
      setBoxCount,
      loadingDate,
      setLoadingDate,
      log,
      setLog,
      selectedLogIndex,
      setSelectedLogIndex,
      snapshots,
      setSnapshots,
      isLogVisible,
      setIsLogVisible,
      isRoomDimensionsVisible,
      setIsRoomDimensionsVisible,
      showRoomView,
      setShowRoomView,
      errorMessage,
      setErrorMessage,
      addBoxes,
      removeBoxes,
      reapplyLastRemoved,
      saveSnapshot,
      loadSnapshot,
      handleLogEntrySelect,
      getRoomCapacity,
      handleSearch,
      highlightBox,
      exportData,
      customerColorPreferences,
      setCustomerColorPreferences,
      addBox,
      removeBox,
      updateBox,
      clearBoxes,
      addLogEntry,
      createSnapshot,
      deleteSnapshot,
      importData,
      loadSnapshotById,
    }),
    [
      rows,
      columns,
      levels,
      boxes,
      filteredBoxes,
      boxSize,
      stackHeight,
      selectedRow,
      availableRows,
      selectedCustomer,
      selectedVariety,
      selectedGrade,
      customerBoxColor,
      boxCount,
      loadingDate,
      log,
      selectedLogIndex,
      snapshots,
      isLogVisible,
      isRoomDimensionsVisible,
      showRoomView,
      errorMessage,
      addBoxes,
      removeBoxes,
      reapplyLastRemoved,
      saveSnapshot,
      loadSnapshot,
      handleLogEntrySelect,
      getRoomCapacity,
      handleSearch,
      highlightBox,
      exportData,
      setLevelsAndUpdateStackHeight,
      customerColorPreferences,
      setFilteredBoxes,
      addBox,
      removeBox,
      updateBox,
      clearBoxes,
      addLogEntry,
    ],
  )

  // Only render children when data is loaded
  if (!isLoaded) {
    return <div>Loading box data...</div>
  }

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>
}

