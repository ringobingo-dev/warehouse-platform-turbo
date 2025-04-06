"use client"

import { useState } from "react"
import StepIndicator from "@/components/step-indicator"
import RoomBasicInfoForm from "@/components/room-forms/RoomBasicInfoForm"
import RoomDimensionsForm from "@/components/room-forms/RoomDimensionsForm"
import Room3DConfigForm from "@/components/room-forms/Room3DConfigForm"
import RoomPreviewForm from "@/components/room-forms/RoomPreviewForm"
import StepTransitionHandler from "@/components/step-transition-handler"
import { generate3DDataFromRoom } from "@/utils/room-data-generator"

const AddRoomPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    dimensions: {
      rows: 3,
      columns: 3,
      stackHeight: 3,
    },
    // other properties
  })

  const [triggerTransition, setTriggerTransition] = useState(false)
  const [is3DDataGenerated, setIs3DDataGenerated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleMoveToPreview = async () => {
    try {
      setIsSaving(true)
      // Generate 3D data
      const data3D = await generate3DDataFromRoom(roomData)

      // Update room data with 3D information
      setRoomData({
        ...roomData,
        data3D,
      })

      // Set flag that 3D data is generated
      setIs3DDataGenerated(true)

      // Explicitly trigger the transition only after data is generated
      // and the user has clicked the save button
      setTriggerTransition(true)
    } catch (error) {
      console.error("Error generating 3D data:", error)
      // Handle error
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave3DRoom = () => {
    handleMoveToPreview()
    // The transition is now explicitly triggered in handleMoveToPreview
    // after the data is successfully generated
  }

  const handleTransitionComplete = () => {
    setTriggerTransition(false)
  }

  return (
    <div className="container mx-auto p-4">
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {currentStep === 1 && (
        <RoomBasicInfoForm roomData={roomData} onRoomDataChange={setRoomData} onNext={() => setCurrentStep(2)} />
      )}

      {currentStep === 2 && (
        <RoomDimensionsForm
          roomData={roomData}
          onRoomDataChange={setRoomData}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <Room3DConfigForm
          roomData={roomData}
          onRoomDataChange={setRoomData}
          onSave={handleSave3DRoom}
          isSaving={isSaving}
        />
      )}

      {currentStep === 4 && (
        <RoomPreviewForm
          roomData={roomData}
          onBack={() => setCurrentStep(3)}
          onEdit={(step) => setCurrentStep(step)}
          onSubmit={() => {
            /* Handle submission */
          }}
          isSaving={isSaving}
        />
      )}

      <StepTransitionHandler
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        targetStep={4}
        triggerTransition={triggerTransition}
        onTransitionComplete={handleTransitionComplete}
      />
    </div>
  )
}

export default AddRoomPage

