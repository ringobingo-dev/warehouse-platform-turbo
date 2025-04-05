"use client"

import { useRef, useState, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh, BufferGeometry } from "three"
import * as THREE from "three"
import { COLORS } from "@/config/constants"

interface BoxModelProps {
  position: [number, number, number]
  dimensions: [number, number, number]
  color: string
  name: string
  customerInitials?: string
  varietyName: string
  grade: string
  loadingDate: string
  visualizationMode?: "basic" | "enhanced" | "realistic"
}

export function BoxModel({
  position,
  dimensions,
  color,
  customerInitials = "",
  varietyName,
  grade,
  loadingDate,
  visualizationMode = "basic",
}: BoxModelProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [textureLoaded, setTextureLoaded] = useState(false)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    if (hovered && !clicked) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1)
    } else if (clicked) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  /**
   * Generates the geometries for all parts of the box model.
   * This includes the main box, footer supports, bottom boards, floor boards, panels, and label board.
   * @returns {THREE.BufferGeometry[]} An array of buffer geometries representing all parts of the box.
   */
  const generateGeometries = useMemo(() => {
    const [width, height, depth] = dimensions
    const numberOfPanels = 6
    const gapSize = 0.02
    const panelDepth = 0.04
    const geometries: BufferGeometry[] = []

    // Calculate panel height based on box height
    const totalGapHeight = gapSize * (numberOfPanels - 1)
    const panelHeight = (height - totalGapHeight) / numberOfPanels

    // Footer dimensions
    const footerHeight = 0.15 // 15cm height
    const footerWidth = 0.05 // 5cm width
    const footerDepth = depth // Full depth of box

    // Create footer supports (3 beams running front to back)
    const footerBeams = [
      new THREE.BoxGeometry(footerWidth, footerHeight, footerDepth),
      new THREE.BoxGeometry(footerWidth, footerHeight, footerDepth),
      new THREE.BoxGeometry(footerWidth, footerHeight, footerDepth),
    ]

    // Position the beams at the edges and center
    footerBeams[0].translate(-width / 2 + footerWidth / 2, -height / 2 - footerHeight / 2, 0)
    footerBeams[1].translate(0, -height / 2 - footerHeight / 2, 0) // Center beam
    footerBeams[2].translate(width / 2 - footerWidth / 2, -height / 2 - footerHeight / 2, 0)
    geometries.push(...footerBeams)

    // Create bottom boards (3 boards running left to right, aligned to the outside)
    const bottomBoardThickness = 0.03 // 3cm thickness
    const bottomBoardWidth = width // Full width of the box
    const bottomBoardDepth = 0.15 // 15cm depth
    const bottomBoardPositions = [-depth / 2 + bottomBoardDepth / 2, 0, depth / 2 - bottomBoardDepth / 2]

    bottomBoardPositions.forEach((zPos) => {
      const bottomBoard = new THREE.BoxGeometry(bottomBoardWidth, bottomBoardThickness, bottomBoardDepth)
      bottomBoard.translate(0, -height / 2 - footerHeight + bottomBoardThickness / 2, zPos)
      geometries.push(bottomBoard)
    })

    // Create floor boards (running left to right, outside of side walls)
    const floorBoardWidth = width // Full width of the box, including side panels
    const floorBoardHeight = 0.02 // 2cm height
    const floorBoardDepth = 0.15 // 15cm depth
    const gapBetweenBoards = 0.01 // 1cm gap
    const totalBoardAndGapDepth = floorBoardDepth + gapBetweenBoards
    const numberOfFloorBoards = Math.ceil(depth / totalBoardAndGapDepth)

    for (let i = 0; i < numberOfFloorBoards; i++) {
      const floorBoard = new THREE.BoxGeometry(floorBoardWidth, floorBoardHeight, floorBoardDepth)
      const zPosition = -depth / 2 + (i + 0.5) * totalBoardAndGapDepth

      // Adjust the last board if it would exceed the box dimensions
      if (i === numberOfFloorBoards - 1) {
        const remainingSpace = depth / 2 - zPosition
        if (remainingSpace < floorBoardDepth) {
          floorBoard.scale(1, 1, remainingSpace / floorBoardDepth)
          floorBoard.translate(0, -height / 2 + floorBoardHeight / 2, depth / 2 - remainingSpace / 2)
        } else {
          floorBoard.translate(0, -height / 2 + floorBoardHeight / 2, zPosition)
        }
      } else {
        floorBoard.translate(0, -height / 2 + floorBoardHeight / 2, zPosition)
      }

      geometries.push(floorBoard)
    }

    // Create panels for the front and back
    for (let i = 0; i < numberOfPanels; i++) {
      const panel = new THREE.BoxGeometry(width, panelHeight, panelDepth)
      panel.translate(0, -height / 2 + panelHeight / 2 + i * (panelHeight + gapSize), depth / 2)
      geometries.push(panel)

      const backPanel = panel.clone()
      backPanel.translate(0, 0, -depth)
      geometries.push(backPanel)
    }

    // Create panels for the left and right sides
    for (let i = 0; i < numberOfPanels; i++) {
      const panel = new THREE.BoxGeometry(panelDepth, panelHeight, depth)
      panel.translate(-width / 2, -height / 2 + panelHeight / 2 + i * (panelHeight + gapSize), 0)
      geometries.push(panel)

      const rightPanel = panel.clone()
      rightPanel.translate(width, 0, 0)
      geometries.push(rightPanel)
    }

    // Create metal brackets at corners
    const bracketSize = 0.03
    const bracketPositions = [
      [-width / 2, -height / 2, depth / 2],
      [width / 2, -height / 2, depth / 2],
      [-width / 2, -height / 2, -depth / 2],
      [width / 2, -height / 2, -depth / 2],
      [-width / 2, height / 2, depth / 2],
      [width / 2, height / 2, depth / 2],
      [-width / 2, height / 2, -depth / 2],
      [width / 2, height / 2, -depth / 2],
    ]

    bracketPositions.forEach(([x, y, z]) => {
      const bracket = new THREE.BoxGeometry(bracketSize, bracketSize, bracketSize)
      bracket.translate(x, y, z)
      geometries.push(bracket)
    })

    // Create label board
    const labelBoardWidth = 0.3 // 30cm width
    const labelBoardHeight = 0.2 // 20cm height
    const labelBoardDepth = 0.02 // 2cm depth
    const labelBoard = new THREE.BoxGeometry(labelBoardWidth, labelBoardHeight, labelBoardDepth)
    labelBoard.translate(0, height / 4, depth / 2 + labelBoardDepth / 2)
    geometries.push(labelBoard)

    return geometries
  }, [dimensions])

  /**
   * Creates and configures the wood texture for the box.
   * @returns {THREE.Texture} A configured wood texture.
   */
  const woodTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load(
      "/textures/wood_texture.jpg",
      () => setTextureLoaded(true),
      undefined,
      () => {
        console.warn("Failed to load wood texture")
        setTextureLoaded(false)
      },
    )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    return texture
  }, [])

  /**
   * Generates all materials used in the box model.
   * This includes materials for normal state, hover state, footer, metal parts, boards, and label.
   * @returns {Object} An object containing all the materials used in the box model.
   */
  const materials = useMemo(() => {
    const generateMaterial = (baseColor: string, roughness: number, metalness: number) => {
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: roughness,
        metalness: metalness,
        map: textureLoaded ? woodTexture : null,
        bumpMap: textureLoaded ? woodTexture : null,
        bumpScale: 0.02,
      })
    }

    return {
      normal: generateMaterial(color, 0.9, 0.1),
      hovered: generateMaterial(color, 0.7, 0.2), // Use the same color but different properties for hover
      footer: generateMaterial("#d4b795", 1, 0.05),
      metal: new THREE.MeshStandardMaterial({
        color: "#b4b4b4",
        roughness: 0.4,
        metalness: 0.8,
      }),
      bottomBoard: generateMaterial("#c4a484", 0.95, 0.05),
      floorBoard: generateMaterial("#deb887", 0.85, 0.1),
      labelBoard: new THREE.MeshStandardMaterial({
        color: COLORS.CEILING,
        roughness: 0.5,
        metalness: 0.1,
      }),
    }
  }, [woodTexture, color, textureLoaded])

  /**
   * Creates a texture for the label on the box, including customer initials, variety, grade, and loading date.
   * @returns {THREE.Texture} A canvas texture representing the box label.
   */
  const labelTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext("2d")
    if (context) {
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, 512, 512)
      context.font = "Bold 60px Arial"
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillStyle = "#000000"
      context.fillText(customerInitials.toUpperCase(), 256, 100)
      context.font = "40px Arial"
      context.fillText(varietyName, 256, 200)
      context.fillText(`Grade: ${grade}`, 256, 260)
      context.fillText(loadingDate, 256, 320)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }, [customerInitials, varietyName, grade, loadingDate])

  return (
    <group position={position}>
      <group
        ref={meshRef}
        onClick={() => setClicked(!clicked)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {generateGeometries.map((geometry, index) => (
          <mesh key={index} geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
              {...(index < 3
                ? materials.footer
                : index >= 3 && index <= 5
                  ? materials.bottomBoard
                  : index > 5 && index <= 5 + Math.ceil(dimensions[2] / 0.16)
                    ? materials.floorBoard
                    : index === generateGeometries.length - 1
                      ? { ...materials.labelBoard, map: labelTexture }
                      : index >= generateGeometries.length - 9
                        ? materials.metal
                        : hovered
                          ? materials.hovered
                          : materials.normal)}
            />
          </mesh>
        ))}
      </group>

      {/* Subtle edge highlights */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...dimensions)]} />
        <lineBasicMaterial color="#000000" opacity={0.1} transparent={true} />
      </lineSegments>
    </group>
  )
}

