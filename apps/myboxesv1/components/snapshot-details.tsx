"use client"

import type { RoomSnapshot } from "../types/RoomSnapshot"
import { Button } from "../components/ui/button"

interface SnapshotDetailsProps {
  snapshot: RoomSnapshot
  onClose: () => void
}

export function SnapshotDetails({ snapshot, onClose }: SnapshotDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full max-w-none">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Current Snapshot Details</h2>
        <div className="space-y-2 w-full">
          <p>
            <strong>Timestamp:</strong> {new Date(snapshot.timestamp).toLocaleString()}
          </p>
          <p>
            <strong>Total Boxes:</strong> {snapshot.boxSummary.totalBoxes}
          </p>
          <p>
            <strong>Room Configuration:</strong> {snapshot.roomConfig.rows}x{snapshot.roomConfig.columns}x
            {snapshot.roomConfig.levels}
          </p>
          <h3 className="text-xl font-semibold mt-4">Box Summary</h3>
          <div className="w-full">
            <h4 className="font-semibold">Boxes by Customer:</h4>
            <ul className="w-full">
              {Object.entries(snapshot.boxSummary.boxesByCustomer).map(([customer, count]) => (
                <li key={customer} className="w-full">
                  {customer}: {count}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <h4 className="font-semibold">Boxes by Variety:</h4>
            <ul className="w-full">
              {Object.entries(snapshot.boxSummary.boxesByVariety).map(([variety, count]) => (
                <li key={variety} className="w-full">
                  {variety}: {count}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <h4 className="font-semibold">Boxes by Grade:</h4>
            <ul className="w-full">
              {Object.entries(snapshot.boxSummary.boxesByGrade).map(([grade, count]) => (
                <li key={grade} className="w-full">
                  {grade}: {count}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

