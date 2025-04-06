import type React from "react"
import { format, isBefore } from "date-fns"

interface Job {
  id: string
  type: "Room Load" | "Box Pickup"
  scheduledDate: Date
  customerName: string
  boxCount: number
}

interface RoomJobsProps {
  jobs: Job[]
}

const RoomJobs: React.FC<RoomJobsProps> = ({ jobs }) => {
  const today = new Date()

  const getPriorityColor = (date: Date) => {
    if (isBefore(date, today)) {
      return "text-red-500" // Overdue
    } else if (isBefore(date, new Date(today.getTime() + 24 * 60 * 60 * 1000))) {
      return "text-yellow-500" // Due within 24 hours
    } else {
      return "text-green-500" // Future date
    }
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Scheduled Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs scheduled for this room.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id} className="border p-2 rounded">
              <div className="flex justify-between items-center">
                <span className="font-medium">{job.type}</span>
                <span className={`${getPriorityColor(job.scheduledDate)}`}>
                  {format(job.scheduledDate, "yyyy-MM-dd HH:mm")}
                </span>
              </div>
              <div>Customer: {job.customerName}</div>
              <div>Boxes: {job.boxCount}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RoomJobs

