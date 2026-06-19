"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { removeEvent, updateEvent } from "@/lib/actions/events"
import { Button } from "@/components/ui/button"
import { Trash, MapPin, Clock, PencilSimple } from "phosphor-react"

interface CompromissoData {
  id: string
  description: string
  event_date_time: string
  location: string | null
  created_by_name: string
}

export function CompromissoCard({ compromisso }: { compromisso: CompromissoData }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)

  const date = new Date(compromisso.event_date_time)
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"

  async function handleRemove() {
    if (confirm(`Remover "${compromisso.description}"?`)) {
      await removeEvent(compromisso.id)
      router.refresh()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    formData.set("id", compromisso.id)
    const eventDate = formData.get("event_date") as string
    const eventTime = formData.get("event_time") as string
    const localDate = new Date(`${eventDate}T${eventTime}:00`)
    formData.set("event_date_time", localDate.toISOString())
    formData.delete("event_date")
    formData.delete("event_time")
    const result = await updateEvent(formData)
    if (!result?.error) {
      setEditing(false)
      router.refresh()
    }
  }

  if (editing) {
    const origDate = date.toISOString().split("T")[0]
    const origTime = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false })

    return (
      <div className="p-4 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)]">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="description" defaultValue={compromisso.description} required className={inputClass} />
          <div className="flex flex-wrap gap-2">
            <input name="event_date" type="date" defaultValue={origDate} required className={`${inputClass} flex-1 min-w-[140px]`} />
            <input name="event_time" type="time" defaultValue={origTime} required className={`${inputClass} min-w-[100px]`} />
          </div>
          <input name="location" defaultValue={compromisso.location ?? ""} placeholder="Local" className={inputClass} />
          <div className="flex gap-2">
            <Button type="submit" className="rounded-lg">Salvar</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)} className="text-muted-foreground">Cancelar</Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-4 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-150">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{compromisso.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {time}
            </span>
            {compromisso.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {compromisso.location}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            por {compromisso.created_by_name}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setEditing(true)}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <PencilSimple className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
