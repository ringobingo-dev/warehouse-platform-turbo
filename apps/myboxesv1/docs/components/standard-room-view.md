# StandardRoomView Component

## Overview

The `StandardRoomView` component provides a standardized way to display 3D room visualizations across the application. It wraps the `ResponsiveBoxView` component with consistent configuration settings to ensure a uniform user experience.

## Usage

```tsx
import { StandardRoomView } from "@/components/standard-room-view"

export default function MyPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState("room1")
  const [boxCount, setBoxCount] = useState(42)
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }
  
  return (
    <StandardRoomView
      refreshKey={refreshKey}
      onRefresh={handleRefresh}
      roomId={selectedRoom}
      boxCount={boxCount}
      className="my-custom-class" // Optional
    />
  )
}

