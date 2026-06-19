"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateNotifSettings } from "@/lib/actions/notifications"
import { Button } from "@/components/ui/button"
import { Plus, X } from "phosphor-react"

interface NotifSettings {
  email_enabled: boolean
  reminder_times: string[]
  deadline_time: string
  events_enabled: boolean
}

export function NotificationsForm({ settings }: { settings: NotifSettings }) {
  const router = useRouter()
  const [times, setTimes] = useState<string[]>(settings.reminder_times.length > 0 ? settings.reminder_times : ["08:00", "14:00", "18:00"])
  const [deadline, setDeadline] = useState(settings.deadline_time || "21:00")
  const [emailEnabled, setEmailEnabled] = useState(settings.email_enabled)
  const [eventsEnabled, setEventsEnabled] = useState(settings.events_enabled)

  function addTime() {
    setTimes([...times, "12:00"])
  }

  function removeTime(idx: number) {
    setTimes(times.filter((_, i) => i !== idx))
  }

  function updateTime(idx: number, val: string) {
    const next = [...times]
    next[idx] = val
    setTimes(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData()
    fd.set("email_enabled", String(emailEnabled))
    fd.set("events_enabled", String(eventsEnabled))
    fd.set("deadline_time", deadline)
    for (const t of times) fd.append("reminder_time", t)
    await updateNotifSettings(fd)
    router.refresh()
  }

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} className="size-4 accent-primary rounded border-border" />
        <span className="text-sm text-foreground">Notificações por email ativadas</span>
      </label>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={eventsEnabled} onChange={(e) => setEventsEnabled(e.target.checked)} className="size-4 accent-primary rounded border-border" />
        <span className="text-sm text-foreground">Notificar compromissos</span>
      </label>
      <p className="text-[11px] text-muted-foreground -mt-3">Os membros recebem um email 1h e 30min antes de cada compromisso.</p>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground block">Horários de lembrete</label>
        <p className="text-[11px] text-muted-foreground">Nestes horários, o responsável pela tarefa é notificado se ela estiver pendente.</p>
        {times.map((t, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="time" value={t} onChange={(e) => updateTime(i, e.target.value)} className={inputClass} />
            <button type="button" onClick={() => removeTime(i)} className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <X className="size-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={addTime} className="text-muted-foreground">
          <Plus className="size-4 mr-1" />
          Adicionar horário
        </Button>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Horário limite</label>
        <p className="text-[11px] text-muted-foreground mb-2">Após este horário, todos os membros são notificados das tarefas ainda pendentes.</p>
        <input type="time" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
      </div>

      <Button type="submit" className="rounded-lg">Salvar</Button>
    </form>
  )
}
