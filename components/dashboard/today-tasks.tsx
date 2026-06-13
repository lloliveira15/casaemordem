"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash } from "phosphor-react"
import { toggleTask, deleteTask } from "@/app/app/actions"

interface Task {
  id: string
  description: string
  room: string | null
  assigned_to: string | null
  completed: boolean
}

export function TodayTasks({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-sm">Nenhuma tarefa para hoje!</p>
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 border rounded-lg"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.description}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {task.room && <span>{task.room}</span>}
              {task.assigned_to && <span>— {task.assigned_to}</span>}
            </div>
          </div>
          <form action={async () => { await deleteTask(task.id) }}>
            <Button variant="ghost" size="icon" className="size-8" type="submit">
              <Trash className="size-4" />
            </Button>
          </form>
        </div>
      ))}
    </div>
  )
}
