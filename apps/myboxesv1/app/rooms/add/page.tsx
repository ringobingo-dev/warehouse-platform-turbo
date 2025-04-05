"use client"

import { useState, useEffect } from "react"
import RoomDetailsForm from "./RoomDetailsForm"
import RoomDimensionsForm from "./RoomDimensionsForm"
import RoomFeaturesForm from "./RoomFeaturesForm"
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid"
import Step3SavePrompt from "@/components/add-room/Step3SavePrompt"

const AddRoomPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [roomDetails, setRoomDetails] = useState({
    name: "",
    description: "",
    category: "",
  })
  const [roomDimensions, setRoomDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  })
  const [roomFeatures, setRoomFeatures] = useState({
    windows: 0,
    doors: 0,
    colorPalette: "",
  })

  // Let's look for any validation logic that might be affecting the Save button
  const [isValid, setIsValid] = useState({
    step1: false,
    step2: false,
    step3: false,
  })

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleRoomDetailsChange = (e) => {
    setRoomDetails({ ...roomDetails, [e.target.name]: e.target.value })
  }

  const handleRoomDimensionsChange = (e) => {
    setRoomDimensions({ ...roomDimensions, [e.target.name]: Number.parseFloat(e.target.value) })
  }

  const handleRoomFeaturesChange = (e) => {
    setRoomFeatures({ ...roomFeatures, [e.target.name]: e.target.value })
  }

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return <RoomDetailsForm roomDetails={roomDetails} onChange={handleRoomDetailsChange} nextStep={nextStep} />
      case 2:
        return (
          <RoomDimensionsForm
            roomDimensions={roomDimensions}
            onChange={handleRoomDimensionsChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )
      case 3:
        return (
          <>
            <RoomFeaturesForm roomFeatures={roomFeatures} onChange={handleRoomFeaturesChange} prevStep={prevStep} />
            <Step3SavePrompt />
          </>
        )
      default:
        return <div>Unknown step</div>
    }
  }

  // Check if there's validation logic like this:
  useEffect(() => {
    // This might be causing the button to change when description changes
    setIsValid({
      ...isValid,
      step3: roomDetails.description && roomDetails.description.length > 0,
    })
  }, [roomDetails])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add a New Room</h1>
      {renderForm()}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <ChevronLeftIcon className="h-5 w-5 inline-block mr-1" />
            Previous
          </button>
        )}
        {currentStep < 3 && (
          <button
            onClick={nextStep}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
            <ChevronRightIcon className="h-5 w-5 inline-block ml-1" />
          </button>
        )}
      </div>
    </div>
  )
}

export default AddRoomPage

