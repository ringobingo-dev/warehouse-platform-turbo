"use client"

import type React from "react"

interface Step3Props {
  onSave: () => void
}

const Step3: React.FC<Step3Props> = ({ onSave }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-4">Step 3: Save Your 3D Room</h2>
        <p className="text-gray-700">
          Review your room design and click the "Save 3D Room" button to generate your 3D model.
        </p>
      </div>

      <button
        onClick={onSave}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        Save 3D Room
      </button>
    </div>
  )
}

export default Step3

