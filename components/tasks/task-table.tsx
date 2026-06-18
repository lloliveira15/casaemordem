"use client"

import { useState, useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash, ListChecks, CaretUp, CaretDown } from "phosphor-react"
import { cn } from "@/lib/utils"
import { toggleTask, deleteTask } from "@/app/app/actions"

type SortKey = "description" | "room" | "assigned" | "completed"

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

export function TaskTable({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return tasks
    return [...tasks].sort((a, b) => {
      let cmp = 0
      if (sortKey === "description") cmp = a.description.localeCompare(b.description)
      else if (sortKey === "room") cmp = (a.room?.name ?? "").localeCompare(b.room?.name ?? "")
      else if (sortKey === "assigned") cmp = (a.assigned?.profiles.username ?? "").localeCompare(b.assigned?.profiles.username ?? "")
      else if (sortKey === "completed") cmp = Number(a.completed) - Number(b.completed)
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [tasks, sortKey, sortDir])

  function SortArrow({ column }: { column: SortKey }) {
    if (sortKey !== column) return null
    return sortDir === "asc"
      ? <CaretUp className="size-3 inline-block ml-1" weight="bold" />
      : <CaretDown className="size-3 inline-block ml-1" weight="bold" />
  }

  function toggleSelect(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  function selectAll() {
    if (selected.size === sorted.length) setSelected(new Set())
    else setSelected(new Set(sorted.map(t => t.id)))
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
        <p className="text-muted-foreground text-sm mt-1">Clique em &quot;Nova Tarefa&quot; para começar</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
          <Checkbox
            checked={sorted.length > 0 && selected.size === sorted.length}
            onCheckedChange={selectAll}
          />
          Selecionar todas
        </label>

        {selected.size > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleBulkToggle} className="rounded-lg">
              {selected.size > 1 ? `Concluir ${selected.size}` : "Concluir"}
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="rounded-lg">
              Excluir {selected.size}
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead className="w-10">
                <button onClick={() => toggleSort("completed")} className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  OK <SortArrow column="completed" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort("description")} className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Descrição <SortArrow column="description" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort("room")} className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Cômodo <SortArrow column="room" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort("assigned")} className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Responsável <SortArrow column="assigned" />
                </button>
              </TableHead>
              <TableHead className="w-[20px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((task) => (
              <TableRow
                key={task.id}
                className={cn(
                  "transition-colors",
                  task.completed && "bg-muted/30",
                )}
              >
                <TableCell className="py-2">
                  <Checkbox
                    checked={selected.has(task.id)}
                    onCheckedChange={() => toggleSelect(task.id)}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className="py-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggle(task.id)}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className="py-2">
                  <span className={cn(
                    "text-sm",
                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                  )}>
                    {task.description}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  {task.room && (
                    <Badge
                      className="text-white border-0 font-semibold"
                      style={{ backgroundColor: getRoomColor(task.room.name) }}
                    >
                      {task.room.name}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-2">
                  {task.assigned ? (
                    <Badge variant="secondary" className="font-semibold">
                      {task.assigned.profiles.username}
                    </Badge>
                  ) : (!task.assigned && task.assigned_to && !/^[0-9a-f-]{36}$/.test(task.assigned_to)) ? (
                    <Badge variant="secondary" className="font-semibold">
                      {task.assigned_to}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Livre</span>
                  )}
                </TableCell>
                <TableCell className="py-2">
                  <button
                    className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash className="size-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
