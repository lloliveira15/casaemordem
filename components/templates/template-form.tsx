"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createTemplate } from "@/lib/actions/templates"
import { FREQUENCY_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "phosphor-react"

const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

export function TemplateForm({ rooms, members }: { rooms: string[]; members: { id: string; username: string }[] }) {
  const router = useRouter()
  const descriptionRef = useRef<HTMLInputElement>(null)
  const [frequency, setFrequency] = useState("weekly")
  const [showNewRoom, setShowNewRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const room = formData.get("room") as string
    if (room === "__new__") {
      if (!newRoomName.trim()) return
      formData.set("room", newRoomName.trim())
    }
    const result = await createTemplate(formData)
    if (!result?.error) {
      if (descriptionRef.current) descriptionRef.current.value = ""
      descriptionRef.current?.focus()
      setShowNewRoom(false)
      setNewRoomName("")
      router.refresh()
    }
  }

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
  const selectClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Descrição</label>
        <input ref={descriptionRef} name="description" required className={inputClass} />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Cômodo</label>
        <select
          name="room"
          defaultValue=""
          onChange={(e) => {
            setShowNewRoom(e.target.value === "__new__")
            if (e.target.value !== "__new__") setNewRoomName("")
          }}
          className={selectClass}
        >
          <option value="">Selecione um cômodo</option>
          {rooms.map(r => <option key={r} value={r}>{r}</option>)}
          <option value="__new__">+ Novo ambiente...</option>
        </select>
      </div>
      {showNewRoom && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Nome do novo ambiente</label>
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Ex: Garagem"
            className={inputClass}
            autoFocus
          />
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Responsável</label>
        <select name="assigned_to_id" className={selectClass}>
          <option value="">Todos</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.username}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Frequência</label>
        <select
          name="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className={selectClass}
        >
          {Object.entries(FREQUENCY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      {(frequency === "weekly" || frequency === "biweekly") && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Dia da semana</label>
          <select name="day_value" className={selectClass}>
            {DAY_NAMES.map((name, i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>
        </div>
      )}
      {frequency === "monthly" && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Dia do mês</label>
          <select name="day_value" className={selectClass}>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}º</option>
            ))}
          </select>
        </div>
      )}
      <Button type="submit" className="rounded-lg">
        <Plus className="size-4 mr-1" />
        Adicionar
      </Button>
    </form>
  )
}
