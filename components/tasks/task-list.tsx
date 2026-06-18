"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash, ListChecks } from "phosphor-react"
import { cn } from "@/lib/utils"
import { toggleTask, deleteTask } from "@/app/app/actions"

interface Task {
  id: string
  description: string
  room: { name: string } | null
  room_id: string | null
  assigned_to: string | null
  assigned_to_id: string | null
  completed: boolean
  completed_by: string | null
  assigned: { user_id: string; profiles: { username: string } } | null
}

const ROOM_COLORS: Record<string, string> = {
  Cozinha: "#F97316",
  Sala: "#8B5CF6",
  Quarto: "#3B82F6",
  Banheiro: "#06B6D4",
  "Área de Serviço": "#10B981",
  Jardim: "#84CC16",
  Garagem: "#6B7280",
  Escritório: "#6B7280",
  Corredor: "#EC4899",
  Varanda: "#84CC16",
  Geral: "#7C3AED",
}

function getRoomColor(name: string): string {
  return ROOM_COLORS[name] || "#7C3AED"
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
    return (
      <div className="text-center py-16 px-4">
        <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <ListChecks className="size-8 text-primary" />
        </div>
        <p className="text-foreground font-medium">Nenhuma tarefa ainda</p>
        <p className="text-muted-foreground text-sm mt-1">Clique em "Nova Tarefa" para começar</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {selected.size > 0 && (
        <div className="flex gap-2 pb-2">
          <Button size="sm" variant="secondary" onClick={handleBulkToggle} className="rounded-lg">
            {selected.size > 1 ? `Concluir ${selected.size}` : "Concluir"}
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="rounded-lg">
            Excluir {selected.size}
          </Button>
          <span className="text-xs text-muted-foreground self-center ml-2">
            {selected.size} selecionada(s)
          </span>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm cursor-pointer pb-1 text-muted-foreground hover:text-foreground transition-colors">
        <Checkbox
          checked={tasks.length > 0 && selected.size === tasks.length}
          onCheckedChange={selectAll}
        />
        Selecionar todas
      </label>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-[var(--shadow-sm)] transition-all duration-150"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => handleToggle(task.id)}
            className="cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm transition-all",
              task.completed ? "line-through text-muted-foreground" : "text-foreground"
            )}>
              {task.description}
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs mt-0.5">
              {task.room && (
                <span className="px-2 py-0.5 rounded-full text-white font-semibold" style={{ backgroundColor: getRoomColor(task.room.name) }}>
                  {task.room.name}
                </span>
              )}
              {task.assigned && (
                <span className="px-2 py-0.5 rounded-full bg-secondary text-primary font-semibold">
                  {task.assigned.profiles.username}
                </span>
              )}
              {/* Only display assigned_to if it's a name (not a UUID from legacy data) */}
              {!task.assigned && task.assigned_to && !/^[0-9a-f-]{36}$/.test(task.assigned_to) && (
                <span className="px-2 py-0.5 rounded-full bg-secondary text-primary font-semibold">
                  {task.assigned_to}
                </span>
              )}
            </div>
          </div>
          <button
            className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
            onClick={() => handleDelete(task.id)}
          >
            <Trash className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
