"use client"

import { useRef } from "react"
import { createQuickTask } from "@/app/app/actions"
import { ROOM_OPTIONS } from "@/lib/utils"

export function TaskForm({ dueDate }: { dueDate: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    formData.set("due_date", dueDate)
    const result = await createQuickTask(formData)
    if (!result?.error) formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2">
      <input
        name="description"
        placeholder="Adicionar tarefa..."
        required
        className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
      />
      <select
        name="room"
        className="px-3 py-2 border rounded-md bg-background text-sm"
      >
        {ROOM_OPTIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
      >
        Adicionar
      </button>
    </form>
  )
}
