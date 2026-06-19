"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createEvent } from "@/lib/actions/events"
import { Button } from "@/components/ui/button"
import { Plus, CalendarBlank } from "phosphor-react"

export function AddCompromisso() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const now = new Date()
  const todayDate = now.toISOString().split("T")[0]
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const result = await createEvent(formData)
    if (!result?.error) {
      form.reset()
      setOpen(false)
      router.refresh()
    }
  }

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="rounded-lg border-border bg-white hover:bg-primary/[0.04] hover:text-primary">
        <Plus className="size-4 mr-1" />
        Adicionar compromisso
      </Button>
    )
  }

  return (
    <div className="p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <CalendarBlank className="size-4" />
        Novo compromisso
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Descrição</label>
          <input name="description" required placeholder="Ex: Consulta pediatra" className={`${inputClass} w-full`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Data</label>
            <input name="event_date" type="date" defaultValue={todayDate} required className={`${inputClass} w-full`} />
          </div>
          <div className="min-w-[100px]">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Hora</label>
            <input name="event_time" type="time" defaultValue={currentTime} required className={`${inputClass} w-full`} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-0.5">Local</label>
          <input name="location" placeholder="Ex: Hospital São Lucas, Rua X" className={`${inputClass} w-full`} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="rounded-lg">
            <Plus className="size-4 mr-1" />
            Adicionar
          </Button>
          <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="text-muted-foreground">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
