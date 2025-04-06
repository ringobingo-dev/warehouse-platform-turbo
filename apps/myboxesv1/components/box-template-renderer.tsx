import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import type { BoxTemplate } from "@/utils/templates"

interface BoxTemplateRendererProps {
  template: BoxTemplate
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  material?: string
}

export function BoxTemplateRenderer({
  template,
  dimensions = template.defaultDimensions,
  material = template.defaultMaterial,
}: BoxTemplateRendererProps) {
  return (
    <div className="w-full h-64 border rounded-md overflow-hidden">
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls enableZoom={true} enablePan={true} />

        <mesh receiveShadow castShadow>
          <boxGeometry args={[dimensions.width / 10, dimensions.height / 10, dimensions.depth / 10]} />
          <meshStandardMaterial color={material === "cardboard" ? "#D4B996" : "#CCCCCC"} roughness={0.7} />
        </mesh>

        <gridHelper args={[20, 20]} />
      </Canvas>
    </div>
  )
}

