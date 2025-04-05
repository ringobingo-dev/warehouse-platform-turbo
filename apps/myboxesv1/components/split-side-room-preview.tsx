interface SplitSideRoomPreviewProps {
  leftSideLength: number
  leftSideWidth: number
  rightSideLength: number
  rightSideWidth: number
  leftSideName: string
  rightSideName: string
  doorConfig: {
    wall: string
    offset: number
    width: number
  }
  corridorConfig: {
    wall: string
    width: number
  }
  leftSideConfig: {
    rows: {
      count: number
      startWall: string
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  rightSideConfig: {
    rows: {
      count: number
      startWall: string
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
}

export function SplitSideRoomPreview({
  leftSideLength,
  leftSideWidth,
  rightSideLength,
  rightSideWidth,
  leftSideName,
  rightSideName,
  doorConfig,
  corridorConfig,
  leftSideConfig,
  rightSideConfig,
}: SplitSideRoomPreviewProps) {
  // Calculate total dimensions
  const totalLength = Math.max(leftSideLength, rightSideLength)
  const totalWidth = leftSideWidth + rightSideWidth + corridorConfig.width

  // Calculate scale to fit the preview in the container
  const scale = Math.min(1, 300 / totalLength, 300 / totalWidth)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative border-2 border-gray-300"
        style={{
          width: `${totalWidth * scale}px`,
          height: `${totalLength * scale}px`,
        }}
      >
        {/* Left Side (EAST) */}
        <div
          className="absolute bg-blue-100 border border-blue-300"
          style={{
            left: 0,
            top: 0,
            width: `${leftSideWidth * scale}px`,
            height: `${leftSideLength * scale}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-700">
            {leftSideName}
            <div className="absolute bottom-1 right-1 text-[10px] text-blue-600">
              {leftSideConfig.rows.count}R × {leftSideConfig.columns.count}C
            </div>
          </div>
        </div>

        {/* Corridor */}
        <div
          className="absolute bg-green-100 border border-green-300"
          style={{
            left: `${leftSideWidth * scale}px`,
            top: 0,
            width: `${corridorConfig.width * scale}px`,
            height: `${totalLength * scale}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-green-700 rotate-90">
            Corridor
          </div>
        </div>

        {/* Right Side (WEST) */}
        <div
          className="absolute bg-purple-100 border border-purple-300"
          style={{
            left: `${(leftSideWidth + corridorConfig.width) * scale}px`,
            top: 0,
            width: `${rightSideWidth * scale}px`,
            height: `${rightSideLength * scale}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-700">
            {rightSideName}
            <div className="absolute bottom-1 right-1 text-[10px] text-purple-600">
              {rightSideConfig.rows.count}R × {rightSideConfig.columns.count}C
            </div>
          </div>
        </div>

        {/* Door */}
        {doorConfig.wall === "front" && (
          <div
            className="absolute bg-red-400"
            style={{
              left: `${((totalWidth * doorConfig.offset) / 100) * scale}px`,
              bottom: 0,
              width: `${doorConfig.width * scale}px`,
              height: `${4 * scale}px`,
              transform: "translateX(-50%)",
            }}
          />
        )}
      </div>
    </div>
  )
}

