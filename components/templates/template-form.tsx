"use client"

import { useRef } from "react"
import { createTemplate } from "@/lib/actions/templates"
import { ROOM_OPTIONS, FREQUENCY_LABELS } from "@/lib/utils"

export function TemplateForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    const result = await createTemplate(formData)
    if (!result?.error) formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Descrição</label>
        <input name="description" required className="px-3 py-2 border rounded-md bg-background text-sm" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Cômodo</label>
        <select name="room" className="px-3 py-2 border rounded-md bg-background text-sm">
          {ROOM_OPTIONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Responsável</label>
        <input name="assigned_to" className="px-3 py-2 border rounded-md bg-background text-sm" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Frequência</label>
        <select name="frequency" className="px-3 py-2 border rounded-md bg-background text-sm">
          {Object.entries(FREQUENCY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Dia</label>
        <input name="day_value" type="number" defaultValue={0} className="px-3 py-2 border rounded-md bg-background text-sm w-16" />
      </div>
      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
        Adicionar
      </button>
    </form>
  )
}
