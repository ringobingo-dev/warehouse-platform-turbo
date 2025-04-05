// This file contains the definition of the Rectangle Box template

export interface BoxTemplate {
  id: string
  name: string
  type: "rectangle" | "cube" | "cylinder" | "custom"
  defaultDimensions: {
    width: number
    height: number
    depth: number
  }
  defaultMaterial: string
  description: string
}

export const boxTemplates: BoxTemplate[] = [
  {
    id: "rectangle-box",
    name: "Rectangle Box",
    type: "rectangle",
    defaultDimensions: {
      width: 12,
      height: 8,
      depth: 10,
    },
    defaultMaterial: "cardboard",
    description: "Standard rectangular box with customizable dimensions",
  },
  {
    id: "cube-box",
    name: "Cube Box",
    type: "cube",
    defaultDimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    defaultMaterial: "cardboard",
    description: "Perfect cube box with equal dimensions",
  },
  // Other templates...
]

export function getTemplateById(id: string): BoxTemplate | undefined {
  return boxTemplates.find((template) => template.id === id)
}

