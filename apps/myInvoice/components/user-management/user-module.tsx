"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  User,
  UserPlus,
  MoreHorizontal,
  Shield,
  Mail,
  AlertCircle,
  CheckCircle,
  Search,
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react"
import { useWorkOS } from "@/components/auth/workos-provider"
import {
  createInvitation,
  getUsersByCustomerId,
  getPendingInvitationsByCustomerId,
  updateInvitationStatus,
  updateUser,
  deleteUser,
} from "@/lib/services/user-service"
import type { User as UserType, UserInvitation } from "@/lib/types/user"
import type { Customer } from "@/lib/types/customer"

interface UserModuleProps {
  customer: Customer
  onUserChange?: () => void
}

export function UserModule({ customer, onUserChange }: UserModuleProps) {
  const { user: currentUser } = useWorkOS()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserType[]>([])
  const [invitations, setInvitations] = useState<UserInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"customer_admin" | "customer_user">("customer_user")
  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    status: "",
  })

  // Fetch users and invitations
  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch users
      const fetchedUsers = await getUsersByCustomerId(customer.id)
      setUsers(fetchedUsers)

      // Fetch pending invitations
      const pendingInvites = await getPendingInvitationsByCustomerId(customer.id)
      setInvitations(pendingInvites)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load users and invitations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [customer.id])

  // Filter users and invitations based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredInvitations = invitations.filter((invitation) =>
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle inviting a new user
  const handleInviteUser = async () => {
    if (!currentUser) return

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
      const invitation = await createInvitation({
        email: newUserEmail,
        role: newUserRole,
        customerId: customer.id,
        invitedBy: currentUser.id,
      })

      if (invitation) {
        setInvitations([...invitations, invitation])
        setInviteDialogOpen(false)
        setNewUserEmail("")

        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${newUserEmail}`,
        })

        if (onUserChange) {
          onUserChange()
        }
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
    try {
      // In a real app, this would call an API to resend the invitation
      // For now, we'll just show a success message
      toast({
        title: "Invitation resent",
        description: "The invitation has been resent",
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
  const handleCancelInvitation = async (invitationId: string, token: string) => {
    try {
      await updateInvitationStatus(token, "canceled")
      setInvitations(invitations.filter((inv) => inv.id !== invitationId))

      toast({
        title: "Invitation canceled",
        description: "The invitation has been canceled",
      })

      if (onUserChange) {
        onUserChange()
      }
    } catch (error) {
      console.error("Error canceling invitation:", error)
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      })
    }
  }

  // Handle editing a user
  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setEditUserData({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    })
    setEditUserDialogOpen(true)
  }

  // Handle saving user edits
  const handleSaveUserEdits = async () => {
    if (!selectedUser) return

    try {
      const updatedUser = await updateUser(selectedUser.id, {
        firstName: editUserData.firstName,
        lastName: editUserData.lastName,
        role: editUserData.role,
        status: editUserData.status,
      })

      if (updatedUser) {
        setUsers(users.map((u) => (u.id === selectedUser.id ? updatedUser : u)))
        setEditUserDialogOpen(false)

        toast({
          title: "User updated",
          description: "The user has been updated successfully",
        })

        if (onUserChange) {
          onUserChange()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    try {
      const success = await deleteUser(userId)

      if (success) {
        setUsers(users.filter((u) => u.id !== userId))

        toast({
          title: "User deleted",
          description: "The user has been deleted successfully",
        })

        if (onUserChange) {
          onUserChange()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const canInviteUsers =
    customer.status === "approved" &&
    (currentUser?.role === "admin" ||
      (currentUser?.role === "customer_admin" && currentUser?.customerId === customer.id))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {customer.status !== "approved" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
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

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full rounded-md pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {canInviteUsers && (
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
          )}
        </div>
      </div>

      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No active users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
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
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
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
              {filteredInvitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No pending invitations
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvitations.map((invitation) => {
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
                      <TableCell>{users.find((u) => u.id === invitation.invitedBy)?.firstName || "System"}</TableCell>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id, invitation.token)}
                          >
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

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={editUserData.firstName}
                onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={editUserData.lastName}
                onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editUserData.role}
                onValueChange={(value) => setEditUserData({ ...editUserData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_admin">Customer Admin</SelectItem>
                  <SelectItem value="customer_user">Customer User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editUserData.status}
                onValueChange={(value) => setEditUserData({ ...editUserData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserEdits}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

