"use client"

import { useState, useEffect } from "react"
import { useBoxContext } from "@/context/BoxContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CalendarCheck } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Snapshot } from "@/types/Box"

// Key for localStorage
const SCHEDULED_SNAPSHOTS_KEY = "3d-box-viewer-scheduled-snapshots"

interface ScheduledSnapshotSettings {
  enabled: boolean
  roomName: string
  lastRun: string | null
}

export function ScheduledSnapshots() {
  const { boxes, log, saveSnapshot } = useBoxContext()
  const [settings, setSettings] = useState<ScheduledSnapshotSettings>({
    enabled: false,
    roomName: "room",
    lastRun: null,
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SCHEDULED_SNAPSHOTS_KEY)
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SCHEDULED_SNAPSHOTS_KEY, JSON.stringify(settings))
  }, [settings])

  // Check if today is the last day of the month
  const isLastDayOfMonth = () => {
    const today = new Date()
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    return today.getDate() === lastDay
  }

  // Create a snapshot with the specified naming convention
  const createScheduledSnapshot = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()
    const snapshotName = `${settings.roomName}_${month}${year}`

    const newSnapshot: Snapshot = {
      id: Date.now(),
      boxes: [...boxes],
      log: [...log],
      name: snapshotName,
    }

    // Add the snapshot to the snapshots array
    saveSnapshot(newSnapshot)

    // Update the lastRun date
    setSettings((prev) => ({
      ...prev,
      lastRun: now.toISOString(),
    }))

    toast({
      title: "Scheduled Snapshot Created",
      description: `Created snapshot "${snapshotName}" with ${boxes.length} boxes`,
    })

    return newSnapshot
  }

  // Check if a scheduled snapshot should be created
  useEffect(() => {
    if (!settings.enabled) return

    // If it's the last day of the month, create a snapshot
    if (isLastDayOfMonth()) {
      // Check if we've already run today
      const lastRunDate = settings.lastRun ? new Date(settings.lastRun) : null
      const today = new Date()

      if (
        !lastRunDate ||
        lastRunDate.getDate() !== today.getDate() ||
        lastRunDate.getMonth() !== today.getMonth() ||
        lastRunDate.getFullYear() !== today.getFullYear()
      ) {
        createScheduledSnapshot()
      }
    }
  }, [settings.enabled, settings.lastRun, boxes, log, saveSnapshot])

  // For testing purposes - force create a snapshot
  const forceCreateSnapshot = () => {
    createScheduledSnapshot()
  }

  return (
    <Card className="card">
      <CardHeader className="card-header">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Scheduled Snapshots
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-md">
            <div>
              <Label htmlFor="scheduled-snapshots" className="text-base font-medium text-blue-900">
                Enable Monthly Snapshots
              </Label>
              <p className="text-sm text-blue-700 mt-1">
                Automatically create a snapshot on the last day of each month
              </p>
            </div>
            <Switch
              id="scheduled-snapshots"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="room-name" className="text-sm font-medium">
                Room Name Prefix
              </Label>
              <Input
                id="room-name"
                value={settings.roomName}
                onChange={(e) => setSettings((prev) => ({ ...prev, roomName: e.target.value }))}
                placeholder="room"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Snapshots will be named:{" "}
                <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{settings.roomName}_MMYYYY</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Last Scheduled Snapshot</Label>
              <div className="flex items-center h-10 px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                {settings.lastRun ? new Date(settings.lastRun).toLocaleString() : "Never"}
              </div>
              {settings.lastRun && <p className="text-xs text-gray-500 mt-1">Next scheduled: Last day of the month</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={forceCreateSnapshot}
              disabled={!settings.enabled}
              className="flex items-center gap-2"
            >
              <CalendarCheck className="h-4 w-4" />
              Create Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

