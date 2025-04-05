import type React from "react"
import { formatDimension } from "@/lib/shared/format-helpers"

interface RoomDetailsProps {
  name: string
  description: string
  sizeSqFt: number
  bedCount: number
  bathCount: number
  rate: number
  amenities: string[]
  imageUrl: string
}

const RoomDetails: React.FC<RoomDetailsProps> = ({
  name,
  description,
  sizeSqFt,
  bedCount,
  bathCount,
  rate,
  amenities,
  imageUrl,
}) => {
  return (
    <div className="container mx-auto p-4">
      <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-64 object-cover rounded-md mb-4" />
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <p className="text-gray-700 mb-4">{description}</p>

      <div className="flex items-center mb-2">
        <span className="font-semibold">Size:</span>
        <span className="ml-1">{formatDimension(sizeSqFt)}</span>
      </div>

      <div className="flex items-center mb-2">
        <span className="font-semibold">Beds:</span>
        <span className="ml-1">{bedCount}</span>
      </div>

      <div className="flex items-center mb-2">
        <span className="font-semibold">Baths:</span>
        <span className="ml-1">{bathCount}</span>
      </div>

      <div className="flex items-center mb-2">
        <span className="font-semibold">Rate:</span>
        <span className="ml-1">${rate} per night</span>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Amenities:</h2>
        <ul className="list-disc list-inside">
          {amenities.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RoomDetails

