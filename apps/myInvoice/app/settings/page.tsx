"use client"

import { useState, useEffect } from "react"
import { useUIStore } from "@/lib/store"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Paintbrush, Moon, Sun, RotateCcw, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { PageContainer } from "@/components/page-container"

// Available color themes
const colorThemes = [
  {
    name: "Default",
    value: "default",
    primaryColor: "hsl(221.2 83.2% 53.3%)",
    primaryForeground: "hsl(210 40% 98%)",
  },
  {
    name: "Violet",
    value: "violet",
    primaryColor: "hsl(262.1 83.3% 57.8%)",
    primaryForeground: "hsl(210 40% 98%)",
  },
  {
    name: "Green",
    value: "green",
    primaryColor: "hsl(142.1 76.2% 36.3%)",
    primaryForeground: "hsl(355.7 100% 97.3%)",
  },
  {
    name: "Orange",
    value: "orange",
    primaryColor: "hsl(24.6 95% 53.1%)",
    primaryForeground: "hsl(60 9.1% 97.8%)",
  },
  {
    name: "Red",
    value: "red",
    primaryColor: "hsl(0 72.2% 50.6%)",
    primaryForeground: "hsl(0 0% 98%)",
  },
  {
    name: "Slate",
    value: "slate",
    primaryColor: "hsl(215.4 16.3% 46.9%)",
    primaryForeground: "hsl(210 40% 98%)",
  },
]

export default function SettingsPage() {
  const { theme, setTheme, colorTheme, setColorTheme } = useUIStore()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Load saved color theme from localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle color theme change
  const handleColorThemeChange = (value: string) => {
    setColorTheme(value)

    toast({
      title: "Theme updated",
      description: "Your color theme has been updated successfully.",
    })
  }

  // Handle theme mode change (light/dark)
  const handleThemeModeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")

    toast({
      title: "Theme mode updated",
      description: `Theme mode set to ${checked ? "dark" : "light"}.`,
    })
  }

  // Reset all theme settings
  const resetThemeSettings = () => {
    setTheme("system")
    setColorTheme("default")

    toast({
      title: "Theme reset",
      description: "All theme settings have been reset to default.",
    })
  }

  // Avoid hydration mismatch
  if (!mounted) return null

  return (
    <div className="flex flex-col">
      <PageHeader title="Settings" description="Customize your application settings" />
      <PageContainer>
        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account" disabled>
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" disabled>
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="h-5 w-5" />
                  Theme Customization
                </CardTitle>
                <CardDescription>Customize the appearance of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Light/Dark Mode Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-mode" className="text-base">
                      Dark Mode
                    </Label>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch id="theme-mode" checked={theme === "dark"} onCheckedChange={handleThemeModeChange} />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>

                {/* Color Theme Selection */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Color Theme</Label>
                    <p className="text-sm text-muted-foreground mt-1">Choose a color theme for the application</p>
                  </div>

                  <RadioGroup
                    value={colorTheme}
                    onValueChange={handleColorThemeChange}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6"
                  >
                    {colorThemes.map((theme) => (
                      <div key={theme.value} className="relative">
                        <RadioGroupItem value={theme.value} id={`theme-${theme.value}`} className="sr-only" />
                        <Label
                          htmlFor={`theme-${theme.value}`}
                          className={cn(
                            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                            colorTheme === theme.value && "border-primary",
                          )}
                        >
                          <div
                            className="h-10 w-10 rounded-full mb-3"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <div className="text-center">
                            <span className="text-sm font-medium">{theme.name}</span>
                          </div>
                          {colorTheme === theme.value && (
                            <div className="absolute top-2 right-2 h-5 w-5 text-primary">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Reset Button */}
                <div className="pt-4 flex justify-end">
                  <Button variant="outline" onClick={resetThemeSettings} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Preview</CardTitle>
                <CardDescription>See how your selected theme looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button>Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded-full bg-primary" />
                      <div className="h-4 w-full rounded-full bg-secondary" />
                      <div className="h-4 w-full rounded-full bg-accent" />
                      <div className="h-4 w-full rounded-full bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded-full bg-destructive" />
                      <div className="h-4 w-full rounded-full bg-success" />
                      <div className="h-4 w-full rounded-full bg-warning" />
                      <div className="h-4 w-full rounded-full bg-info" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  )
}

