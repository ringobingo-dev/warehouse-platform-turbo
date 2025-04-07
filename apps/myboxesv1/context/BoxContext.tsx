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
import { Box as WarehouseBox, LogEntry, Snapshot } from '@/types/Box'

// Update the Box interface to maintain backward compatibility
interface Box {
  // Core Properties
  row: number
  column: number
  level: number
  logIndex: number

  // Business Properties
  customerName: string
  varietyName: string
  grade: string
  loadingDate: string
  size: "rectangle" | "square"
  color: string
  highlighted: boolean

  // Legacy Location Properties (maintained for backward compatibility)
  location?: string  // Legacy format: "A1", "A2", etc.
}

// Export the VisualBox type with backward compatibility
export interface VisualBox {
  // Core Properties
  id: string
  timestamp: number
  highlighted: boolean
  logIndex: number

  // Business Properties
  customerName: string
  varietyName: string
  grade: string
  loadingDate: string
  boxSize: "rectangle" | "square"
  customerBoxColor: string

  // Location Properties (both formats for backward compatibility)
  position: [number, number, number]  // New format: [row, column, level]
  locations: string[]                 // Legacy format: ["A1", "A2", "A3"]
  // Legacy properties (maintained for backward compatibility)
  row?: number
  column?: number
  level?: number
  location?: string

  // Visualization Properties
  size: [number, number, number]
  color: string
}

// Define visualization-specific log entry type
interface VisualLogEntry {
  // Required by LogEntry
  customerName: string
  boxCount: number
  varietyName: string
  grade: string
  loadingDate: string
  locations: string[]
  boxSize: "rectangle" | "square"
  color: string
  timestamp: number
  startingRow: number
  stackHeight: number
  customerBoxColor: string
  id?: string

  // Additional visualization properties
  action: string
  boxId: string
  details: string
}

// Define visualization-specific snapshot type
interface VisualSnapshot {
  id: number
  name: string
  timestamp: number
  boxes: VisualBox[]
  log: VisualLogEntry[]
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
  boxes: VisualBox[]
  setBoxes: React.Dispatch<React.SetStateAction<VisualBox[]>>
  filteredBoxes: VisualBox[]
  setFilteredBoxes: React.Dispatch<React.SetStateAction<VisualBox[]>>

  // Box configuration
  boxSize: "rectangle" | "square"
  setBoxSize: (size: "rectangle" | "square") => void
  stackHeight: number
  setStackHeight: (height: number) => void

  // Selection state
  selectedRow: number
  setSelectedRow: (row: number) => void
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
  log: VisualLogEntry[]
  setLog: React.Dispatch<React.SetStateAction<VisualLogEntry[]>>
  selectedLogIndex: number | null
  setSelectedLogIndex: (index: number | null) => void

  // Snapshots
  snapshots: VisualSnapshot[]
  setSnapshots: React.Dispatch<React.SetStateAction<VisualSnapshot[]>>

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
  addBoxes: (newBoxes: Box[]) => void
  removeBoxes: (boxIds: string[]) => void
  reapplyLastRemoved: () => void
  saveSnapshot: (name: string) => void
  loadSnapshot: (snapshot: VisualSnapshot) => void
  handleLogEntrySelect: (index: number) => void
  getRoomCapacity: () => number
  handleSearch: (filters: FilterCriteria) => void
  highlightBox: (row: number, column: number, level: number) => void

  // Data export
  exportData: () => void

  // Customer color preferences
  customerColorPreferences: Record<string, string>
  setCustomerColorPreferences: React.Dispatch<React.SetStateAction<Record<string, string>>>

  // Box operations
  addBox: (box: VisualBox) => void
  removeBox: (id: string) => void
  updateBox: (id: string, updates: Partial<VisualBox>) => void
  clearBoxes: () => void
  addLogEntry: (entry: VisualLogEntry) => void
  createSnapshot: (name: string, description?: string) => void
  loadSnapshotById: (id: string) => void
  deleteSnapshot: (id: string) => void
  importData: (data: any) => void

  // Add isFiltered property
  isFiltered: boolean
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
  const [selectedRow, setSelectedRow] = useState<number>(1)
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
  const [filteredBoxes, setFilteredBoxes] = useState<VisualBox[]>([])
  const [showRoomView, setShowRoomView] = useState(initialBoxes.length > 0)
  const [snapshots, setSnapshots] = useState<VisualSnapshot[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [customerColorPreferences, setCustomerColorPreferences] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false)

  // Initialize state with empty arrays to prevent undefined errors
  const [boxes, setBoxes] = useState<VisualBox[]>([])
  const [log, setLog] = useState<VisualLogEntry[]>([])

  // Add isFiltered state
  const [isFiltered, setIsFiltered] = useState(false);

  // Initialize our magic components (temporarily commented out as placeholders)
  /*
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
  */

  // Helper functions for location conversion
  const positionToLocation = (position: [number, number, number]): string => {
    const [row, col, level] = position;
    return `${String.fromCharCode(64 + row)}${col}${level}`;
  };

  const locationToPosition = (location: string): [number, number, number] => {
    const row = location.charCodeAt(0) - 64;
    const col = parseInt(location.slice(1, -1));
    const level = parseInt(location.slice(-1));
    return [row, col, level];
  };

  // Helper functions for box ID generation
  const generateBoxId = (location: string): string => {
    return `box_${location}`;
  };

  const getLocationFromId = (boxId: string): string => {
    return boxId.replace('box_', '');
  };

  // Update the convertBoxToVisualBox function to maintain backward compatibility
  const convertBoxToVisualBox = (box: Box): VisualBox => {
    const position: [number, number, number] = [box.row, box.column, box.level];
    const location = box.location || positionToLocation(position);
    
    return {
      id: generateBoxId(location),
      position,
      locations: [location],
      size: box.size === "rectangle" ? [2, 1, 1] : [1, 1, 1],
      color: box.color,
      timestamp: Date.now(),
      highlighted: box.highlighted,
      logIndex: box.logIndex,
      customerName: box.customerName,
      varietyName: box.varietyName,
      grade: box.grade,
      loadingDate: box.loadingDate,
      boxSize: box.size,
      customerBoxColor: box.color,
      // Legacy properties
      row: box.row,
      column: box.column,
      level: box.level,
      location: box.location
    };
  };

  // Update the convertVisualBoxToBox function to maintain backward compatibility
  const convertVisualBoxToBox = (visualBox: VisualBox): Box => {
    const [row, column, level] = visualBox.position;
    return {
      row,
      column,
      level,
      customerName: visualBox.customerName,
      varietyName: visualBox.varietyName,
      grade: visualBox.grade,
      loadingDate: visualBox.loadingDate,
      color: visualBox.color,
      highlighted: visualBox.highlighted,
      size: visualBox.boxSize,
      logIndex: visualBox.logIndex,
      // Legacy property
      location: visualBox.location || positionToLocation(visualBox.position)
    };
  };

  // Update the updateAvailableRowsAndSelection function
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
      const [row, column, level] = box.position;
      const rowData = rowOccupancy.get(row)
      if (rowData) {
        rowData.columns.add(column)
        rowData.levels.add(level)
      }
    })

    // Calculate available rows
    const availableRows = Array.from({ length: rows }, (_, i) => i + 1)
      .filter((row) => {
        const rowData = rowOccupancy.get(row)
        return rowData && rowData.columns.size < columns
      })

    // Update state
    setAvailableRows(availableRows)

    // If selected row is no longer available, select the first available row
    if (!availableRows.includes(selectedRow)) {
      setSelectedRow(availableRows[0] || 1)
    }
  }, [rows, columns, stackHeight, boxes, selectedRow])

  // Load data from localStorage on mount
  useEffect(() => {
    const storedBoxes = localStorage.getItem('boxes');
    const storedLogEntries = localStorage.getItem('logEntries');
    
    if (storedBoxes) {
      try {
        const parsedBoxes = JSON.parse(storedBoxes);
        // Convert stored boxes to VisualBox format
        const visualBoxes = parsedBoxes.map((box: Box) => convertBoxToVisualBox(box));
        setBoxes(visualBoxes);
      } catch (error) {
        console.error('Error loading boxes:', error);
      }
    }
    
    if (storedLogEntries) {
      try {
        const parsedLogEntries = JSON.parse(storedLogEntries);
        setLog(parsedLogEntries);
      } catch (error) {
        console.error('Error loading log entries:', error);
      }
    }
    
    // Set isLoaded to true after initialization
    setIsLoaded(true);
  }, []);

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
    if (
      boxes.length > 0 ||
      log.length > 0 ||
      snapshots.length > 0 ||
      Object.keys(customerColorPreferences).length > 0
    ) {
      const warehouseBoxes = boxes.map(convertVisualBoxToBox);
      const warehouseSnapshots = snapshots.map(snapshot => ({
        ...snapshot,
        boxes: snapshot.boxes.map(convertVisualBoxToBox)
      }));
      saveBoxData(warehouseBoxes, log, warehouseSnapshots, customerColorPreferences);
    }
  }, [boxes, log, snapshots, customerColorPreferences]);

  useEffect(() => {
    if (selectedCustomer && customerColorPreferences[selectedCustomer]) {
      setCustomerBoxColor(customerColorPreferences[selectedCustomer])
    } else {
      setCustomerBoxColor(UI_CONSTANTS.DEFAULT_BOX_COLOR)
    }
  }, [selectedCustomer, customerColorPreferences])

  // Update the addBoxes function
  const addBoxes = useCallback((newBoxes: Box[]) => {
    const visualBoxes = newBoxes.map(convertBoxToVisualBox);
    setBoxes(prevBoxes => [...prevBoxes, ...visualBoxes]);
    
    // Create log entries for the new boxes
    const newLogEntries = visualBoxes.map(box => ({
      action: 'add',
      boxId: box.id,
      timestamp: Date.now(),
      details: `Added box ${box.id} for ${box.customerName}`,
      customerName: box.customerName,
      boxCount: 1,
      varietyName: box.varietyName,
      grade: box.grade,
      loadingDate: box.loadingDate,
      locations: box.locations,
      boxSize: box.boxSize,
      color: box.color,
      startingRow: box.position[0],
      stackHeight,
      customerBoxColor: box.customerBoxColor
    }));
    
    setLog(prevLog => [...prevLog, ...newLogEntries]);
    updateAvailableRowsAndSelection();
  }, [updateAvailableRowsAndSelection, stackHeight]);

  // Update the removeBoxes function
  const removeBoxes = useCallback((boxIds: string[]) => {
    setBoxes(prevBoxes => prevBoxes.filter(box => !boxIds.includes(box.id)));
    
    // Create log entries for removed boxes
    const newLogEntries = boxIds.map(id => ({
      action: 'remove',
      boxId: id,
      timestamp: Date.now(),
      details: `Removed box ${id}`,
      customerName: selectedCustomer,
      boxCount: -1,
      varietyName: selectedVariety,
      grade: selectedGrade,
      loadingDate,
      locations: [],
      boxSize,
      color: customerBoxColor,
      startingRow: selectedRow,
      stackHeight,
      customerBoxColor
    }));
    
    setLog(prevLog => [...prevLog, ...newLogEntries]);
    updateAvailableRowsAndSelection();
  }, [updateAvailableRowsAndSelection, selectedCustomer, selectedVariety, selectedGrade, loadingDate, boxSize, customerBoxColor, selectedRow, stackHeight]);

  // Update the addBox function
  const addBox = (box: VisualBox) => {
    setBoxes(prevBoxes => [...prevBoxes, box]);
    addLogEntry({
      action: 'add',
      boxId: box.id,
      timestamp: Date.now(),
      details: `Added box ${box.id} for ${box.customerName}`,
      customerName: box.customerName,
      boxCount: 1,
      varietyName: box.varietyName,
      grade: box.grade,
      loadingDate: box.loadingDate,
      locations: box.locations,
      boxSize: box.boxSize,
      color: box.color,
      startingRow: box.position[0],
      stackHeight,
      customerBoxColor: box.customerBoxColor
    });
  };

  // Update the updateBox function
  const updateBox = (id: string, updates: Partial<VisualBox>) => {
    setBoxes(prevBoxes => prevBoxes.map(box => 
      box.id === id ? { ...box, ...updates } : box
    ));
    addLogEntry({
      action: 'update',
      boxId: id,
      timestamp: Date.now(),
      details: `Updated box ${id}`,
      customerName: selectedCustomer,
      boxCount: 0,
      varietyName: selectedVariety,
      grade: selectedGrade,
      loadingDate,
      locations: [],
      boxSize,
      color: customerBoxColor,
      startingRow: selectedRow,
      stackHeight,
      customerBoxColor
    });
  };

  // Clear all boxes
  const clearBoxes = () => {
    setBoxes([])
    addLogEntry({
      action: "clear_boxes",
      timestamp: Date.now(),
      customerName: selectedCustomer,
      boxCount: 0,
      varietyName: selectedVariety,
      grade: selectedGrade,
      loadingDate,
      locations: [],
      boxSize,
      color: customerBoxColor,
      startingRow: selectedRow,
      stackHeight,
      customerBoxColor,
      boxId: "",
      details: "Cleared all boxes"
    })
  }

  // Update the addLogEntry function
  const addLogEntry = (entry: VisualLogEntry) => {
    const fullEntry: VisualLogEntry = {
      customerName: selectedCustomer,
      boxCount: parseInt(boxCount) || 0,
      varietyName: selectedVariety,
      grade: selectedGrade,
      loadingDate,
      locations: [],
      boxSize,
      color: customerBoxColor,
      timestamp: Date.now(),
      startingRow: selectedRow,
      stackHeight,
      customerBoxColor,
      action: entry.action,
      boxId: entry.boxId,
      details: entry.details
    };
    setLog(prevLog => [...prevLog, fullEntry]);
  };

  // Type declarations for snapshot and box management functions
  type SaveSnapshotFunction = (name: string) => void;
  type RemoveBoxFunction = (id: string) => void;
  type ImportDataFunction = (data: any) => void;

  // Implement the saveSnapshot function
  const saveSnapshot: SaveSnapshotFunction = useCallback((name: string) => {
    const snapshot: VisualSnapshot = {
      id: Date.now(),
      name,
      timestamp: Date.now(),
      boxes,
      log
    };
    setSnapshots(prev => [...prev, snapshot]);
  }, [boxes, log]);

  // Implement the removeBox function
  const removeBox: RemoveBoxFunction = useCallback((id: string) => {
    setBoxes(prev => prev.filter(box => box.id !== id));
  }, []);

  // Implement the importData function
  const importData: ImportDataFunction = useCallback((data: any) => {
    if (data.boxes) {
      const visualBoxes = data.boxes.map((box: Box) => convertBoxToVisualBox(box));
      setBoxes(visualBoxes);
    }
    if (data.log) {
      setLog(data.log);
    }
    if (data.snapshots) {
      setSnapshots(data.snapshots);
    }
  }, []);

  // Create a snapshot of the current state
  const createSnapshot = useCallback((name: string) => {
    const snapshot: VisualSnapshot = {
      id: Date.now(),
      name,
      timestamp: Date.now(),
      boxes,
      log
    };
    setSnapshots(prev => [...prev, snapshot]);
  }, [boxes, log]);

  // Load a snapshot
  const loadSnapshot = useCallback((snapshot: VisualSnapshot) => {
    try {
      if (!snapshot || !snapshot.boxes) {
        throw new Error("Invalid snapshot data.");
      }

      setBoxes(snapshot.boxes);
      setLog(snapshot.log);

      toast({
        title: "Success",
        description: "Snapshot loaded successfully.",
      });
    } catch (error) {
      handleError(error, "Failed to load snapshot. Please try again.");
    }
  }, []);

  // Load a snapshot by id
  const loadSnapshotById = (id: string) => {
    const snapshot = snapshots.find(s => s.id.toString() === id)
    if (snapshot) {
      loadSnapshot(snapshot)
    }
  }

  // Delete a snapshot
  const deleteSnapshot = (id: string) => {
    setSnapshots(prevSnapshots => prevSnapshots.filter(s => s.id.toString() !== id))
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

  // Update the highlightBox function to maintain backward compatibility
  const highlightBox = useCallback((row: number, column: number, level: number) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => {
        // Check both new position format and legacy properties
        const matchesNewFormat = box.position[0] === row && box.position[1] === column && box.position[2] === level;
        const matchesLegacyFormat = box.row === row && box.column === column && box.level === level;
        
        return {
          ...box,
          highlighted: matchesNewFormat || matchesLegacyFormat,
        };
      }),
    );
  }, []);

  // Update the reapplyLastRemoved function
  const reapplyLastRemoved = useCallback(() => {
    const lastRemoveEntry = log.findLast(entry => entry.action === 'remove');
    if (lastRemoveEntry) {
      const box = boxes.find(box => box.id === lastRemoveEntry.boxId);
      if (box) {
        addBox(box);
      }
    }
  }, [log, boxes, addBox]);

  // Update the exportData function
  const exportData = () => {
    try {
      const dataToExport = {
        boxes,
        log,
        snapshots
      };
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `box_data_${new Date().toISOString()}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      addLogEntry({
        action: 'export',
        boxId: '',
        timestamp: Date.now(),
        details: 'Data exported successfully',
        customerName: selectedCustomer,
        boxCount: boxes.length,
        varietyName: selectedVariety,
        grade: selectedGrade,
        loadingDate,
        locations: [],
        boxSize,
        color: customerBoxColor,
        startingRow: selectedRow,
        stackHeight,
        customerBoxColor
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      addLogEntry({
        action: 'export_error',
        boxId: '',
        timestamp: Date.now(),
        details: `Error exporting data: ${String(error)}`,
        customerName: selectedCustomer,
        boxCount: boxes.length,
        varietyName: selectedVariety,
        grade: selectedGrade,
        loadingDate,
        locations: [],
        boxSize,
        color: customerBoxColor,
        startingRow: selectedRow,
        stackHeight,
        customerBoxColor
      });
    }
  };

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
      isFiltered,
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
      isFiltered,
    ],
  )

  // Only render children when data is loaded
  if (!isLoaded) {
    return <div>Loading box data...</div>
  }

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>
}

