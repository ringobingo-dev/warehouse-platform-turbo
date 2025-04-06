"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Copy,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Bot,
  Workflow,
  ChevronDown,
  Tag,
  Clock,
  Calendar,
  Pause,
  Play,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { PageContainer } from "@/components/page-container"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock data for email job templates
const mockEmailTemplates = [
  {
    id: "email-template-001",
    name: "Invoice Payment Reminder",
    description: "Automated reminder for unpaid invoices",
    subject: "Payment Reminder: Invoice #{invoiceNumber}",
    body: `Dear {customerName},

We hope this email finds you well. This is a friendly reminder that invoice #{invoiceNumber} for ${"{amount}"} is currently due for payment.

Invoice Details:
- Invoice Number: {invoiceNumber}
- Issue Date: {issueDate}
- Due Date: {dueDate}
- Amount Due: {amount}

If you have already made the payment, please disregard this reminder. If not, we would appreciate your prompt attention to this matter.

You can make payment via bank transfer to:
Bank: {bankName}
Account: {accountNumber}
Reference: {invoiceNumber}

If you have any questions or concerns, please don't hesitate to contact us.

Thank you for your business.

Best regards,
{senderName}
{companyName}
{contactEmail}
{contactPhone}`,
    trigger: {
      type: "scheduled",
      condition: "invoice.status == 'overdue'",
      schedule: "3,7,14", // days after due date
    },
    variables: [
      "customerName",
      "invoiceNumber",
      "issueDate",
      "dueDate",
      "amount",
      "bankName",
      "accountNumber",
      "senderName",
      "companyName",
      "contactEmail",
      "contactPhone",
    ],
    status: "active",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-06-10T00:00:00Z",
    category: "invoice",
    templateType: "standard-workflow",
  },
  {
    id: "email-template-002",
    name: "New Invoice Notification",
    description: "Notification when a new invoice is created",
    subject: "New Invoice #{invoiceNumber} from {companyName}",
    body: `Dear {customerName},

We hope this email finds you well. Please find attached your invoice #{invoiceNumber} for {amount}.

Invoice Details:
- Invoice Number: {invoiceNumber}
- Issue Date: {issueDate}
- Due Date: {dueDate}
- Amount Due: {amount}

Payment Details:
Bank: {bankName}
Account: {accountNumber}
Reference: {invoiceNumber}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business.

Best regards,
{senderName}
{companyName}
{contactEmail}
{contactPhone}`,
    trigger: {
      type: "event",
      condition: "invoice.status == 'created'",
      schedule: "immediate",
    },
    variables: [
      "customerName",
      "invoiceNumber",
      "issueDate",
      "dueDate",
      "amount",
      "bankName",
      "accountNumber",
      "senderName",
      "companyName",
      "contactEmail",
      "contactPhone",
    ],
    status: "active",
    createdAt: "2023-02-20T00:00:00Z",
    updatedAt: "2023-06-10T00:00:00Z",
    category: "invoice",
    templateType: "standard-workflow",
  },
  {
    id: "email-template-003",
    name: "Storage Expiry Notification",
    description: "Notification when storage is about to expire",
    subject: "Storage Expiry Notice: {roomName}",
    body: `Dear {customerName},

We hope this email finds you well. This is a notification that your storage in {roomName} is set to expire on {expiryDate}.

Storage Details:
- Room: {roomName}
- Expiry Date: {expiryDate}
- Current Items: {itemCount} boxes
- Current Storage Fee: {storageFee} per day

If you wish to extend your storage period, please contact us before the expiry date. Otherwise, please arrange for the removal of your items by {expiryDate}.

If you have any questions or need assistance, please don't hesitate to contact us.

Thank you for choosing our storage services.

Best regards,
{senderName}
{companyName}
{contactEmail}
{contactPhone}`,
    trigger: {
      type: "scheduled",
      condition: "storage.daysUntilExpiry <= 7",
      schedule: "7,3,1", // days before expiry
    },
    variables: [
      "customerName",
      "roomName",
      "expiryDate",
      "itemCount",
      "storageFee",
      "senderName",
      "companyName",
      "contactEmail",
      "contactPhone",
    ],
    status: "inactive",
    createdAt: "2023-03-05T00:00:00Z",
    updatedAt: "2023-06-10T00:00:00Z",
    category: "storage",
    templateType: "standard-workflow",
  },
  {
    id: "email-template-004",
    name: "Welcome New Customer",
    description: "Welcome email for new customers",
    subject: "Welcome to {companyName}!",
    body: `Dear {customerName},

Welcome to {companyName}! We're thrilled to have you as our customer.

Your account has been successfully created and is now ready to use. Here are your account details:

- Account ID: {accountId}
- Email: {customerEmail}

As a valued customer, you now have access to our full range of services, including:
- Secure storage facilities
- Inventory management
- Flexible billing options
- 24/7 customer support

If you have any questions or need assistance getting started, please don't hesitate to contact our support team at {supportEmail} or call us at {supportPhone}.

We look forward to serving you!

Best regards,
{senderName}
{companyName}
{contactEmail}
{contactPhone}`,
    trigger: {
      type: "event",
      condition: "customer.status == 'new'",
      schedule: "immediate",
    },
    variables: [
      "customerName",
      "accountId",
      "customerEmail",
      "supportEmail",
      "supportPhone",
      "senderName",
      "companyName",
      "contactEmail",
      "contactPhone",
    ],
    status: "active",
    createdAt: "2023-04-12T00:00:00Z",
    updatedAt: "2023-06-10T00:00:00Z",
    category: "customer",
    templateType: "standard-workflow",
  },
  // New Agent Templates
  {
    id: "email-template-005",
    name: "Box Add Agent",
    description: "Automated notification when a box is added to the system",
    subject: "Box Added: {boxId}",
    body: `System Notification: Box Added

A new box has been added to the system.

Box Details:
- Box ID: {boxId}
- Box Type: {boxType}
- Location: {warehouseName}, {roomName}
- Added By: {userName}
- Added On: {timestamp}
- Customer: {customerName}

Box Properties:
- Dimensions: {length}x{width}x{height} cm
- Capacity: {capacity} kg
- Material: {material}

This is an automated message from the warehouse management system.`,
    trigger: {
      type: "event",
      condition: "box.status == 'created'",
      schedule: "immediate",
    },
    variables: [
      "boxId",
      "boxType",
      "warehouseName",
      "roomName",
      "userName",
      "timestamp",
      "customerName",
      "length",
      "width",
      "height",
      "capacity",
      "material",
    ],
    status: "active",
    createdAt: "2023-05-15T00:00:00Z",
    updatedAt: "2023-05-15T00:00:00Z",
    category: "box",
    templateType: "agent",
  },
  {
    id: "email-template-006",
    name: "Box Remove Agent",
    description: "Automated notification when a box is removed from the system",
    subject: "Box Removed: {boxId}",
    body: `System Notification: Box Removed

A box has been removed from the system.

Box Details:
- Box ID: {boxId}
- Box Type: {boxType}
- Previous Location: {warehouseName}, {roomName}
- Removed By: {userName}
- Removed On: {timestamp}
- Customer: {customerName}
- Reason: {removalReason}

Box History:
- Added On: {addedTimestamp}
- Total Storage Duration: {storageDuration} days
- Final Weight: {finalWeight} kg

This is an automated message from the warehouse management system.`,
    trigger: {
      type: "event",
      condition: "box.status == 'removed'",
      schedule: "immediate",
    },
    variables: [
      "boxId",
      "boxType",
      "warehouseName",
      "roomName",
      "userName",
      "timestamp",
      "customerName",
      "removalReason",
      "addedTimestamp",
      "storageDuration",
      "finalWeight",
    ],
    status: "active",
    createdAt: "2023-05-15T00:00:00Z",
    updatedAt: "2023-05-15T00:00:00Z",
    category: "box",
    templateType: "agent",
  },
  // Add this new template after the existing templates in the mockEmailTemplates array
  {
    id: "email-template-007",
    name: "Welcome New User",
    description: "Welcome email for new warehouse platform users",
    subject: "Welcome to {companyName} Warehouse Platform!",
    body: `Dear {firstName},

Welcome to the {companyName} Warehouse Platform! We're excited to have you join our community of warehouse managers and agricultural professionals.

Your account has been successfully created with the following details:
- Username: {username}
- Email: {email}
- Role: {role}

**Getting Started:**

1. **Complete Your Profile**: Add your contact information and preferences in the Settings section.
2. **Explore the Dashboard**: Get a quick overview of your warehouse activities.
3. **Set Up Your Warehouse**: Create your first warehouse and rooms to start managing your storage.
4. **Invite Team Members**: Add colleagues who need access to the platform.

**Key Features You Can Access:**

• Digital warehouse management with room-level tracking
• Customer and box inventory management
• Automated invoicing and payment tracking
• Real-time storage monitoring
• Mobile application for on-the-go management

Your subscription plan ({planType}) includes access to these features and our support team is available to help you get the most out of our platform.

If you have any questions or need assistance, please contact our support team at {supportEmail} or call us at {supportPhone}.

Thank you for choosing {companyName} Warehouse Platform!

Best regards,
{senderName}
{senderTitle}
{companyName}
{contactEmail}
{contactPhone}`,
    trigger: {
      type: "event",
      condition: "user.status == 'new'",
      schedule: "immediate",
    },
    variables: [
      "firstName",
      "username",
      "email",
      "role",
      "planType",
      "supportEmail",
      "supportPhone",
      "senderName",
      "senderTitle",
      "companyName",
      "contactEmail",
      "contactPhone",
    ],
    status: "active",
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z",
    category: "user",
    templateType: "standard-workflow",
  },
]

export default function EmailTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Filter templates based on search query and active tab
  const filteredTemplates = mockEmailTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "standard-workflow") return matchesSearch && template.templateType === "standard-workflow"
    if (activeTab === "agent") return matchesSearch && template.templateType === "agent"
    if (activeTab === "active") return matchesSearch && template.status === "active"
    if (activeTab === "inactive") return matchesSearch && template.status === "inactive"
    if (activeTab === "invoice") return matchesSearch && template.category === "invoice"
    if (activeTab === "storage") return matchesSearch && template.category === "storage"
    if (activeTab === "customer") return matchesSearch && template.category === "customer"
    if (activeTab === "box") return matchesSearch && template.category === "box"
    if (activeTab === "user") return matchesSearch && template.category === "user"

    return matchesSearch
  })

  // Get the selected template for preview
  const templateToPreview = selectedTemplate ? mockEmailTemplates.find((t) => t.id === selectedTemplate) : null

  // Toggle template status (active/inactive)
  const toggleTemplateStatus = (templateId: string) => {
    // In a real app, this would update the database
    console.log(`Toggling status for template: ${templateId}`)
  }

  // Get template type badge
  const getTemplateTypeBadge = (templateType: string) => {
    if (templateType === "agent") {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Bot className="h-3 w-3" />
          <span className="text-xs">Agent</span>
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Workflow className="h-3 w-3" />
          <span className="text-xs">Standard Workflow</span>
        </Badge>
      )
    }
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Email Job Templates"
        description="Create and manage automated email job templates"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        }
      />
      <PageContainer fullWidth>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="standard-workflow">Standard Workflow</TabsTrigger>
              <TabsTrigger value="agent">Agent</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
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
                  <DropdownMenuItem onClick={() => setActiveTab("invoice")}>Invoice</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("storage")}>Storage</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("customer")}>Customer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("box")}>Box</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("user")}>User</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Trigger Type</DropdownMenuItem>
                  <DropdownMenuItem>Creation Date</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Templates</CardTitle>
                <CardDescription>Showing {filteredTemplates.length} email templates</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No email templates found. Try adjusting your search or filters.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              template.status === "active" ? "bg-primary/10" : "bg-muted-foreground/10"
                            }`}
                          >
                            {template.templateType === "agent" ? (
                              <Bot
                                className={`h-5 w-5 ${
                                  template.status === "active" ? "text-primary" : "text-muted-foreground"
                                }`}
                              />
                            ) : (
                              <Mail
                                className={`h-5 w-5 ${
                                  template.status === "active" ? "text-primary" : "text-muted-foreground"
                                }`}
                              />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{template.name}</h3>
                              {getTemplateTypeBadge(template.templateType)}
                              <Badge variant={template.status === "active" ? "default" : "outline"} className="ml-2">
                                {template.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span>{template.category.charAt(0).toUpperCase() + template.category.slice(1)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Trigger: {template.trigger.type}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <Switch
                            id={`activate-${template.id}`}
                            checked={template.status === "active"}
                            onCheckedChange={() => toggleTemplateStatus(template.id)}
                            className="mr-2"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template.id)
                              setPreviewMode(true)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTemplate(template.id)
                                  setPreviewMode(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toggleTemplateStatus(template.id)}>
                                {template.status === "active" ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Template
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Standard Workflow Tab */}
          <TabsContent value="standard-workflow">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Standard Workflow Templates
                </CardTitle>
                <CardDescription>Email templates for standard automated workflows</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No standard workflow templates found. Try adjusting your search or filters.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              template.status === "active" ? "bg-primary/10" : "bg-muted-foreground/10"
                            }`}
                          >
                            <Mail
                              className={`h-5 w-5 ${
                                template.status === "active" ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{template.name}</h3>
                              <Badge variant={template.status === "active" ? "default" : "outline"}>
                                {template.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">Subject:</span> {template.subject}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template.id)
                              setPreviewMode(true)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agent Tab */}
          <TabsContent value="agent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Agent Templates
                </CardTitle>
                <CardDescription>Automated system agent notification templates</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No agent templates found. Try adjusting your search or filters.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              template.status === "active" ? "bg-primary/10" : "bg-muted-foreground/10"
                            }`}
                          >
                            <Bot
                              className={`h-5 w-5 ${
                                template.status === "active" ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{template.name}</h3>
                              <Badge variant={template.status === "active" ? "default" : "outline"}>
                                {template.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">Subject:</span> {template.subject}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template.id)
                              setPreviewMode(true)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents would be similar but with filtered data */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Templates</CardTitle>
                <CardDescription>Email templates that are currently active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">Active templates will be displayed here</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle>Inactive Templates</CardTitle>
                <CardDescription>Email templates that are currently inactive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">Inactive templates will be displayed here</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>

      {/* Email Template Preview Dialog */}
      {previewMode && templateToPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-5xl max-h-[95vh] overflow-auto">
            <div className="sticky top-0 bg-background p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Email Template Preview</h2>
              <Button variant="ghost" size="icon" onClick={() => setPreviewMode(false)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  {templateToPreview.templateType === "agent" ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs">Agent</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Workflow className="h-3 w-3" />
                      <span className="text-xs">Standard Workflow</span>
                    </Badge>
                  )}
                  <Badge variant={templateToPreview.status === "active" ? "default" : "outline"}>
                    {templateToPreview.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Subject</h3>
                  <p className="text-base font-medium">{templateToPreview.subject}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Body</h3>
                  <div className="border rounded-md p-4 whitespace-pre-wrap">{templateToPreview.body}</div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Variables</h3>
                  <div className="flex flex-wrap gap-2">
                    {templateToPreview.variables.map((variable) => (
                      <Badge key={variable} variant="outline">{`{${variable}}`}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Trigger Information</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Type:</span> {templateToPreview.trigger.type}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Condition:</span> {templateToPreview.trigger.condition}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Schedule:</span>{" "}
                          {templateToPreview.trigger.schedule === "immediate"
                            ? "Immediate"
                            : `${templateToPreview.trigger.schedule.split(",").join(", ")} ${templateToPreview.trigger.type === "scheduled" && templateToPreview.category === "invoice" ? "days after due date" : "days before expiry"}`}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Status:</span> {templateToPreview.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Preview Mode</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      This is a preview of the email template. Variables (shown in {"{curly braces}"}) will be replaced
                      with actual values when the email is sent.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  Close
                </Button>
                <Button>Edit Template</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PostgreSQL Integration Note */}
      <Collapsible className="mx-2 mb-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full flex justify-between">
            <span>Database Integration Notes</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-3 mt-2 border rounded-md bg-muted/30">
            <h3 className="font-medium mb-2">PostgreSQL Integration Note</h3>
            <p className="text-sm text-muted-foreground">
              This page will be integrated with PostgreSQL to fetch and manage email job templates. The implementation
              will include:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Storing email templates in the database with variables, triggers, and conditions</li>
              <li>Support for both Standard Workflow and Agent template types</li>
              <li>Scheduling system for automated email sending based on triggers</li>
              <li>Template editor with variable insertion and formatting options</li>
              <li>Email sending history and analytics</li>
            </ul>
            <div className="mt-4 text-sm">
              <p className="font-medium">Example PostgreSQL Schema:</p>
              <pre className="bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                {`-- Email Job Templates Table
CREATE TABLE email_job_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  trigger_type VARCHAR(50) NOT NULL, -- 'event', 'scheduled'
  trigger_condition TEXT,
  trigger_schedule TEXT,
  variables JSONB,
  status VARCHAR(20) DEFAULT 'inactive',
  category VARCHAR(50),
  template_type VARCHAR(50) NOT NULL, -- 'standard-workflow', 'agent'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Jobs Table (for tracking sent emails)
CREATE TABLE email_jobs (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES email_job_templates(id),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              </pre>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

