"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Box,
  Ruler,
  Weight,
  Tag,
  Layers,
  Copy,
  Edit,
  Trash2,
  Check,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BoxType {
  id: string
  name: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  material: string
  capacity: number
  tare: number
  isDefault: boolean
  category: string
  notes: string
  createdAt: string
  updatedAt: string
}

interface BoxTemplatesProps {
  boxTypes: BoxType[]
}

export function BoxTemplates({ boxTypes }: BoxTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter box types based on search query and active tab
  const filteredBoxTypes = boxTypes.filter((boxType) => {
    const matchesSearch =
      boxType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boxType.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boxType.material.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "potato") return matchesSearch && boxType.category === "Potato"
    if (activeTab === "fruit") return matchesSearch && boxType.category === "Fruit"
    if (activeTab === "general") return matchesSearch && boxType.category === "General"

    return matchesSearch
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Box Templates</CardTitle>
          <CardDescription>Define and manage box templates for your warehouse</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="potato">Potato</TabsTrigger>
              <TabsTrigger value="fruit">Fruit</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Material</DropdownMenuItem>
                <DropdownMenuItem>Capacity</DropdownMenuItem>
                <DropdownMenuItem>Date Created</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBoxTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No box templates found. Try adjusting your search or filters.
            </div>
          ) : (
            filteredBoxTypes.map((boxType) => (
              <Card key={boxType.id} className="overflow-hidden">
                <div className="bg-muted px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Box className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{boxType.name}</h3>
                        {boxType.isDefault && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span className="text-xs">Default</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{boxType.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!boxType.isDefault && (
                          <DropdownMenuItem>
                            <Check className="h-4 w-4 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Dimensions: {boxType.dimensions.length}x{boxType.dimensions.width}x{boxType.dimensions.height}{" "}
                          cm
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        <span>Tare Weight: {boxType.tare} kg</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span>Capacity: {boxType.capacity} kg</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span>Material: {boxType.material}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span>Category: {boxType.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span>Created: {new Date(boxType.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">Notes:</span>
                        <p className="text-muted-foreground mt-1">{boxType.notes}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 px-4 py-2">
                  <div className="flex justify-end w-full gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Create Box
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

