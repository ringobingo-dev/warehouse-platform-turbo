"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface UserInviteModuleProps {
  onInvite: (userData: UserData) => void
}

interface UserData {
  email: string
  role: string
  firstName: string
}

const userRoles = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "viewer", label: "Viewer" },
]

export function UserInviteModule({ onInvite }: UserInviteModuleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    email: "",
    role: "",
    firstName: "",
  })

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInvite = async () => {
    if (!userData.email || !userData.role || !userData.firstName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate API call to create user in dev-Users table
      const newUser = {
        ...userData,
        status: "pending",
        invitedBy: "current-user-id", // Replace with actual user ID of the inviting user
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate WorkOS authentication request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onInvite(newUser)
      setIsOpen(false)
      setUserData({ email: "", role: "", firstName: "" })
      toast({
        title: "Success",
        description: `User invited successfully. An email has been sent to ${newUser.email} with further instructions.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invite user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={userData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              value={userData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleInvite} className="w-full">
          Send Invite and Create Association
        </Button>
      </DialogContent>
    </Dialog>
  )
}

