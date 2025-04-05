"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { acceptInvitation } from "@/lib/services/customer-user-service"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AcceptInvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [validToken, setValidToken] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")
    setToken(token)

    // In a real app, we would validate the token here
    // For demo purposes, we'll assume it's valid if it exists
    if (token) {
      setValidToken(true)
    }

    setLoading(false)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) return

    // Validate form
    if (!firstName || !lastName || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Accept the invitation
      const user = await acceptInvitation(token, {
        firstName,
        lastName,
        password,
      })

      if (user) {
        setCompleted(true)

        // In a real app, we might automatically sign in the user here

        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        toast({
          title: "Error",
          description: "Failed to accept invitation. The token may be invalid or expired.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error accepting invitation:", error)
      toast({
        title: "Error",
        description: "An error occurred while accepting the invitation",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!token || !validToken) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">The invitation link is invalid or has expired</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <p className="text-center text-muted-foreground">
              Please contact the person who invited you to request a new invitation.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/auth/login")}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome Aboard!</CardTitle>
            <CardDescription className="text-center">Your account has been successfully created</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-success mb-4" />
            <p className="text-center">You will be redirected to the login page in a few seconds...</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/auth/login")}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Accept Invitation</CardTitle>
          <CardDescription className="text-center">
            Complete your account setup to join the Warehouse Platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

