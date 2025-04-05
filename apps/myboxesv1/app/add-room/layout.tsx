// Check if there's a specific layout for the add-room page
import { BoxProvider } from "@/contexts/BoxContext"

export default function AddRoomLayout({ children }) {
  return <BoxProvider>{children}</BoxProvider>
}

