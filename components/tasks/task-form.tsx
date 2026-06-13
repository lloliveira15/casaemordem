"use client"

import { useRef } from "react"
import { createQuickTask } from "@/app/app/actions"
import { ROOM_OPTIONS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "phosphor-react"

export function TaskForm({ dueDate }: { dueDate: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    formData.set("due_date", dueDate)
    const result = await createQuickTask(formData)
    if (!result?.error) formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        name="description"
        placeholder="Adicionar tarefa..."
        required
        className="flex-1 px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select
        name="room"
        className="px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {ROOM_OPTIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <Button type="submit" className="rounded-lg">
        <Plus className="size-4 mr-1" />
        Adicionar
      </Button>
    </form>
  )
}
