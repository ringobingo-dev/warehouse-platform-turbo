"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { InvoiceForm } from "@/components/invoice/invoice-form"
import { Button } from "@/components/ui/button"
import { Plus, Edit, FileText, Calendar, User, Trash2, Search, Filter } from "lucide-react"
import { PageContainer } from "@/components/page-container"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for existing invoice templates
const mockTemplates = [
  {
    id: "template-001",
    name: "Standard Monthly Invoice",
    description: "Default template for monthly storage invoices",
    createdAt: "2023-01-15",
    updatedAt: "2023-06-10",
    category: "storage",
    isDefault: true,
  },
  {
    id: "template-002",
    name: "Handling Fee Invoice",
    description: "Template for one-time handling fees",
    createdAt: "2023-02-20",
    updatedAt: "2023-05-15",
    category: "handling",
    isDefault: false,
  },
  {
    id: "template-003",
    name: "Temperature Control Premium",
    description: "Template for climate-controlled storage",
    createdAt: "2023-03-05",
    updatedAt: "2023-04-12",
    category: "premium",
    isDefault: false,
  },
  {
    id: "template-004",
    name: "Seasonal Storage Package",
    description: "Template for seasonal storage contracts",
    createdAt: "2023-04-10",
    updatedAt: "2023-04-10",
    category: "seasonal",
    isDefault: false,
  },
]

export default function InvoiceTemplatePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Filter templates based on search query and active tab
  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "default") return matchesSearch && template.isDefault
    if (activeTab === "storage") return matchesSearch && template.category === "storage"
    if (activeTab === "handling") return matchesSearch && template.category === "handling"
    if (activeTab === "premium") return matchesSearch && template.category === "premium"
    if (activeTab === "seasonal") return matchesSearch && template.category === "seasonal"

    return matchesSearch
  })

  const handleEditTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setIsEditing(true)
  }

  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setIsEditing(true)
  }

  const handleBackToList = () => {
    setIsEditing(false)
    setSelectedTemplate(null)
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Invoice Templates"
        description="Create and manage your invoice templates"
        actions={
          isEditing ? (
            <Button variant="outline" onClick={handleBackToList}>
              Back to Templates
            </Button>
          ) : (
            <Button onClick={handleCreateTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          )
        }
      />
      <PageContainer>
        {isEditing ? (
          <Card>
            <CardContent className="p-6">
              <InvoiceForm templateId={selectedTemplate} onCancel={handleBackToList} isEditing={!!selectedTemplate} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Templates</TabsTrigger>
                  <TabsTrigger value="default">Default</TabsTrigger>
                  <TabsTrigger value="storage">Storage</TabsTrigger>
                  <TabsTrigger value="handling">Handling</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
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
                    <DropdownMenuItem onClick={() => setActiveTab("all")}>All Templates</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("default")}>Default Templates</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab("storage")}>Storage</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("handling")}>Handling</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("premium")}>Premium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("seasonal")}>Seasonal</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Templates</CardTitle>
                <CardDescription>
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No templates found. Try adjusting your search or filters.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{template.name}</h3>
                              {template.isDefault && <Badge variant="secondary">Default</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>Category: {template.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Last updated: {template.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template.id)}>
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </PageContainer>
    </div>
  )
}

