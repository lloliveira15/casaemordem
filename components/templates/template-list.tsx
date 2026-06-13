"use client"

import { deleteTemplate } from "@/lib/actions/templates"
import { FREQUENCY_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash } from "phosphor-react"

interface Template {
  id: string
  description: string
  room: string | null
  assigned_to: string | null
  frequency: string
  day_value: number
}

export function TemplateList({ templates }: { templates: Template[] }) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground text-sm">Nenhum template cadastrado.</p>
      </div>
    )
  }

  async function handleDelete(templateId: string) {
    await deleteTemplate(templateId)
  }

  return (
    <div className="space-y-2">
      {templates.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] hover:border-primary/30 transition-all"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">{t.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
              {t.room && <span className="px-2 py-0.5 bg-secondary rounded-full text-primary font-semibold">{t.room}</span>}
              {t.assigned_to && <span className="px-2 py-0.5 bg-secondary rounded-full text-primary font-semibold">{t.assigned_to}</span>}
              <span className="px-2 py-0.5 bg-secondary rounded-full text-primary font-semibold">{FREQUENCY_LABELS[t.frequency] ?? t.frequency}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Trash className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
