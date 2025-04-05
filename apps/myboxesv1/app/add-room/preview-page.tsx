"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Step3 from "./step3"

export default function PreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roomData, setRoomData] = useState(null)

  useEffect(() => {
    // Get room data from local storage based on the ID in the URL
    const roomId = searchParams.get("id")
    if (!roomId) {
      router.push("/add-room")
      return
    }

    const storedData = localStorage.getItem(`room_draft_${roomId}`)
    if (!storedData) {
      router.push("/add-room")
      return
    }

    try {
      const parsedData = JSON.parse(storedData)
      setRoomData(parsedData)
    } catch (error) {
      console.error("Failed to parse room data:", error)
      router.push("/add-room")
    }
  }, [router, searchParams])

  const handleSave = (data) => {
    // Save the final room data
    const roomId = searchParams.get("id")
    if (roomId) {
      // Remove the draft
      localStorage.removeItem(`room_draft_${roomId}`)
    }

    // Save to permanent storage
    const savedRooms = JSON.parse(localStorage.getItem("rooms") || "{}")
    const newRoomId = `room-${Date.now()}`
    savedRooms[newRoomId] = data
    localStorage.setItem("rooms", JSON.stringify(savedRooms))

    // Redirect to rooms list
    router.push("/dimensions")
  }

  if (!roomData) {
    return <div className="flex items-center justify-center h-[500px] w-full">Loading...</div>
  }

  return <Step3 roomData={roomData} onSave={handleSave} className="w-full" />
}

