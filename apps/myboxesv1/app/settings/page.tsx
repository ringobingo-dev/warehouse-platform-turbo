"use client"

import { useState } from "react"
import { Moon, Sun, Palette, RotateCcw, Box, Layers, Grid3x3Icon as Grid3, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBoxContext } from "@/context/BoxContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// RoomDimensionsConfig import removed
import { BoxTemplateConfig } from "@/components/box-template-config" // Add this import

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("default")
  // Add this to access the box context data
  const { rows, columns, levels, boxes, getRoomCapacity } = useBoxContext()

  // Room preview customization settings
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f4")
  const [backgroundType, setBackgroundType] = useState("color")
  const [environmentPreset, setEnvironmentPreset] = useState("warehouse")
  const [floorColor, setFloorColor] = useState("#F5F5DC")
  const [wallColor, setWallColor] = useState("#F5F5F5")
  const [gridColor, setGridColor] = useState("rgba(0, 0, 255, 0.5)")
  const [showGrid, setShowGrid] = useState(true)
  const [lightIntensity, setLightIntensity] = useState(0.5)

  const themes = [
    { name: "Default", color: "#4361ee", cssVar: "--primary: 221.2 83.2% 53.3%" },
    { name: "Violet", color: "#7c3aed", cssVar: "--primary: 265 84% 58%" },
    { name: "Green", color: "#2f9e44", cssVar: "--primary: 142 69% 40%" },
    { name: "Orange", color: "#ea580c", cssVar: "--primary: 24 94% 48%" },
    { name: "Red", color: "#dc2626", cssVar: "--primary: 0 74% 51%" },
    { name: "Slate", color: "#64748b", cssVar: "--primary: 217 19% 47%" },
  ]

  const environmentPresets = [
    { name: "Warehouse", value: "warehouse" },
    { name: "Studio", value: "studio" },
    { name: "City", value: "city" },
    { name: "Apartment", value: "apartment" },
    { name: "Forest", value: "forest" },
    { name: "Sunset", value: "sunset" },
    { name: "Dawn", value: "dawn" },
    { name: "Night", value: "night" },
    { name: "Park", value: "park" },
    { name: "Lobby", value: "lobby" },
  ]

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-lg text-muted-foreground">Customize your application settings</p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        {/* In the TabsList component, modify the array of tabs to include "Configure Box Dimensions" */}
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
          <TabsTrigger
            value="appearance"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="room-preview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Room Preview
          </TabsTrigger>
          <TabsTrigger
            value="configure-box-dimensions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Configure Box Dimensions
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-6">
          <div className="max-w-3xl mx-auto">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Theme Customization</h2>
              </div>
              <p className="text-muted-foreground mb-6">Customize the appearance of the application</p>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Dark Mode</h3>
                    <p className="text-muted-foreground">Switch between light and dark mode</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                ${isDarkMode ? "bg-primary" : "bg-gray-200"}
                transition-colors focus:outline-none
              `}
                    >
                      <span
                        className={`
                  inline-block h-5 w-5 transform rounded-full bg-white shadow
                  transition-transform
                  ${isDarkMode ? "translate-x-6" : "translate-x-1"}
                `}
                      />
                    </button>
                    <Moon className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-1">Color Theme</h3>
                  <p className="text-muted-foreground mb-4">Choose a color theme for the application</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme.name.toLowerCase())}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors hover:bg-accent ${
                          selectedTheme === theme.name.toLowerCase() ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full" style={{ backgroundColor: theme.color }} />
                        <span className="text-sm font-medium">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset to Default
                </Button>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="room-preview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    <CardTitle>Room Visualization Settings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Background Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Background Settings
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="background-type">Background Type</Label>
                        <Select value={backgroundType} onValueChange={setBackgroundType}>
                          <SelectTrigger id="background-type">
                            <SelectValue placeholder="Select background type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="color">Solid Color</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="skybox">Skybox</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {backgroundType === "color" && (
                        <div className="space-y-2">
                          <Label htmlFor="background-color">Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="background-color"
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-12 h-9 p-1"
                            />
                            <Input
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      )}

                      {backgroundType === "environment" && (
                        <div className="space-y-2">
                          <Label htmlFor="environment-preset">Environment Preset</Label>
                          <Select value={environmentPreset} onValueChange={setEnvironmentPreset}>
                            <SelectTrigger id="environment-preset">
                              <SelectValue placeholder="Select environment" />
                            </SelectTrigger>
                            <SelectContent>
                              {environmentPresets.map((preset) => (
                                <SelectItem key={preset.value} value={preset.value}>
                                  {preset.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floor Settings */}
                  <div className="space-y-4 pt-2 border-t">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Grid3 className="h-4 w-4" />
                      Floor Settings
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="floor-color">Floor Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="floor-color"
                            type="color"
                            value={floorColor}
                            onChange={(e) => setFloorColor(e.target.value)}
                            className="w-12 h-9 p-1"
                          />
                          <Input
                            type="text"
                            value={floorColor}
                            onChange={(e) => setFloorColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-grid">Show Grid</Label>
                          <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full
                              ${showGrid ? "bg-primary" : "bg-gray-200"}
                              transition-colors focus:outline-none
                            `}
                          >
                            <span
                              className={`
                                inline-block h-5 w-5 transform rounded-full bg-white shadow
                                transition-transform
                                ${showGrid ? "translate-x-6" : "translate-x-1"}
                              `}
                            />
                          </button>
                        </div>

                        {showGrid && (
                          <div className="flex gap-2 mt-2">
                            <Input
                              id="grid-color"
                              type="color"
                              value={gridColor}
                              onChange={(e) => setGridColor(e.target.value)}
                              className="w-12 h-9 p-1"
                            />
                            <Input
                              type="text"
                              value={gridColor}
                              onChange={(e) => setGridColor(e.target.value)}
                              placeholder="Grid Color"
                              className="flex-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Wall Settings */}
                  <div className="space-y-4 pt-2 border-t">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Box className="h-4 w-4" />
                      Wall Settings
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="wall-color">Wall Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="wall-color"
                          type="color"
                          value={wallColor}
                          onChange={(e) => setWallColor(e.target.value)}
                          className="w-12 h-9 p-1"
                        />
                        <Input
                          type="text"
                          value={wallColor}
                          onChange={(e) => setWallColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lighting Settings */}
                  <div className="space-y-4 pt-2 border-t">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Lighting Settings
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="light-intensity">Light Intensity</Label>
                        <span className="text-sm">{lightIntensity.toFixed(1)}</span>
                      </div>
                      <Slider
                        id="light-intensity"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[lightIntensity]}
                        onValueChange={(value) => setLightIntensity(value[0])}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button variant="outline" className="gap-2 mr-2">
                      <RotateCcw className="h-4 w-4" />
                      Reset to Default
                    </Button>
                    <Button>Apply Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md border flex items-center justify-center">
                    <div className="text-center p-4">
                      <div
                        className="w-32 h-32 mx-auto mb-4 rounded-md"
                        style={{
                          backgroundColor: backgroundType === "color" ? backgroundColor : "#f5f5f4",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Floor representation */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "40%",
                            backgroundColor: floorColor,
                            backgroundImage: showGrid
                              ? `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`
                              : "none",
                            backgroundSize: "10px 10px",
                          }}
                        ></div>

                        {/* Wall representation */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "40%",
                            height: "60%",
                            backgroundColor: wallColor,
                          }}
                        ></div>

                        {/* Box representation */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "40%",
                            right: "20%",
                            width: "30%",
                            height: "30%",
                            backgroundColor: "#e5d3b3",
                            boxShadow: `0 0 10px rgba(0,0,0,${lightIntensity * 0.5})`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This is a simplified preview. Changes will be applied to the 3D view.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Background: {backgroundType === "environment" ? environmentPreset : backgroundColor}
                        <br />
                        Floor: {floorColor} • Walls: {wallColor} • Grid: {showGrid ? "Visible" : "Hidden"}
                        <br />
                        Light Intensity: {lightIntensity.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Current Room Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-md">
                        <h3 className="text-sm font-medium mb-1">Rows</h3>
                        <p className="text-2xl font-semibold">{rows}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-md">
                        <h3 className="text-sm font-medium mb-1">Columns</h3>
                        <p className="text-2xl font-semibold">{columns}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-md">
                        <h3 className="text-sm font-medium mb-1">Levels</h3>
                        <p className="text-2xl font-semibold">{levels}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-md">
                        <h3 className="text-sm font-medium mb-1">Total Capacity</h3>
                        <p className="text-2xl font-semibold">{getRoomCapacity()}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-md">
                        <h3 className="text-sm font-medium mb-1">Current Boxes</h3>
                        <p className="text-2xl font-semibold">{boxes.length}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                              Room Utilization
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full">
                              {Math.round((boxes.length / getRoomCapacity()) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                          <div
                            style={{ width: `${Math.round((boxes.length / getRoomCapacity()) * 100)}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </TabsContent>

        {/* Add the new TabsContent for "configure-box-dimensions" between "room-preview" and "account" */}
        {/* Add this after the closing </TabsContent> of the "room-preview" section and before the "account" section */}
        <TabsContent value="configure-box-dimensions" className="mt-6">
          <div className="w-full max-h-[calc(100vh-200px)] overflow-auto">
            <BoxTemplateConfig className="w-full" />
          </div>
        </TabsContent>

        <TabsContent value="account">
          <p className="text-muted-foreground">Account settings coming soon...</p>
        </TabsContent>

        <TabsContent value="notifications">
          <p className="text-muted-foreground">Notification settings coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

