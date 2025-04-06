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

type UserRole = "customer_admin" | "customer_user"

export default function CustomerUsersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [invitations, setInvitations] = useState<UserInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<UserRole>("customer_user")

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
    if (!customer) return

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

      // Invite the user
      const invitation = await inviteUserToCustomer(
        newUserEmail,
        newUserRole,
        customer.id,
        "system" // Since we removed auth, use a system user
      )

      if (invitation) {
        setInvitations([...invitations, invitation])
        setNewUserEmail("")
        setNewUserRole("customer_user")
        setInviteDialogOpen(false)
        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${newUserEmail}`,
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
    try {
      // In a real implementation, this would call an API to resend the invitation
      toast({
        title: "Invitation resent",
        description: "The invitation has been resent to the user",
      })
    } catch (error) {
      console.error("Error resending invitation:", error)
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      })
    }
  }

  // Handle canceling an invitation
  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // In a real implementation, this would call an API to cancel the invitation
      setInvitations(invitations.filter((inv) => inv.id !== invitationId))
      toast({
        title: "Invitation canceled",
        description: "The invitation has been canceled",
      })
    } catch (error) {
      console.error("Error canceling invitation:", error)
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading customer data...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-lg font-medium">Customer not found</p>
          <Button variant="outline" onClick={() => router.push("/customers")}>
            Back to Customers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Customer Users"
        description={`Manage users for ${customer.name}`}
        actions={
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
                <DialogDescription>
                  Invite a new user to access this customer's data.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUserRole} 
                    onValueChange={(value: UserRole) => setNewUserRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer_admin">Customer Admin</SelectItem>
                      <SelectItem value="customer_user">Customer User</SelectItem>
                    </SelectContent>
                  </Select>
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
        }
      />
      <PageContainer>
        <div className="grid gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Users with access to this customer's data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "customer_admin" ? "default" : "secondary"}>
                          {user.role === "customer_admin" ? "Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Users who have been invited but haven't accepted yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invited By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {invitation.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={invitation.role === "customer_admin" ? "default" : "secondary"}>
                          {invitation.role === "customer_admin" ? "Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>System</TableCell>
                      <TableCell>
                        <Badge variant={invitation.status === "pending" ? "default" : "secondary"}>
                          {invitation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                              Resend Invitation
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancelInvitation(invitation.id)}>
                              Cancel Invitation
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  )
}

