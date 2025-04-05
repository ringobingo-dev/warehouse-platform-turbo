"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Calendar, Clock, User, Building, Tag } from "lucide-react"

interface Job {
  id: string
  title: string
  status: "in-progress" | "pending" | "completed"
  assignedTo: string
  description: string
  dueDate: string
  timeEstimate: string
  priority: "high" | "medium" | "low"
  customer: string
  roomId: string
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Inventory Count - Cold Storage A",
    status: "in-progress",
    assignedTo: "John Smith",
    description:
      "Complete a full inventory count of all boxes in Cold Storage A. Verify customer, variety, and grade information.",
    dueDate: "2025-03-20",
    timeEstimate: "4 hours",
    priority: "high",
    customer: "Multiple",
    roomId: "1",
  },
  {
    id: "2",
    title: "Box Relocation - Dry Storage B",
    status: "pending",
    assignedTo: "Sarah Johnson",
    description: "Move Orchard Delights Yellow Onions from row 3 to row 7 to consolidate inventory.",
    dueDate: "2025-03-22",
    timeEstimate: "2 hours",
    priority: "medium",
    customer: "Orchard Delights Inc.",
    roomId: "2",
  },
  {
    id: "3",
    title: "Quality Check - Climate Controlled C",
    status: "completed",
    assignedTo: "Mike Davis",
    description: "Perform quality check on Acme Fruit Co. Rainier Cherries. Check for any signs of spoilage.",
    dueDate: "2025-03-15",
    timeEstimate: "1 hour",
    priority: "low",
    customer: "Acme Fruit Co.",
    roomId: "3",
  },
  {
    id: "4",
    title: "Shipment Preparation - Cold Storage A",
    status: "pending",
    assignedTo: "John Smith",
    description: "Prepare 15 boxes of Fresh Harvest Honeycrisp apples for shipment. Stage near loading dock.",
    dueDate: "2025-03-21",
    timeEstimate: "3 hours",
    priority: "high",
    customer: "Fresh Harvest Ltd.",
    roomId: "1",
  },
  {
    id: "5",
    title: "New Delivery - Dry Storage B",
    status: "pending",
    assignedTo: "Sarah Johnson",
    description: "Receive and store new delivery of Green Fields Red Onions. Allocate to rows 5-6.",
    dueDate: "2025-03-23",
    timeEstimate: "2 hours",
    priority: "medium",
    customer: "Green Fields Produce",
    roomId: "2",
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs)

  const getStatusBadge = (status: Job["status"]) => {
    const styles = {
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-green-100 text-green-800 border-green-200",
    }

    const labels = {
      "in-progress": "In Progress",
      pending: "Pending",
      completed: "Completed",
    }

    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Job["priority"]) => {
    const styles = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-orange-100 text-orange-800 border-orange-200",
      low: "bg-green-100 text-green-800 border-green-200",
    }

    return (
      <Badge variant="outline" className={styles[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getActionButton = (job: Job) => {
    switch (job.status) {
      case "in-progress":
        return (
          <Button size="sm" className="w-full">
            Continue Job
          </Button>
        )
      case "pending":
        return (
          <Button size="sm" className="w-full">
            Start Job
          </Button>
        )
      case "completed":
        return (
          <Button size="sm" variant="outline" className="w-full">
            View Details
          </Button>
        )
      default:
        return (
          <Button size="sm" className="w-full">
            View Job
          </Button>
        )
    }
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <User className="h-4 w-4" />
                  <span>{job.assignedTo}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(job.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.timeEstimate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{getPriorityBadge(job.priority)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.customer}</span>
                  </div>
                </div>
                <div>{getActionButton(job)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

