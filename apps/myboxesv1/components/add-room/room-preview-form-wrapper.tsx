import { RoomPreviewForm } from "./room-preview-form"

interface RoomPreviewFormWrapperProps {
  roomData: any
  selectedRoom: string | null
  boxCount: number
  refreshKey: number
  handleRefresh: () => void
  roomShape: string
  doorConfig: any
  corridorConfig: any
  leftSideName: string
  rightSideName: string
}

export function RoomPreviewFormWrapper(props: RoomPreviewFormWrapperProps) {
  return (
    <div className="flex flex-col min-h-[600px]">
      <RoomPreviewForm {...props} />
    </div>
  )
}

