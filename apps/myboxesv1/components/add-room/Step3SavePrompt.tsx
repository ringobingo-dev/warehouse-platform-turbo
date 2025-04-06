"use client"

import { useState } from "react"
import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Step3SavePrompt = () => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate saving process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Room saved successfully")
    } catch (error) {
      console.error("Error saving room:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ready to Save?</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Review your room configuration and save it to your account.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Room"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Step3SavePrompt

