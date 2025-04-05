"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddBoxesTab } from "./add-boxes-tab"
import { RemoveBoxesTab } from "./remove-boxes-tab"
import { Plus, Trash2, Search, History } from "lucide-react"

export function MaintenancePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Maintenance</h1>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="add" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Boxes
          </TabsTrigger>
          <TabsTrigger value="remove" className="flex items-center">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Boxes
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Search Boxes
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <AddBoxesTab />
        </TabsContent>

        <TabsContent value="remove">
          <RemoveBoxesTab />
        </TabsContent>

        <TabsContent value="search">
          <div className="p-4 text-center text-gray-500">Search Boxes functionality will be implemented here</div>
        </TabsContent>

        <TabsContent value="history">
          <div className="p-4 text-center text-gray-500">History functionality will be implemented here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

