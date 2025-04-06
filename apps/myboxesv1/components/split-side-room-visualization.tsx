interface SplitSideRoomVisualizationProps {
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
  storageConfig: any
  leftSideConfig: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  rightSideConfig: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
  leftSideConfigured?: boolean
  rightSideConfigured?: boolean
  scale?: number // New prop for overall scaling
}

export function SplitSideRoomVisualization({
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
  leftSideConfigured = false,
  rightSideConfigured = false,
  scale = 0.75, // Default scale of 75%
}: SplitSideRoomVisualizationProps) {
  // Calculate the maximum length for proportional scaling
  const maxLength = Math.max(leftSideLength, rightSideLength)

  // Calculate the total width for proportional scaling
  const totalWidth = leftSideWidth + rightSideWidth + corridorConfig.width

  // Calculate the proportional dimensions for visualization
  const leftSideHeightPct = 100 // Use full height
  const rightSideHeightPct = 100 // Use full height

  // Calculate width percentages
  const leftSideWidthPct = (leftSideWidth / totalWidth) * 100
  const rightSideWidthPct = (rightSideWidth / totalWidth) * 100
  const corridorWidthPct = (corridorConfig.width / totalWidth) * 100

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Container with fixed dimensions that won't be affected by labels */}
      <div
        className="relative border border-gray-300 rounded-lg bg-white flex items-center justify-center"
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          maxWidth: "90%",
          maxHeight: "90%",
        }}
      >
        {/* External Wall Labels - positioned absolutely */}
        <div className="absolute top-0 left-0 w-full text-center -translate-y-8">
          <span className="text-sm font-medium text-blue-600">Back Wall</span>
        </div>

        <div className="absolute left-0 top-1/2 -translate-x-24 -translate-y-1/2">
          <span className="text-sm font-medium text-blue-600">Left Wall</span>
        </div>

        <div className="absolute right-0 top-1/2 translate-x-24 -translate-y-1/2">
          <span className="text-sm font-medium text-blue-600">Right Wall</span>
        </div>

        {/* Bottom label - Front Wall (internal) */}
        <div className="absolute bottom-0 left-0 w-full text-center">
          <span className="text-sm font-medium bg-yellow-200 px-4 py-1 rounded-t">Front Wall</span>
        </div>

        <div className="flex h-full w-full">
          {/* Left Side (EAST) */}
          <div
            className="relative border-r border-blue-500 flex items-center justify-center bg-blue-50"
            style={{
              width: `${leftSideWidthPct}%`,
              height: "100%",
            }}
          >
            {/* Grid overlay for left side */}
            {leftSideConfigured && leftSideConfig.rows.count > 0 && leftSideConfig.columns.count > 0 && (
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${leftSideConfig.columns.count}, 1fr)`,
                  gridTemplateRows: `repeat(${leftSideConfig.rows.count}, 1fr)`,
                }}
              >
                {Array.from({
                  length: leftSideConfig.rows.count * leftSideConfig.columns.count,
                }).map((_, index) => (
                  <div key={`left-${index}`} className="border border-dashed border-blue-400"></div>
                ))}
              </div>
            )}
            <div className="font-bold text-2xl text-blue-700 z-10">EAST</div>

            {/* Row numbers along the left side */}
            {leftSideConfigured && leftSideConfig.rows.count > 0 && (
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
                {Array.from({ length: leftSideConfig.rows.count }).map((_, index) => {
                  const rowIndex =
                    leftSideConfig.rows.startWall === "front" ? leftSideConfig.rows.count - index : index + 1
                  return (
                    <div
                      key={`left-row-${index}`}
                      className="text-xs text-blue-700 font-bold bg-white/80 px-1 rounded ml-1"
                    >
                      {rowIndex}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Column numbers along the top */}
            {leftSideConfigured && leftSideConfig.columns.count > 0 && (
              <div className="absolute top-0 left-0 w-full flex justify-between px-2">
                {Array.from({ length: leftSideConfig.columns.count }).map((_, index) => (
                  <div
                    key={`left-col-${index}`}
                    className="text-xs text-blue-700 font-bold bg-white/80 px-1 rounded mt-1"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Corridor */}
          <div
            className="bg-yellow-200 h-full flex items-center justify-center"
            style={{ width: `${corridorWidthPct}%`, minHeight: "100%" }}
          >
            <div className="text-sm text-yellow-800 font-medium text-center">
              Corridor
              <br />({corridorConfig.width}m)
            </div>
          </div>

          {/* Right Side (WEST) */}
          <div
            className="relative border-l border-blue-500 flex items-center justify-center bg-blue-50"
            style={{
              width: `${rightSideWidthPct}%`,
              height: "100%",
            }}
          >
            {/* Grid overlay for right side */}
            {rightSideConfigured && rightSideConfig.rows.count > 0 && rightSideConfig.columns.count > 0 && (
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${rightSideConfig.columns.count}, 1fr)`,
                  gridTemplateRows: `repeat(${rightSideConfig.rows.count}, 1fr)`,
                }}
              >
                {Array.from({
                  length: rightSideConfig.rows.count * rightSideConfig.columns.count,
                }).map((_, index) => (
                  <div key={`right-${index}`} className="border border-dashed border-blue-400"></div>
                ))}
              </div>
            )}
            <div className="font-bold text-2xl text-blue-700 z-10">WEST</div>

            {/* Row numbers along the right side */}
            {rightSideConfigured && rightSideConfig.rows.count > 0 && (
              <div className="absolute right-0 top-0 h-full flex flex-col justify-between py-2">
                {Array.from({ length: rightSideConfig.rows.count }).map((_, index) => {
                  const rowIndex =
                    rightSideConfig.rows.startWall === "front" ? rightSideConfig.rows.count - index : index + 1
                  return (
                    <div
                      key={`right-row-${index}`}
                      className="text-xs text-blue-700 font-bold bg-white/80 px-1 rounded mr-1"
                    >
                      {rowIndex}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Column numbers along the top - reversed for WEST side */}
            {rightSideConfigured && rightSideConfig.columns.count > 0 && (
              <div className="absolute top-0 left-0 w-full flex justify-between px-2">
                {Array.from({ length: rightSideConfig.columns.count }).map((_, index) => (
                  <div
                    key={`right-col-${index}`}
                    className="text-xs text-blue-700 font-bold bg-white/80 px-1 rounded mt-1"
                  >
                    {rightSideConfig.columns.count - index}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Door */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500"
          style={{
            width: `${(doorConfig.width / totalWidth) * 100}%`,
            height: "20px",
            marginLeft: `${((doorConfig.offset - 50) / 100) * 20}%`, // Offset from center
          }}
        >
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
            <span className="text-sm font-medium text-green-700 whitespace-nowrap">Door ({doorConfig.width}m)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

