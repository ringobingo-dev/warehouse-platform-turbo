"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface InventoryItem {
  id: string
  name: string
  quantity: number
  capacity: number
  category: string
}

const mockInventoryData: InventoryItem[] = [
  { id: "1", name: "Potatoes", quantity: 500, capacity: 1000, category: "Vegetables" },
  { id: "2", name: "Apples", quantity: 300, capacity: 500, category: "Fruits" },
  { id: "3", name: "Wheat", quantity: 1200, capacity: 1500, category: "Grains" },
  { id: "4", name: "Milk", quantity: 200, capacity: 300, category: "Dairy" },
  { id: "5", name: "Chicken", quantity: 150, capacity: 200, category: "Meat" },
]

const mockChartData = [
  { name: "Jan", inflow: 4000, outflow: 2400 },
  { name: "Feb", inflow: 3000, outflow: 1398 },
  { name: "Mar", inflow: 2000, outflow: 9800 },
  { name: "Apr", inflow: 2780, outflow: 3908 },
  { name: "May", inflow: 1890, outflow: 4800 },
  { name: "Jun", inflow: 2390, outflow: 3800 },
]

export default function DashboardPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])

  useEffect(() => {
    // In a real application, this would be an API call
    setInventoryData(mockInventoryData)
  }, [])

  const totalCapacity = inventoryData.reduce((sum, item) => sum + item.capacity, 0)
  const totalQuantity = inventoryData.reduce((sum, item) => sum + item.quantity, 0)
  const overallOccupancy = (totalQuantity / totalCapacity) * 100

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventory Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{overallOccupancy.toFixed(1)}%</div>
            <Progress value={overallOccupancy} className="w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuantity}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCapacity}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryData.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.category}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <Progress value={(item.quantity / item.capacity) * 100} className="w-40" />
                  <div className="text-sm font-medium">
                    {item.quantity} / {item.capacity}
                  </div>
                  <Badge variant={item.quantity / item.capacity > 0.9 ? "destructive" : "default"}>
                    {((item.quantity / item.capacity) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inflow" fill="#8884d8" name="Inflow" />
                <Bar dataKey="outflow" fill="#82ca9d" name="Outflow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

