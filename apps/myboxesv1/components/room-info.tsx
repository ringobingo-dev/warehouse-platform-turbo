interface RoomInfoProps {
  rows: number
  columns: number
  levels: number
  totalBoxes: number
  capacity: number
}

export function RoomInfo({ rows, columns, levels, totalBoxes, capacity }: RoomInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg mb-4">
      <div className="text-center p-2 bg-white rounded shadow">
        <h3 className="font-semibold text-lg">Room Configuration</h3>
        <p>
          {rows} × {columns} × {levels}
        </p>
        <p className="text-sm text-gray-500">Rows × Columns × Levels</p>
      </div>
      <div className="text-center p-2 bg-white rounded shadow">
        <h3 className="font-semibold text-lg">Box Capacity</h3>
        <p>{capacity}</p>
        <p className="text-sm text-gray-500">Maximum boxes</p>
      </div>
      <div className="text-center p-2 bg-white rounded shadow">
        <h3 className="font-semibold text-lg">Current Occupancy</h3>
        <p>
          {totalBoxes} / {capacity}
        </p>
        <p className="text-sm text-gray-500">{Math.round((totalBoxes / capacity) * 100)}% full</p>
      </div>
    </div>
  )
}

