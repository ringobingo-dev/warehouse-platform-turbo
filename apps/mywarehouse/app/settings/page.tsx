"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Undo2 } from "lucide-react"

interface BoxTemplate {
  name: string
  width: number
  height: number
  depth: number
  isDefault?: boolean
}

interface RoomConfiguration {
  rows: number
  columns: number
  levels: number
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("default")
  const [boxTemplates, setBoxTemplates] = useState<BoxTemplate[]>([
    { name: "Rectangle Box", width: 1.6, height: 1.2, depth: 1.0, isDefault: true },
    { name: "Square Box", width: 1.2, height: 1.2, depth: 1.2 },
  ])
  const [roomConfig, setRoomConfig] = useState<RoomConfiguration>({
    rows: 10,
    columns: 10,
    levels: 4,
  })

  const themes = [
    { name: "Default", color: "bg-blue-500" },
    { name: "Violet", color: "bg-violet-500" },
    { name: "Green", color: "bg-green-500" },
    { name: "Orange", color: "bg-orange-500" },
    { name: "Red", color: "bg-red-500" },
    { name: "Slate", color: "bg-slate-500" },
  ]

  const handleRoomConfigChange = (field: keyof RoomConfiguration, value: number) => {
    setRoomConfig((prev) => ({
      ...prev,
      [field]: Math.max(1, value),
    }))
  }

  const calculateCapacity = () => {
    return roomConfig.rows * roomConfig.columns * roomConfig.levels
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">Customize your application settings</p>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="room-preview">Room Preview</TabsTrigger>
          <TabsTrigger value="box-dimensions">Configure Box Dimensions</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark mode" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Color Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">Choose a color theme for the application</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.name}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTheme === theme.name.toLowerCase()
                          ? "border-primary"
                          : "border-transparent hover:border-muted"
                      }`}
                      onClick={() => setSelectedTheme(theme.name.toLowerCase())}
                    >
                      <div className={`w-full h-12 rounded-md ${theme.color} mb-2`} />
                      <span className="text-sm font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setSelectedTheme("default")}>
                  <Undo2 className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="room-preview">
          <Card>
            <CardHeader>
              <CardTitle>Dimensions Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Room Configuration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {roomConfig.rows} × {roomConfig.columns} × {roomConfig.levels}
                        </p>
                        <p className="text-sm text-muted-foreground">Rows × Columns × Levels</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Box Capacity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{calculateCapacity()}</p>
                        <p className="text-sm text-muted-foreground">Maximum boxes</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Current Occupancy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">0 / {calculateCapacity()}</p>
                        <p className="text-sm text-muted-foreground">0% full</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Room Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Rows</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRoomConfigChange("rows", roomConfig.rows - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={roomConfig.rows}
                              onChange={(e) => handleRoomConfigChange("rows", Number.parseInt(e.target.value))}
                              className="w-20 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRoomConfigChange("rows", roomConfig.rows + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Columns</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRoomConfigChange("columns", roomConfig.columns - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={roomConfig.columns}
                              onChange={(e) => handleRoomConfigChange("columns", Number.parseInt(e.target.value))}
                              className="w-20 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRoomConfigChange("columns", roomConfig.columns + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Levels</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRoomConfigChange("levels", roomConfig.levels - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={roomConfig.levels}
                              onChange={(e) => handleRoomConfigChange("levels", Number.parseInt(e.target.value))}
                              className="w-20 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRoomConfigChange("levels", roomConfig.levels + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="box-dimensions">
          <Card>
            <CardHeader>
              <CardTitle>Box Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {boxTemplates.map((template, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">{template.name}</h3>
                        {template.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Width</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" value={template.width} step="0.1" className="w-20" readOnly />
                          <span className="text-sm text-muted-foreground">m</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Height</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" value={template.height} step="0.1" className="w-20" readOnly />
                          <span className="text-sm text-muted-foreground">m</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Depth</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" value={template.depth} step="0.1" className="w-20" readOnly />
                          <span className="text-sm text-muted-foreground">m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Account settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notification settings will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

