"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toggleTask, deleteTask } from "@/app/app/actions"

interface Task {
  id: string
  description: string
  room: string | null
  assigned_to: string | null
  completed: boolean
  completed_by: string | null
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggleSelect(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  function selectAll() {
    if (selected.size === tasks.length) setSelected(new Set())
    else setSelected(new Set(tasks.map(t => t.id)))
  }

  async function handleBulkToggle() {
    for (const id of selected) await toggleTask(id)
    setSelected(new Set())
  }

  async function handleBulkDelete() {
    for (const id of selected) await deleteTask(id)
    setSelected(new Set())
  }

  async function handleToggle(taskId: string) {
    await toggleTask(taskId)
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId)
  }

  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Nenhuma tarefa para esta data.</p>
  }

  return (
    <div className="space-y-2">
      {selected.size > 0 && (
        <div className="flex gap-2 pb-2">
          <Button size="sm" variant="secondary" onClick={handleBulkToggle}>
            {selected.size > 1 ? `Concluir ${selected.size}` : "Concluir"}
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
            Excluir {selected.size}
          </Button>
          <span className="text-xs text-muted-foreground self-center ml-2">
            {selected.size} selecionada(s)
          </span>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm cursor-pointer pb-1">
        <Checkbox
          checked={tasks.length > 0 && selected.size === tasks.length}
          onCheckedChange={selectAll}
        />
        Selecionar todas
      </label>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <Checkbox
            checked={selected.has(task.id)}
            onCheckedChange={() => toggleSelect(task.id)}
          />
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => handleToggle(task.id)}
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
          <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(task.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
