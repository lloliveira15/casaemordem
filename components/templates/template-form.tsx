"use client"

import { useRef, useState } from "react"
import { createTemplate } from "@/lib/actions/templates"
import { ROOM_OPTIONS, FREQUENCY_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "phosphor-react"

export function TemplateForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [roomSelectVal, setRoomSelectVal] = useState(ROOM_OPTIONS[0])
  const [showNewRoom, setShowNewRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")

  async function handleSubmit(formData: FormData) {
    let room = roomSelectVal
    if (room === "__new__") {
      if (!newRoomName.trim()) return
      room = newRoomName.trim()
      formData.set("room", room)
    }
    const result = await createTemplate(formData)
    if (!result?.error) {
      formRef.current?.reset()
      setRoomSelectVal(ROOM_OPTIONS[0])
      setShowNewRoom(false)
      setNewRoomName("")
    }
  }

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
  const selectClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Descrição</label>
        <input name="description" required className={inputClass} />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Cômodo</label>
        <select
          name="room"
          value={roomSelectVal}
          onChange={(e) => {
            const val = e.target.value
            setRoomSelectVal(val)
            setShowNewRoom(val === "__new__")
            if (val === "__new__") setNewRoomName("")
          }}
          className={selectClass}
        >
          {ROOM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
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
        <input name="assigned_to" className={inputClass} />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Frequência</label>
        <select name="frequency" className={selectClass}>
          {Object.entries(FREQUENCY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">Dia</label>
        <input name="day_value" type="number" defaultValue={0} className={`${inputClass} w-16`} />
      </div>
      <Button type="submit" className="rounded-lg">
        <Plus className="size-4 mr-1" />
        Adicionar
      </Button>
    </form>
  )
}
