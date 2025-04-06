// Check if there's a specific layout for the add-room page
import { RoomBoxProvider } from "../../contexts/RoomBoxContext"
import { ReactNode } from "react"

interface AddRoomLayoutProps {
  children: ReactNode
}

export default function AddRoomLayout({ children }: AddRoomLayoutProps) {
  return <RoomBoxProvider>{children}</RoomBoxProvider>
}

