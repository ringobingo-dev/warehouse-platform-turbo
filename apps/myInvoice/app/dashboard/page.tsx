"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useUIStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { DateRangePicker } from "@/components/date-range-picker"
import { PageHeader } from "@/components/page-header"
import { useWorkOS } from "@/components/auth/workos-provider"
import { ArrowUpRight, DollarSign, FileText, Users } from "lucide-react"
import { PageContainer } from "@/components/page-container"

export default function DashboardPage() {
  const { user, isLoading } = useWorkOS()
  const { theme } = useTheme()
  const { colorTheme } = useUIStore()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [mounted, setMounted] = useState(false)

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show a loading state if component not mounted
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // For development, show a placeholder if user is not available
  const userName = user?.firstName || "Developer"

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${userName}!`}
        actions={<DateRangePicker value={dateRange} onValueChange={setDateRange} />}
      />
      <PageContainer>
        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>
        <div className="p-4">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <LineChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>You made 265 invoices this month.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChart />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Storage Usage</CardTitle>
                    <CardDescription>Storage usage across all warehouses.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Invoice Status</CardTitle>
                    <CardDescription>Distribution of invoice statuses.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View detailed analytics for your warehouse.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>View and download reports for your warehouse.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <BarChart />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive email notifications for new invoices.</p>
                      </div>
                      <div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive SMS notifications for new invoices.</p>
                      </div>
                      <div>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </div>
  )
}

