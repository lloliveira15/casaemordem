"use client"

import { removeEvent } from "@/lib/actions/events"
import { Button } from "@/components/ui/button"
import { Trash, MapPin, Clock } from "phosphor-react"

interface CompromissoData {
  id: string
  description: string
  event_date_time: string
  location: string | null
  created_by_name: string
}

export function CompromissoCard({ compromisso }: { compromisso: CompromissoData }) {
  const date = new Date(compromisso.event_date_time)
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  async function handleRemove() {
    if (confirm(`Remover "${compromisso.description}"?`)) {
      await removeEvent(compromisso.id)
    }
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
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleRemove}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </div>
  )
}
