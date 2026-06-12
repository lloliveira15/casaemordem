"use client"

import { deleteTemplate } from "@/lib/actions/templates"
import { FREQUENCY_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

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
    return <p className="text-muted-foreground text-sm">Nenhum template cadastrado.</p>
  }

  async function handleDelete(templateId: string) {
    await deleteTemplate(templateId)
  }

  return (
    <div className="space-y-2">
      {templates.map((t) => (
        <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="text-sm font-medium">{t.description}</p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{t.room}</span>
              {t.assigned_to && <span>— {t.assigned_to}</span>}
              <span>— {FREQUENCY_LABELS[t.frequency] ?? t.frequency}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
