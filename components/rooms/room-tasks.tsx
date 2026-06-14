"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createRoomTask, deleteRoomTask } from "@/lib/actions/templates"
import { FREQUENCY_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "phosphor-react"

interface Template {
  id: string
  description: string
  frequency: string
  day_value: number
  is_sporadic: boolean
  assigned_to_id: string | null
  room: { name: string } | null
  assigned: { user_id: string; profiles: { username: string } } | null
}

interface Member {
  id: string
  user_id: string
  profile: { username: string }
}

export function RoomTasks({ roomId, templates, members }: { roomId: string; templates: Template[]; members: Member[] }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [showForm, setShowForm] = useState(false)

  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  async function handleSubmit(formData: FormData) {
    formData.set("room_id", roomId)
    const result = await createRoomTask(formData)
    if (!result?.error) {
      formRef.current?.reset()
      setShowForm(false)
      router.refresh()
    }
  }

  function getDayLabel(freq: string, dayVal: number): string {
    if (freq === "weekly") return dayNames[dayVal] ?? ""
    if (freq === "monthly") return `${dayVal}º dia`
    if (freq === "biweekly") return dayVal === 1 ? "1ª quinzena" : "2ª quinzena"
    return ""
  }

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
  const selectClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="space-y-4">
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="rounded-lg">
          <Plus className="size-4 mr-1" />
          Nova Tarefa
        </Button>
      ) : (
        <form ref={formRef} action={handleSubmit} className="space-y-3 p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Descrição</label>
            <input name="description" required className={`${inputClass} w-full`} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Frequência</label>
              <select name="frequency" className={`${selectClass} w-full`}>
                <option value="">Compromisso (avulso)</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Dia</label>
              <select name="day_value" className={`${selectClass} w-full`}>
                <option value="0">-</option>
                <optgroup label="Semanal">
                  {dayNames.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </optgroup>
                <optgroup label="Mensal">
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}º dia</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Responsável</label>
            <select name="assigned_to_id" className={`${selectClass} w-full`}>
              <option value="">Livre</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.profile.username}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-lg">Salvar</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-lg">Cancelar</Button>
          </div>
        </form>
      )}

      {templates.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhuma tarefa cadastrada neste cômodo.</p>
      )}

      <div className="space-y-2">
        {templates.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)]">
            <div>
              <p className="text-sm font-semibold text-foreground">{t.description}</p>
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span>{FREQUENCY_LABELS[t.frequency] ?? t.frequency}</span>
                {getDayLabel(t.frequency, t.day_value) && (
                  <span className="px-2 py-0.5 bg-muted rounded-full">{getDayLabel(t.frequency, t.day_value)}</span>
                )}
                <span className="font-medium text-primary">
                  {t.assigned ? t.assigned.profiles.username : "Livre"}
                </span>
              </div>
            </div>
            <form action={async () => { await deleteRoomTask(t.id); router.refresh() }}>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive">
                <Trash className="size-4" />
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
