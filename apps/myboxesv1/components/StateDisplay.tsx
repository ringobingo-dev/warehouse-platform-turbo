import { useBoxStore } from "@/store/boxStore"

export const StateDisplay = () => {
  const { rows, columns, levels, boxTemplates, selectedTemplateId } = useBoxStore()

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Current State</h2>
      <p>Rows: {rows}</p>
      <p>Columns: {columns}</p>
      <p>Levels: {levels}</p>
      <p>Number of Box Templates: {boxTemplates.length}</p>
      <p>Selected Template ID: {selectedTemplateId || "None"}</p>
    </div>
  )
}

