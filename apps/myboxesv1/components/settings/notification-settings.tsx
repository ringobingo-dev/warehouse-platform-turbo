"use client"
import { useState } from "react"
import { Label } from "@/components/shared/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { BellIcon, BellOffIcon, MailIcon, MessageSquareIcon, PhoneIcon } from "lucide-react"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BellIcon className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Configure how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-start gap-3">
            <MailIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your account activity via email
              </p>
            </div>
          </div>
          <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-start gap-3">
            <BellIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-base">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your mobile device</p>
            </div>
          </div>
          <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-start gap-3">
            <PhoneIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications" className="text-base">
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
            </div>
          </div>
          <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
        </div>

        {/* In-App Notifications */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-start gap-3">
            <MessageSquareIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="in-app-notifications" className="text-base">
                In-App Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
            </div>
          </div>
          <Switch id="in-app-notifications" checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
        </div>

        {/* Marketing Emails */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-start gap-3">
            <BellOffIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails" className="text-base">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">Receive emails about new features, tips, and promotions</p>
            </div>
          </div>
          <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}

