"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type React from "react"

interface BoxPosition {
  id: string
  name: string
  category: string
  row: number
  column: number
  level: number
  color?: string
}

interface ThreeDGridProps {
  length: number
  width: number
  rows: number
  columns: number
  levels: number
  door?: {
    wall: string
    offset: number
    width: number
  }
  corridor?: {
    wall: string
    offset: number
    width: number
  }
  highlightedCells?: {
    row: number
    column: number
    level: number
    color: string
  }[]
  boxes?: BoxPosition[]
}

const ThreeDGrid: React.FC<ThreeDGridProps> = ({
  length,
  width,
  rows,
  columns,
  levels,
  door,
  corridor,
  highlightedCells = [],
  boxes = [],
}) => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Calculate cell size based on room dimensions
    const cellSizeX = width / columns
    const cellSizeZ = length / rows
    const cellSizeY = Math.min(cellSizeX, cellSizeZ) // Use the smaller dimension for height

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 15)
    scene.add(directionalLight)

    // Setup renderer with correct size
    const containerWidth = mountRef.current.clientWidth
    const containerHeight = mountRef.current.clientHeight
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerWidth, containerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Setup camera
    const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.1, 1000)

    // Position camera to view the entire grid
    const maxDimension = Math.max(width, length, levels * cellSizeY)
    camera.position.set(width * 0.8, maxDimension * 0.8, length * 1.2)

    // Setup orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.target.set(width / 2, (levels * cellSizeY) / 2, length / 2)
    controls.update()

    // Create maps for highlighted cells and boxes for quick lookup
    const highlightedCellsMap = new Map()
    highlightedCells.forEach((cell) => {
      if (
        cell.row >= 1 &&
        cell.row <= rows &&
        cell.column >= 1 &&
        cell.column <= columns &&
        cell.level >= 1 &&
        cell.level <= levels
      ) {
        const key = `${cell.row}-${cell.column}-${cell.level}`
        highlightedCellsMap.set(key, cell.color)
      }
    })

    const boxesMap = new Map()
    boxes.forEach((box) => {
      if (
        box.row >= 1 &&
        box.row <= rows &&
        box.column >= 1 &&
        box.column <= columns &&
        box.level >= 1 &&
        box.level <= levels
      ) {
        const key = `${box.row}-${box.column}-${box.level}`
        // Use category to determine color if not specified
        const color = box.color || getCategoryColor(box.category)
        boxesMap.set(key, { id: box.id, name: box.name, color })
      }
    })

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(width, length)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
      roughness: 0.8,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = Math.PI / 2
    floor.position.set(width / 2, 0, length / 2)
    scene.add(floor)

    // Create grid lines
    const gridHelper = new THREE.GridHelper(Math.max(width, length), Math.max(rows, columns))
    gridHelper.position.set(width / 2, 0.01, length / 2) // Slightly above floor
    scene.add(gridHelper)

    // Create boxes for each cell
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= columns; col++) {
        for (let level = 1; level <= levels; level++) {
          const key = `${row}-${col}-${level}`
          const isHighlighted = highlightedCellsMap.has(key)
          const hasBox = boxesMap.has(key)

          // Create box geometry
          const boxGeometry = new THREE.BoxGeometry(
            cellSizeX * 0.9, // Slightly smaller than cell for spacing
            cellSizeY * 0.9,
            cellSizeZ * 0.9,
          )

          // Determine material based on cell state
          let boxMaterial
          if (isHighlighted) {
            // Highlighted cell takes precedence
            boxMaterial = new THREE.MeshStandardMaterial({
              color: highlightedCellsMap.get(key),
              transparent: true,
              opacity: 0.9,
              wireframe: false,
            })
          } else if (hasBox) {
            // Box is present but not highlighted
            const boxInfo = boxesMap.get(key)
            boxMaterial = new THREE.MeshStandardMaterial({
              color: boxInfo.color,
              transparent: true,
              opacity: 0.7,
              wireframe: false,
            })
          } else {
            // Empty cell
            boxMaterial = new THREE.MeshStandardMaterial({
              color: 0xf5f5f5, // Off-white color
              transparent: true,
              opacity: 0.2,
              wireframe: true,
            })
          }

          const box = new THREE.Mesh(boxGeometry, boxMaterial)

          // Position box in grid
          const xPos = (col - 0.5) * cellSizeX
          const yPos = (level - 0.5) * cellSizeY
          const zPos = (row - 0.5) * cellSizeZ

          box.position.set(xPos, yPos, zPos)
          scene.add(box)
        }
      }
    }

    // Add axes helper for orientation
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Handle window resizing
    const handleResize = () => {
      if (!mountRef.current) return

      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }

      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()

          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          }
        }
      })

      renderer.dispose()
    }
  }, [length, width, rows, columns, levels, door, corridor, highlightedCells, boxes])

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
        position: "relative",
      }}
    />
  )
}

// Helper function to get color based on category
function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    Potatoes: "#8B4513", // Brown
    Onions: "#9370DB", // Purple
    Fruits: "#FF6347", // Tomato
    Vegetables: "#228B22", // Forest Green
    Dairy: "#4682B4", // Steel Blue
    Meat: "#CD5C5C", // Indian Red
    Grains: "#DAA520", // Goldenrod
  }

  return categoryColors[category] || "#A0A0A0" // Default gray if category not found
}

export { ThreeDGrid }

