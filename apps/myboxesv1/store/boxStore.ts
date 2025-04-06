import { create } from "zustand"
import type { BoxTemplate } from "@/types/BoxTemplate"

interface BoxState {
  rows: number
  columns: number
  levels: number
  boxTemplates: BoxTemplate[]
  selectedTemplateId: string | null
  setRows: (rows: number) => void
  setColumns: (columns: number) => void
  setLevels: (levels: number) => void
  addBoxTemplate: (template: BoxTemplate) => void
  updateBoxTemplate: (template: BoxTemplate) => void
  setSelectedTemplateId: (id: string | null) => void
  getSelectedTemplate: () => BoxTemplate | null
}

export const useBoxStore = create<BoxState>((set, get) => ({
  rows: 10,
  columns: 10,
  levels: 4,
  boxTemplates: [
    { id: "1", name: "Rectangle Box", width: 1.6, height: 1.2, depth: 1 },
    { id: "2", name: "Square Box", width: 1.2, height: 1.2, depth: 1.2 },
  ],
  selectedTemplateId: null,
  setRows: (rows) => set({ rows }),
  setColumns: (columns) => set({ columns }),
  setLevels: (levels) => set({ levels }),
  addBoxTemplate: (template) =>
    set((state) => ({
      boxTemplates: [...state.boxTemplates, template],
    })),
  updateBoxTemplate: (template) =>
    set((state) => ({
      boxTemplates: state.boxTemplates.map((t) => (t.id === template.id ? template : t)),
    })),
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  getSelectedTemplate: () => {
    const { boxTemplates, selectedTemplateId } = get()
    return boxTemplates.find((template) => template.id === selectedTemplateId) || null
  },
}))

