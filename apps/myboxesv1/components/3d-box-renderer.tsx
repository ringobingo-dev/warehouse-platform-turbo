"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useRoomBoxContext } from "@/contexts/RoomBoxContext"

interface Box3DRendererProps {
  width?: number
  height?: number
  className?: string
}

const Box3DRenderer: React.FC<Box3DRendererProps> = ({ width = 800, height = 600, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { rows, columns, stackHeight } = useRoomBoxContext()
  const [isRendering, setIsRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const boxesRef = useRef<THREE.Mesh[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const rendererDomElementRef = useRef<HTMLCanvasElement | null>(null)
  const mountedRef = useRef(true)

  // Initialize Three.js scene
  useEffect(() => {
    // Set mounted ref to true when component mounts
    mountedRef.current = true

    // Cleanup function to run when component unmounts
    return () => {
      mountedRef.current = false

      // Cancel animation frame if it exists
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Dispose of controls
      if (controlsRef.current) {
        controlsRef.current.dispose()
        controlsRef.current = null
      }

      // Dispose of scene objects
      if (sceneRef.current) {
        // Dispose of all geometries and materials
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose()
            }
            if (object.material instanceof THREE.Material) {
              object.material.dispose()
            } else if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            }
          }
        })

        // Clear all objects from the scene
        while (sceneRef.current.children.length > 0) {
          sceneRef.current.remove(sceneRef.current.children[0])
        }
        sceneRef.current = null
      }

      // Dispose of renderer
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }

      // Clear renderer DOM element reference
      rendererDomElementRef.current = null

      setIsRendering(false)
    }
  }, [])

  // Setup Three.js renderer
  useEffect(() => {
    if (!containerRef.current || !mountedRef.current) {
      return
    }

    // Check WebGL support first
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

      if (!gl) {
        setError("WebGL is not supported in your browser")
        return
      }
    } catch (e) {
      console.error("Error checking WebGL support:", e)
      setError("Error checking WebGL support")
      return
    }

    // Initialize scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    // Initialize camera with safe defaults
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight || 1
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.z = Math.max(rows || 3, columns || 3, stackHeight || 3) * 2
    camera.position.y = Math.max(rows || 3, columns || 3, stackHeight || 3)
    camera.position.x = Math.max(rows || 3, columns || 3, stackHeight || 3)
    cameraRef.current = camera

    // Initialize renderer
    try {
      console.log("Creating WebGL renderer")

      // Safely remove any existing renderer first
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }

      // Create new renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      })

      // Use container dimensions instead of props
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight || height

      renderer.setSize(containerWidth, containerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      // Safely clear the container using DOM methods
      if (containerRef.current) {
        // Store current children to safely remove them
        const childNodes = Array.from(containerRef.current.childNodes)

        // Remove each child individually with error handling
        childNodes.forEach((child) => {
          try {
            containerRef.current?.removeChild(child)
          } catch (e) {
            console.warn("Could not remove child node:", e)
          }
        })
      }

      // Add the new renderer
      if (containerRef.current && mountedRef.current) {
        containerRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer
        rendererDomElementRef.current = renderer.domElement
        console.log("Renderer created successfully")
      } else {
        // If container is no longer available, dispose of the renderer
        renderer.dispose()
        return
      }

      // Initialize controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.screenSpacePanning = false
      controls.minDistance = 1
      controls.maxDistance = 50
      controls.maxPolarAngle = Math.PI / 2
      controlsRef.current = controls

      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040, 1.5)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 10, 7.5)
      directionalLight.castShadow = true
      scene.add(directionalLight)

      // Add grid helper
      const gridSize = Math.max(rows || 3, columns || 3) * 2
      const gridHelper = new THREE.GridHelper(gridSize, gridSize)
      scene.add(gridHelper)

      // Add axes helper for debugging
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)

      // Set rendering flag
      setIsRendering(true)
      setError(null)

      // Start animation loop
      const animate = () => {
        if (!mountedRef.current) return

        animationFrameRef.current = requestAnimationFrame(animate)

        if (controlsRef.current) {
          controlsRef.current.update()
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }
      animate()
    } catch (error) {
      // Add type assertion for error handling
      const err = error as Error
      console.error("Error initializing WebGL renderer:", err)
      setError(`Error initializing 3D renderer: ${err.message}`)

      // Safely display error message
      if (containerRef.current && mountedRef.current) {
        // Store current children to safely remove them
        const childNodes = Array.from(containerRef.current.childNodes)

        // Remove each child individually with error handling
        childNodes.forEach((child) => {
          try {
            containerRef.current?.removeChild(child)
          } catch (e) {
            console.warn("Could not remove child node:", e)
          }
        })

        // Add error message
        const errorDiv = document.createElement("div")
        errorDiv.className = "p-4 bg-red-100 text-red-800 rounded"
        errorDiv.innerHTML = `
          <p class="font-bold">3D Rendering Error</p>
          <p>Your browser may not support WebGL or 3D rendering.</p>
          <p class="text-sm mt-2">Error details: ${err.message}</p>
        `
        containerRef.current.appendChild(errorDiv)
      }
    }
  }, [rows, columns, stackHeight]) // Re-initialize when these props change

  // Update boxes when configuration changes
  useEffect(() => {
    if (!sceneRef.current || !isRendering || !mountedRef.current) {
      return
    }

    // Use safe values
    const safeRows = rows || 3
    const safeColumns = columns || 3
    const safeStackHeight = stackHeight || 3

    // Remove existing boxes
    boxesRef.current.forEach((box) => {
      if (sceneRef.current && box.parent === sceneRef.current) {
        sceneRef.current.remove(box)
      }
    })
    boxesRef.current = []

    // Create new boxes
    const boxSize = 0.9 // Slightly smaller than 1 to create gaps
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)

    // Calculate offsets to center the grid
    const xOffset = (safeColumns - 1) / 2
    const yOffset = (safeStackHeight - 1) / 2
    const zOffset = (safeRows - 1) / 2

    for (let x = 0; x < safeColumns; x++) {
      for (let y = 0; y < safeStackHeight; y++) {
        for (let z = 0; z < safeRows; z++) {
          // Create a unique color based on position
          const color = new THREE.Color(
            0.5 + (x / safeColumns) * 0.5,
            0.5 + (y / safeStackHeight) * 0.5,
            0.5 + (z / safeRows) * 0.5,
          )

          const boxMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.5,
          })

          const box = new THREE.Mesh(boxGeometry, boxMaterial)

          // Position the box
          box.position.x = x - xOffset
          box.position.y = y - yOffset
          box.position.z = z - zOffset

          // Add to scene and track
          if (sceneRef.current) {
            sceneRef.current.add(box)
            boxesRef.current.push(box)
          }
        }
      }
    }

    // Update camera position based on new configuration
    if (cameraRef.current) {
      const maxDimension = Math.max(safeRows, safeColumns, safeStackHeight)
      cameraRef.current.position.set(maxDimension, maxDimension, maxDimension * 2)
      cameraRef.current.lookAt(0, 0, 0)
    }
  }, [rows, columns, stackHeight, isRendering])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current || !mountedRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight || 600

      // Update camera aspect ratio
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      // Update renderer size
      rendererRef.current.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", height: height }}
      data-testid="box-3d-renderer"
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-4">
          <div className="text-red-800 text-center">
            <p className="font-bold">Rendering Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      {!isRendering && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading 3D renderer...</div>
        </div>
      )}
    </div>
  )
}

export default Box3DRenderer

