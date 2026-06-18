"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createQuickTask, toggleTask, deleteTask } from "@/app/app/actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "phosphor-react"
import { cn } from "@/lib/utils"

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

interface QuickTaskDialogProps {
  rooms: { id: string; name: string }[]
  members: { id: string; username: string }[]
  currentDate: string
}

export function QuickTaskDialog({ rooms, members, currentDate }: QuickTaskDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [roomId, setRoomId] = useState("")
  const [assignedToId, setAssignedToId] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    const fd = new FormData()
    fd.set("description", description.trim())
    fd.set("room_id", roomId)
    fd.set("assigned_to_id", assignedToId)
    fd.set("due_date", currentDate)
    await createQuickTask(fd)
    setDescription("")
    setRoomId("")
    setAssignedToId("")
    setOpen(false)
    router.refresh()
  }

  function handleOpen() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const selectClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"

  return (
    <>
      <Button onClick={handleOpen} className="rounded-lg">
        <Plus className="size-4 mr-1" />
        Nova Tarefa
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 space-y-4"
            >
              <h3 className="text-sm font-bold text-foreground">Nova Tarefa</h3>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Descrição</label>
                <input
                  ref={inputRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que precisa ser feito?"
                  className="px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Cômodo</label>
                  <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className={selectClass}>
                    <option value="">Nenhum</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Responsável</label>
                  <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className={selectClass}>
                    <option value="">Livre</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.username}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-lg">
                  Cancelar
                </Button>
                <Button type="submit" disabled={!description.trim()} className="rounded-lg">
                  Adicionar
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  )
}
