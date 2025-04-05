"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/page-container"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, MoreHorizontal, UserPlus, Mail, AlertCircle, CheckCircle, UserIcon, Shield } from "lucide-react"
import { getCustomerWithUsers, getPendingInvitations, inviteUserToCustomer } from "@/lib/services/customer-user-service"
import type { User as UserType, UserInvitation } from "@/lib/types/user"
import type { Customer } from "@/lib/types/customer"
import { useWorkOS } from "@/components/auth/workos-provider"

export default function CustomerUsersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user: currentUser } = useWorkOS()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [invitations, setInvitations] = useState<UserInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"customer_admin" | "customer_user">("customer_user")

  // Fetch customer and users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getCustomerWithUsers(params.id)
        if (result) {
          setCustomer(result.customer)
          setUsers(result.users)

          // Fetch pending invitations
          const pendingInvites = await getPendingInvitations(params.id)
          setInvitations(pendingInvites)
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)
        toast({
          title: "Error",
          description: "Failed to load customer data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  // Handle inviting a new user
  const handleInviteUser = async () => {
    if (!customer || !currentUser) return

    try {
      // Validate email
      if (!newUserEmail || !newUserEmail.includes("@")) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        })
        return
      }

      // Check if customer is approved
      if (customer.status !== "approved") {
        toast({
          title: "Customer not approved",
          description: "Users can only be invited to approved customers",
          variant: "destructive",
        })
        return
      }

      // Send invitation
      const invitation = await inviteUserToCustomer(newUserEmail, newUserRole, customer.id, currentUser.id)

      if (invitation) {
        setInvitations([...invitations, invitation])
        setInviteDialogOpen(false)
        setNewUserEmail("")

        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${newUserEmail}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error inviting user:", error)
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    }
  }

  // Handle resending an invitation
  const handleResendInvitation = async (invitationId: string) => {
    // In a real app, this would call an API to resend the invitation
    toast({
      title: "Invitation resent",
      description: "The invitation has been resent",
    })
  }

  // Handle canceling an invitation
  const handleCancelInvitation = async (invitationId: string) => {
    // In a real app, this would call an API to cancel the invitation
    setInvitations(invitations.filter((inv) => inv.id !== invitationId))

    toast({
      title: "Invitation canceled",
      description: "The invitation has been canceled",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Customer Users"
          description="Loading..."
          backLink={
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/customers/${params.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customer
              </Link>
            </Button>
          }
        />
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </PageContainer>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Customer Not Found"
          description="The requested customer could not be found"
          backLink={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/customers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customers
              </Link>
            </Button>
          }
        />
        <PageContainer>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Customer not found</h2>
              <p className="text-muted-foreground">
                The customer you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/customers">Back to Customers</Link>
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    )
  }

  const canInviteUsers =
    customer.status === "approved" &&
    (currentUser?.role === "admin" ||
      (currentUser?.role === "customer_admin" && currentUser?.customerId === customer.id))

  return (
    <div className="flex flex-col">
      <PageHeader
        title={`${customer.name} - Users`}
        description="Manage users for this customer"
        backLink={
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/customers/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customer
            </Link>
          </Button>
        }
        actions={
          canInviteUsers ? (
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite User</DialogTitle>
                  <DialogDescription>Send an invitation to a new user for {customer.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUserRole}
                      onValueChange={(value: "customer_admin" | "customer_user") => setNewUserRole(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer_admin">Customer Admin</SelectItem>
                        <SelectItem value="customer_user">Customer User</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Customer Admins can manage users and settings. Customer Users have limited access.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />
      <PageContainer>
        {customer.status !== "approved" && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Customer Not Approved</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  This customer is currently in {customer.status} status. Additional users can only be invited once the
                  customer is approved.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-1">
          {/* Active Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Active Users
              </CardTitle>
              <CardDescription>Users with access to this customer account</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No active users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "customer_admin" ? "default" : "outline"}>
                            {user.role === "customer_admin" ? (
                              <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                <span>Admin</span>
                              </div>
                            ) : (
                              "User"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "success" : "outline"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Deactivate User</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Pending Invitations
              </CardTitle>
              <CardDescription>Invitations that have been sent but not yet accepted</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invited By</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No pending invitations
                      </TableCell>
                    </TableRow>
                  ) : (
                    invitations.map((invitation) => {
                      const expiresDate = new Date(invitation.expiresAt)
                      const isExpiringSoon = expiresDate.getTime() - Date.now() < 2 * 24 * 60 * 60 * 1000 // 2 days

                      return (
                        <TableRow key={invitation.id}>
                          <TableCell>
                            <div className="font-medium">{invitation.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={invitation.role === "customer_admin" ? "default" : "outline"}>
                              {invitation.role === "customer_admin" ? (
                                <div className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  <span>Admin</span>
                                </div>
                              ) : (
                                "User"
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {users.find((u) => u.id === invitation.invitedBy)?.firstName || "System"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {isExpiringSoon ? (
                                <AlertCircle className="h-3 w-3 text-destructive" />
                              ) : (
                                <CheckCircle className="h-3 w-3 text-success" />
                              )}
                              <span className={isExpiringSoon ? "text-destructive" : ""}>
                                {expiresDate.toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleResendInvitation(invitation.id)}>
                                Resend
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleCancelInvitation(invitation.id)}>
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  )
}

