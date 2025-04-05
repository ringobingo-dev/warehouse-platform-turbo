"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/ui/table"
import { Button } from "@/components/shared/ui/button"
import { Badge } from "@/components/shared/ui/badge"
import { MoreHorizontal, UserPlus } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
}

interface UserListProps {
  users: User[]
  onAddUser: () => void
  onEditUser: (userId: string) => void
}

export function UserList({ users, onAddUser, onEditUser }: UserListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button onClick={onAddUser} className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of users in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "active" ? "success" : user.status === "inactive" ? "destructive" : "outline"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onEditUser(user.id)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

