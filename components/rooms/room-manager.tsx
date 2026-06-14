"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRoom, renameRoom, deleteRoom } from "@/lib/actions/rooms"
import { Button } from "@/components/ui/button"
import { Plus, PencilSimple, Trash } from "phosphor-react"

interface Room {
  id: string
  name: string
  sort_order: number
}

export function RoomManager({ rooms, householdId }: { rooms: Room[]; householdId: string }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  async function handleCreate(formData: FormData) {
    await createRoom(formData)
    router.refresh()
  }

  async function handleRename(roomId: string) {
    if (!editName.trim()) return
    await renameRoom(roomId, editName.trim())
    setEditingId(null)
    router.refresh()
  }

  async function handleDelete(roomId: string, name: string) {
    if (!confirm(`Excluir "${name}"? As tarefas deste cômodo ficarão sem cômodo associado.`)) return
    await deleteRoom(roomId)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <form action={handleCreate} className="flex gap-2">
        <input
          name="name"
          placeholder="Novo cômodo..."
          required
          className="flex-1 px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" className="rounded-lg">
          <Plus className="size-4 mr-1" />
          Adicionar
        </Button>
      </form>

      {rooms.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhum cômodo cadastrado. Crie o primeiro!
        </p>
      )}

      <div className="space-y-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] hover:border-primary/30 transition-all"
          >
            {editingId === room.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleRename(room.id); if (e.key === "Escape") setEditingId(null) }}
                />
                <Button size="sm" onClick={() => handleRename(room.id)} className="rounded-lg">Salvar</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="rounded-lg">Cancelar</Button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push(`/app/comodos/${room.id}`)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-semibold text-foreground">{room.name}</p>
                  <p className="text-xs text-muted-foreground">Clique para ver tarefas</p>
                </button>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => { setEditingId(room.id); setEditName(room.name) }}
                    className="size-8 text-muted-foreground hover:text-primary"
                  >
                    <PencilSimple className="size-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => handleDelete(room.id, room.name)}
                    className="size-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
