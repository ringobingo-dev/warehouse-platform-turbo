import { RoomSaveForm } from "./room-save-form"

interface RoomSaveFormWrapperProps {
  roomShape: string
  length: number
  width: number
  doorConfig: any
  corridorConfig: any
  storageConfig: any
  leftSideLength: number
  leftSideWidth: number
  rightSideLength: number
  rightSideWidth: number
  leftSideName: string
  rightSideName: string
  leftSideConfigured: boolean
  rightSideConfigured: boolean
  roomDescription: string
  setRoomDescription: (value: string) => void
  roomStatus: string
  setRoomStatus: (value: string) => void
  calculateFloorArea: () => number
  calculateTotalPositions: () => number
  getMaxStackHeight: () => number
}

export function RoomSaveFormWrapper(props: RoomSaveFormWrapperProps) {
  return (
    <div className="flex flex-col min-h-[600px]">
      <RoomSaveForm {...props} />
    </div>
  )
}

