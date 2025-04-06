"use client"
import { useState } from "react"
import { Checkbox } from "@/components/shared/ui/checkbox"
import { Label } from "@/components/shared/ui/label"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { ShieldIcon } from "lucide-react"

export function PrivacySettings() {
  const [allowDataCollection, setAllowDataCollection] = useState(true)
  const [allowCookies, setAllowCookies] = useState(true)
  const [allowLocationTracking, setAllowLocationTracking] = useState(false)
  const [allowPersonalizedAds, setAllowPersonalizedAds] = useState(false)
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
          <ShieldIcon className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>Control how your data is collected and used</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox id="data-collection" checked={allowDataCollection} onCheckedChange={setAllowDataCollection} />
            <div className="grid gap-1.5">
              <Label
                htmlFor="data-collection"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow Data Collection
              </Label>
              <p className="text-sm text-muted-foreground">We collect anonymous usage data to improve our services</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="cookies" checked={allowCookies} onCheckedChange={setAllowCookies} />
            <div className="grid gap-1.5">
              <Label
                htmlFor="cookies"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow Cookies
              </Label>
              <p className="text-sm text-muted-foreground">Cookies help us provide, protect and improve our services</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="location" checked={allowLocationTracking} onCheckedChange={setAllowLocationTracking} />
            <div className="grid gap-1.5">
              <Label
                htmlFor="location"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow Location Tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                We use your location to provide relevant local information
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="personalized-ads" checked={allowPersonalizedAds} onCheckedChange={setAllowPersonalizedAds} />
            <div className="grid gap-1.5">
              <Label
                htmlFor="personalized-ads"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow Personalized Ads
              </Label>
              <p className="text-sm text-muted-foreground">We use your data to show you relevant ads</p>
            </div>
          </div>
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

