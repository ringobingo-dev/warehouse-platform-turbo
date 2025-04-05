"use client"
import { useState } from "react"
import { Checkbox } from "@/components/shared/ui/checkbox"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Badge } from "@/components/shared/ui/badge"
import { PlusIcon, TrashIcon } from "lucide-react"

type Task = {
  id: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review project requirements",
      completed: true,
      priority: "high",
    },
    {
      id: "2",
      title: "Create wireframes for new feature",
      completed: false,
      priority: "medium",
    },
    {
      id: "3",
      title: "Update documentation",
      completed: false,
      priority: "low",
    },
    {
      id: "4",
      title: "Schedule team meeting",
      completed: false,
      priority: "medium",
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Math.random().toString(36).substring(2, 9),
        title: newTaskTitle.trim(),
        completed: false,
        priority: "medium",
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <Button size="sm" onClick={addTask}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 border rounded-md ${
                  task.completed ? "bg-muted/50" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                  <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <TrashIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            {tasks.filter((task) => task.completed).length} of {tasks.length} tasks completed
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

