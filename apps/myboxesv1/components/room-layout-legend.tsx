interface RoomLayoutLegendProps {
  doorConfig: {
    width: number
  }
  corridorConfig: {
    width: number
  }
  roomShape?: string
}

export function RoomLayoutLegend({ doorConfig, corridorConfig, roomShape }: RoomLayoutLegendProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Legend</h4>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border border-blue-500 bg-white"></div>
          <span>Room</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-200"></div>
          <span>Corridor ({corridorConfig.width}m wide)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500"></div>
          <span>Door ({doorConfig.width}m wide)</span>
        </div>
      </div>
    </div>
  )
}

