import { Text } from "@react-three/drei"

interface WallLabelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  text: string
}

export function WallLabel({ position, rotation, text }: WallLabelProps) {
  return (
    <Text position={position} rotation={rotation} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
      {text}
    </Text>
  )
}

