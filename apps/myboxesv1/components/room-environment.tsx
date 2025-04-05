"use client"

import React, { useRef, useMemo, useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { BoxModel } from "./box-model"
import { WallLabel } from "./wall-label"
import * as THREE from "three"
import { Text } from "@react-three/drei"
import { EffectComposer, N8AO } from "@react-three/postprocessing"
// NX: Constants with multiple levels of parent directories
import { COLORS, ROOM_DIMENSIONS, CANVAS_DIMENSIONS } from "../config/constants"

// TODO: Review for Stage 1 completeness

interface Box {
  size: "rectangle" | "square"
  row: number
  column: number
  level: number
  color: string
  highlighted: boolean
  varietyName: string
  grade: string
  loadingDate: string
}

interface RoomEnvironmentProps {
  rows: number
  columns: number
  levels: number
  boxes: Box[]
  boxColor: string
  isFiltered: boolean
  visualizationMode: "basic" | "enhanced" | "realistic"
  floorTexture?: THREE.Texture | null
}

export const RoomEnvironment = React.memo(
  ({ rows, columns, levels, boxes, boxColor, isFiltered, visualizationMode, floorTexture }: RoomEnvironmentProps) => {
    console.log("RoomEnvironment rendering with:", {
      rows,
      columns,
      levels,
      boxCount: boxes.length,
      isFiltered,
      visualizationMode,
    })

    // Log all boxes for debugging
    console.log("Boxes to render:", boxes)

    const groupRef = useRef<THREE.Group>(null)
    const { scene, camera } = useThree()

    // Remove the rotation animation entirely to fix the alignment issue
    // useFrame((state) => {
    //   if (groupRef.current) {
    //     groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
    //   }
    // })

    const floorSize = ROOM_DIMENSIONS.FLOOR_SIZE
    const rowSpacing = floorSize / rows
    const columnSpacing = floorSize / columns

    // Calculate room boundaries
    const roomLeft = -floorSize / 2
    const roomRight = floorSize / 2
    const roomBack = -floorSize / 2
    const roomHeight = ROOM_DIMENSIONS.ROOM_HEIGHT

    useEffect(() => {
      // Set up scene background and fog
      scene.background = new THREE.Color(COLORS.BACKGROUND)
      scene.fog = new THREE.Fog(COLORS.BACKGROUND, 20, 100)

      // Adjust camera position and zoom
      camera.position.set(0, 5, 15) // Example position
      camera.lookAt(0, 0, 0) // Look at the center of the scene
    }, [scene, camera])

    /**
     * Generates a floor texture with a grid pattern based on the current room dimensions.
     * @returns {THREE.Texture} A canvas texture representing the floor grid.
     */
    const generateFloorTexture = useMemo(() => {
      if (floorTexture) return floorTexture

      const canvas = document.createElement("canvas")
      canvas.width = CANVAS_DIMENSIONS.WIDTH
      canvas.height = CANVAS_DIMENSIONS.HEIGHT
      const context = canvas.getContext("2d")
      if (context) {
        context.fillStyle = COLORS.FLOOR
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.strokeStyle = "rgba(0, 0, 255, 0.5)" // Semi-transparent blue
        context.setLineDash([10, 10]) // Dashed line
        context.lineWidth = 2

        // Draw columns (vertical lines)
        for (let i = 0; i <= columns; i++) {
          const x = (i / columns) * canvas.width
          context.beginPath()
          context.moveTo(x, 0)
          context.lineTo(x, canvas.height)
          context.stroke()
        }

        // Draw rows (horizontal lines)
        for (let i = 0; i <= rows; i++) {
          const y = (i / rows) * canvas.height
          context.beginPath()
          context.moveTo(0, y)
          context.lineTo(canvas.width, y)
          context.stroke()
        }
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }, [rows, columns, floorTexture])

    /**
     * Generates lighting components based on the current visualization mode.
     * @returns {JSX.Element} React elements representing the appropriate lighting setup.
     */
    const generateLighting = useMemo(() => {
      switch (visualizationMode) {
        case "basic":
          return (
            <>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
            </>
          )
        case "enhanced":
          return (
            <>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
              <pointLight position={[-5, 10, -5]} intensity={0.5} />
              <spotLight position={[0, 15, 0]} angle={0.5} penumbra={0.5} intensity={0.5} castShadow />
            </>
          )
        case "realistic":
          return (
            <>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
              <pointLight position={[-5, 10, -5]} intensity={0.5} />
              <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={0.8} castShadow />
            </>
          )
        default:
          return (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
            </>
          )
      }
    }, [visualizationMode])

    /**
     * Generates post-processing effects based on the current visualization mode.
     * @returns {JSX.Element | null} React elements representing the post-processing effects, or null if not applicable.
     */
    const generatePostProcessing = useMemo(() => {
      switch (visualizationMode) {
        case "basic":
          return null
        case "enhanced":
          return (
            <EffectComposer>
              <N8AO intensity={1.5} color="black" aoRadius={2} samples={5} />
            </EffectComposer>
          )
        case "realistic":
          return (
            <EffectComposer>
              <N8AO intensity={3} color="black" aoRadius={3} samples={8} />
            </EffectComposer>
          )
        default:
          return null
      }
    }, [visualizationMode])

    /**
     * Generates 3D box models for each box in the room.
     * @returns {(JSX.Element | null)[]} An array of BoxModel components or null values.
     */
    const generateBoxes = useMemo(() => {
      console.log(`Generating ${boxes.length} box models`)

      return boxes.map((box, index) => {
        if (!box) {
          console.warn(`Box at index ${index} is undefined or null`)
          return null // Skip if box is undefined or null
        }

        const boxDimensions = box.size === "rectangle" ? [1.6, 1.2, 1] : [1.2, 1.2, 1.2]
        const [width, height, depth] = boxDimensions

        // Calculate positions to keep boxes within room boundaries
        // Subtract 1 from box indices because room calculations are 0-based
        const rowPosition = roomLeft + (box.row - 1) * rowSpacing + rowSpacing / 2
        const columnPosition = roomBack + (box.column - 1) * columnSpacing + columnSpacing / 2
        const levelPosition = (box.level - 1) * height + height / 2

        // Determine the color to use - prioritize highlighting, then filtered state, then the box's own color
        const boxColorToUse = isFiltered ? COLORS.HIGHLIGHT : box.highlighted ? COLORS.HIGHLIGHT : box.color || boxColor

        console.log(
          `Rendering box at position [${rowPosition}, ${levelPosition}, ${columnPosition}], color: ${boxColorToUse}`,
        )

        return (
          <BoxModel
            key={`box-${index}-${box.row}-${box.column}-${box.level}`}
            position={[rowPosition, levelPosition, columnPosition]}
            dimensions={boxDimensions}
            color={boxColorToUse}
            name={`${box.size} Box`}
            customerInitials={`${box.level}${box.row}${box.column}`}
            varietyName={box.varietyName}
            grade={box.grade}
            loadingDate={box.loadingDate}
            visualizationMode={visualizationMode}
          />
        )
      })
    }, [boxes, boxColor, isFiltered, roomLeft, roomBack, rowSpacing, columnSpacing, visualizationMode])

    return (
      <>
        <group ref={groupRef}>
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]} receiveShadow>
            <planeGeometry args={[floorSize, floorSize]} />
            <meshStandardMaterial map={generateFloorTexture} />
          </mesh>

          {/* Ceiling */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]} receiveShadow>
            <planeGeometry args={[floorSize, floorSize]} />
            <meshStandardMaterial color={COLORS.CEILING} />
          </mesh>

          {/* Walls */}
          <mesh position={[0, roomHeight / 2, roomBack]} receiveShadow>
            <boxGeometry args={[floorSize, roomHeight, 0.1]} />
            <meshStandardMaterial color={COLORS.WALL} />
          </mesh>
          <mesh position={[roomLeft, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[floorSize, roomHeight, 0.1]} />
            <meshStandardMaterial color={COLORS.WALL} />
          </mesh>
          <mesh position={[roomRight, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[floorSize, roomHeight, 0.1]} />
            <meshStandardMaterial color={COLORS.WALL} />
          </mesh>

          {/* Wall Labels */}
          <WallLabel position={[0, 8, roomBack + 0.1]} rotation={[0, 0, 0]} text="Back Wall" />
          <WallLabel position={[roomLeft + 0.1, 8, 0]} rotation={[0, Math.PI / 2, 0]} text="Left Wall" />
          <WallLabel position={[roomRight - 0.1, 8, 0]} rotation={[0, -Math.PI / 2, 0]} text="Right Wall" />

          {/* Grid Labels - Using 1-based indexing */}
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: columns }, (_, col) => {
              // Calculate positions to keep boxes within room boundaries
              const x = roomLeft + (col + 0.5) * rowSpacing
              const z = roomBack + (row + 0.5) * columnSpacing

              return (
                <Text
                  key={`label-${row}-${col}`}
                  position={[x, 0.01, z]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.15}
                  color="black"
                  anchorX="center"
                  anchorY="middle"
                >
                  {`R${row + 1}C${col + 1}`}
                </Text>
              )
            }),
          )}

          {/* Boxes */}
          {generateBoxes}
        </group>

        {/* Dynamic lighting based on visualization mode */}
        {generateLighting}

        {/* Dynamic post-processing based on visualization mode */}
        {generatePostProcessing}
      </>
    )
  },
)

RoomEnvironment.displayName = "RoomEnvironment"

