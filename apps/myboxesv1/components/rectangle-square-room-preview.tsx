interface RectangleSquareRoomPreviewProps {
  length: number
  width: number
  roomName: string
  doorConfig: {
    wall: string
    offset: number
    width: number
  }
  corridorConfig: {
    wall: string
    width: number
  }
  storageConfig: {
    rows: {
      count: number
      startWall: "front" | "back"
    }
    columns: {
      count: number
    }
    stackHeight: number
  }
}

export function RectangleSquareRoomPreview({
  length,
  width,
  roomName,
  doorConfig,
  corridorConfig,
  storageConfig,
}: RectangleSquareRoomPreviewProps) {
  // Calculate the aspect ratio for proportional scaling
  const aspectRatio = width / length

  // Calculate the corridor width as a percentage of the total dimension
  const corridorWidthPct =
    corridorConfig.wall === "left" || corridorConfig.wall === "right"
      ? (corridorConfig.width / width) * 100
      : (corridorConfig.width / length) * 100

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-3xl h-[300px] border border-gray-300 rounded-lg bg-white">
        {/* Top label - Back Wall */}
        <div className="absolute top-0 left-0 w-full text-center -mt-6">
          <span className="text-xs font-medium text-blue-600">Back Wall ({width}m)</span>
        </div>

        {/* Left label - Left Wall */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6">
          <span className="text-xs font-medium text-blue-600">
            Left
            <br />
            Wall ({length}m)
          </span>
        </div>

        {/* Right label - Right Wall */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6">
          <span className="text-xs font-medium text-blue-600">
            Right
            <br />
            Wall ({length}m)
          </span>
        </div>

        {/* Bottom label - Front Wall */}
        <div className="absolute bottom-0 left-0 w-full text-center -mb-6">
          <span className="text-xs font-medium text-blue-600">Front Wall ({width}m)</span>
        </div>

        {/* Main room area */}
        <div className="relative h-full w-full flex items-center justify-center bg-blue-50">
          {/* Corridor if configured */}
          {corridorConfig.width > 0 && (
            <div
              className={`absolute bg-yellow-200 flex items-center justify-center`}
              style={{
                [corridorConfig.wall === "left" || corridorConfig.wall === "right" ? "width" : "height"]:
                  `${corridorWidthPct}%`,
                [corridorConfig.wall === "left" || corridorConfig.wall === "right" ? "height" : "width"]: "100%",
                [corridorConfig.wall]: 0,
              }}
            >
              <div className="text-[8px] text-yellow-800 font-medium text-center">
                Corridor
                <br />({corridorConfig.width}m)
              </div>
            </div>
          )}

          {/* Grid overlay for storage */}
          {storageConfig.rows.count > 0 && storageConfig.columns.count > 0 && (
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${storageConfig.columns.count}, 1fr)`,
                gridTemplateRows: `repeat(${storageConfig.rows.count}, 1fr)`,
                ...(corridorConfig.width > 0 && {
                  [corridorConfig.wall]: `${corridorWidthPct}%`,
                  width:
                    corridorConfig.wall === "left" || corridorConfig.wall === "right"
                      ? `calc(100% - ${corridorWidthPct}%)`
                      : "100%",
                  height:
                    corridorConfig.wall === "top" || corridorConfig.wall === "bottom"
                      ? `calc(100% - ${corridorWidthPct}%)`
                      : "100%",
                }),
              }}
            >
              {Array.from({
                length: storageConfig.rows.count * storageConfig.columns.count,
              }).map((_, index) => (
                <div key={`grid-${index}`} className="border border-dashed border-blue-400"></div>
              ))}
            </div>
          )}

          {/* Room name */}
          <div className="font-medium text-sm text-blue-700 z-10">{roomName}</div>

          {/* Row numbers along the left side */}
          {storageConfig.rows.count > 0 && (
            <div
              className="absolute left-0 top-0 h-full flex flex-col justify-between py-1"
              style={{
                ...(corridorConfig.wall === "left" && {
                  left: `${corridorWidthPct}%`,
                }),
              }}
            >
              {Array.from({ length: storageConfig.rows.count }).map((_, index) => {
                const rowIndex = storageConfig.rows.startWall === "front" ? storageConfig.rows.count - index : index + 1
                return (
                  <div key={`row-${index}`} className="text-[8px] text-blue-700 font-bold -ml-2">
                    {rowIndex}
                  </div>
                )
              })}
            </div>
          )}

          {/* Column numbers along the top */}
          {storageConfig.columns.count > 0 && (
            <div
              className="absolute top-0 left-0 w-full flex justify-between px-1"
              style={{
                ...(corridorConfig.wall === "top" && {
                  top: `${corridorWidthPct}%`,
                }),
                ...(corridorConfig.wall === "left" && {
                  left: `${corridorWidthPct}%`,
                  width: `calc(100% - ${corridorWidthPct}%)`,
                }),
              }}
            >
              {Array.from({ length: storageConfig.columns.count }).map((_, index) => (
                <div key={`col-${index}`} className="text-[8px] text-blue-700 font-bold -mt-2">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Door */}
        <div
          className="absolute bg-green-500"
          style={{
            width:
              doorConfig.wall === "left" || doorConfig.wall === "right"
                ? "6px"
                : `${(doorConfig.width / width) * 100}%`,
            height:
              doorConfig.wall === "left" || doorConfig.wall === "right"
                ? `${(doorConfig.width / length) * 100}%`
                : "6px",
            [doorConfig.wall]: 0,
            ...(doorConfig.wall === "left" || doorConfig.wall === "right"
              ? { top: `${doorConfig.offset}%`, transform: "translateY(-50%)" }
              : { left: `${doorConfig.offset}%`, transform: "translateX(-50%)" }),
          }}
        >
          <div
            className="absolute whitespace-nowrap"
            style={{
              ...(doorConfig.wall === "front" && { top: "100%", left: "50%", transform: "translateX(-50%)" }),
              ...(doorConfig.wall === "back" && { bottom: "100%", left: "50%", transform: "translateX(-50%)" }),
              ...(doorConfig.wall === "left" && { left: "100%", top: "50%", transform: "translateY(-50%)" }),
              ...(doorConfig.wall === "right" && { right: "100%", top: "50%", transform: "translateY(-50%)" }),
            }}
          >
            <span className="text-[8px] text-green-700 mt-1">Door ({doorConfig.width}m)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

