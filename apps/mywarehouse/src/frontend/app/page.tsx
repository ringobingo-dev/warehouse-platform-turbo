"use client"

import { useState } from "react"
import { Warehouse } from "lucide-react"
import { TreeView, TreeItem } from "@/components/ui/tree-view"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { StackList, type StackListItem } from "@/components/ui/stack-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for room jobs
const roomJobs: StackListItem[] = [
  {
    id: "job-1",
    title: "Box Pickup - Customer 1",
    description: "10 boxes of Potatoes (Variety A)",
    status: "pending",
    date: "Today, 10:30 AM",
    priority: "high",
  },
  {
    id: "job-2",
    title: "Room Load - Room A",
    description: "15 boxes of Onions (Yellow)",
    status: "in-progress",
    date: "Today, 9:15 AM",
    priority: "medium",
  },
  {
    id: "job-3",
    title: "Inventory Check - Room B",
    description: "Verify stock levels and quality",
    status: "pending",
    date: "Tomorrow, 2:00 PM",
    priority: "low",
  },
  {
    id: "job-4",
    title: "Box Relocation - Room A to Room C",
    description: "5 boxes of Cherries (Sweet)",
    status: "pending",
    date: "Tomorrow, 11:00 AM",
    priority: "medium",
  },
  {
    id: "job-5",
    title: "Quality Inspection - Customer 2",
    description: "Check moisture levels in potato storage",
    status: "pending",
    date: "Mar 15, 9:00 AM",
    priority: "high",
  },
  {
    id: "job-6",
    title: "Temperature Adjustment - Room C",
    description: "Lower temperature by 2°C",
    status: "completed",
    date: "Yesterday, 4:30 PM",
  },
]

type UserType = "warehouseOwner" | "roomRenter" | "logisticsPartner" | "merchant"

export default function Home() {
  const [userType, setUserType] = useState<UserType>("warehouseOwner")

  const renderDashboardContent = () => {
    switch (userType) {
      case "warehouseOwner":
        return (
          <>
            <div className="md:col-span-2">
              <DashboardCard title="Warehouse Overview" icon={Warehouse}>
                <TreeView>
                  <TreeItem label="Warehouse 1">
                    <TreeItem label="Room A">
                      <TreeItem label="Customers">
                        <TreeItem label="Customer 1" />
                        <TreeItem label="Customer 2" />
                      </TreeItem>
                      <TreeItem label="Boxes">
                        <TreeItem label="Total: 100" />
                        <TreeItem label="Available: 50" />
                        <TreeItem label="Occupied: 50" />
                      </TreeItem>
                    </TreeItem>
                    <TreeItem label="Room B">
                      <TreeItem label="Customers">
                        <TreeItem label="Customer 3" />
                      </TreeItem>
                      <TreeItem label="Boxes">
                        <TreeItem label="Total: 80" />
                        <TreeItem label="Available: 30" />
                        <TreeItem label="Occupied: 50" />
                      </TreeItem>
                    </TreeItem>
                  </TreeItem>
                  <TreeItem label="Warehouse 2">
                    <TreeItem label="Room C">
                      <TreeItem label="Customers">
                        <TreeItem label="Customer 4" />
                        <TreeItem label="Customer 5" />
                      </TreeItem>
                      <TreeItem label="Boxes">
                        <TreeItem label="Total: 120" />
                        <TreeItem label="Available: 70" />
                        <TreeItem label="Occupied: 50" />
                      </TreeItem>
                    </TreeItem>
                  </TreeItem>
                  <TreeItem label="Overall Statistics">
                    <TreeItem label="Total Rooms: 3" />
                    <TreeItem label="Total Boxes: 300" />
                    <TreeItem label="Available Boxes: 150" />
                    <TreeItem label="Occupancy Rate: 50%" />
                  </TreeItem>
                </TreeView>
              </DashboardCard>
            </div>
            <div>
              <StackList title="Pending Room Jobs" items={roomJobs} emptyMessage="No pending jobs" maxItems={5} />
            </div>
          </>
        )
      case "roomRenter":
        return (
          <>
            <div className="md:col-span-2">
              <DashboardCard title="My Rented Rooms" icon={Warehouse}>
                <TreeView>
                  <TreeItem label="Warehouse 1">
                    <TreeItem label="Room A">
                      <TreeItem label="Boxes">
                        <TreeItem label="Total: 50" />
                        <TreeItem label="Available: 20" />
                        <TreeItem label="Occupied: 30" />
                      </TreeItem>
                    </TreeItem>
                  </TreeItem>
                  <TreeItem label="Warehouse 2">
                    <TreeItem label="Room C">
                      <TreeItem label="Boxes">
                        <TreeItem label="Total: 40" />
                        <TreeItem label="Available: 15" />
                        <TreeItem label="Occupied: 25" />
                      </TreeItem>
                    </TreeItem>
                  </TreeItem>
                </TreeView>
              </DashboardCard>
            </div>
            <div>
              <StackList
                title="My Pending Jobs"
                items={roomJobs.filter((job) => job.status === "pending")}
                emptyMessage="No pending jobs"
                maxItems={5}
              />
            </div>
          </>
        )
      case "logisticsPartner":
        return (
          <div className="col-span-3">
            <StackList
              title="Pending Logistics Jobs"
              items={roomJobs.map((job) => ({
                ...job,
                description: `${job.description}
Warehouse: ${job.id.includes("1") ? "Warehouse 1" : "Warehouse 2"}
Contact: ${job.id.includes("1") ? "+1 (555) 123-4567" : "+1 (555) 987-6543"}`,
              }))}
              emptyMessage="No pending logistics jobs"
              maxItems={10}
            />
          </div>
        )
      case "merchant":
        return (
          <>
            <div className="md:col-span-2">
              <DashboardCard title="My Inventory" icon={Warehouse}>
                <TreeView>
                  <TreeItem label="Warehouse 1">
                    <TreeItem label="Potatoes: 500 kg" />
                    <TreeItem label="Onions: 300 kg" />
                  </TreeItem>
                  <TreeItem label="Warehouse 2">
                    <TreeItem label="Cherries: 200 kg" />
                    <TreeItem label="Apples: 400 kg" />
                  </TreeItem>
                </TreeView>
              </DashboardCard>
            </div>
            <div>
              <StackList
                title="Recent Orders"
                items={roomJobs.map((job) => ({ ...job, title: `Order: ${job.title}` }))}
                emptyMessage="No recent orders"
                maxItems={5}
              />
            </div>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4 md:mb-0">myWarehouse Dashboard</h1>
              <Select value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouseOwner">Warehouse Owner</SelectItem>
                  <SelectItem value="roomRenter">Room Renter</SelectItem>
                  <SelectItem value="logisticsPartner">Logistics Partner</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderDashboardContent()}</div>
          </div>
        </section>
      </main>
    </div>
  )
}

