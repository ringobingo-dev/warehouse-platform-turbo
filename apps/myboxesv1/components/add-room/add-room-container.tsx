import type React from "react"

interface AddRoomContainerProps {
  children: React.ReactNode
}

export function AddRoomContainer({ children }: AddRoomContainerProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow min-h-[calc(100vh-200px)] flex items-center justify-center py-6">
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}

