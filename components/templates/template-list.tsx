"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { deleteTemplate, updateTemplateRoom } from "@/lib/actions/templates"
import { FREQUENCY_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash, PencilSimple } from "phosphor-react"

interface Template {
  id: string
  description: string
  room: { name: string } | null
  room_id: string | null
  assigned_to: string | null
  frequency: string
  day_value: number
}

interface Room {
  id: string
  name: string
}

interface TemplateListProps {
  templates: Template[]
  rooms: Room[]
}

const PAGE_SIZE = 12
const ROOM_COLORS: Record<string, string> = {
  Cozinha: "#F97316",
  "Sala de estar": "#8B5CF6",
  "Sala": "#8B5CF6",
  Quarto: "#3B82F6",
  "Banheiro social": "#06B6D4",
  "Banheiro suite": "#06B6D4",
  "Banheiro": "#06B6D4",
  Suíte: "#F472B6",
  Lavabo: "#06B6D4",
  Varanda: "#84CC16",
  "Área de serviço": "#10B981",
  Escritório: "#6B7280",
  Hall: "#EC4899",
  Corredor: "#EC4899",
  Geral: "#7C3AED",
}

function getRoomColor(room: string): string {
  return ROOM_COLORS[room] || "#7C3AED"
}

const FREQ_ORDER = ["daily", "weekly", "biweekly", "monthly"]

export function TemplateList({ templates, rooms }: TemplateListProps) {
  const router = useRouter()
  const [activeFreq, setActiveFreq] = useState<string>(FREQ_ORDER[0])
  const [activeRoomFilter, setActiveRoomFilter] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRoomId, setEditRoomId] = useState<string>("")

  const freqLabels: Record<string, string> = {
    daily: "Diária",
    weekly: "Semanal",
    biweekly: "Quinzenal",
    monthly: "Mensal",
  }

  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  const freqCount = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const f of FREQ_ORDER) counts[f] = 0
    for (const t of templates) {
      if (counts[t.frequency] !== undefined) counts[t.frequency]++
    }
    return counts
  }, [templates])

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      if (t.frequency !== activeFreq) return false
      if (activeRoomFilter && t.room?.name !== activeRoomFilter) return false
      return true
    })
  }, [templates, activeFreq, activeRoomFilter])

  const sortedTemplates = useMemo(() => {
    return [...filteredTemplates].sort((a, b) => {
      if (a.frequency === "weekly" && b.frequency === "weekly") {
        return (a.day_value ?? 0) - (b.day_value ?? 0)
      }
      if (a.frequency === "monthly" && b.frequency === "monthly") {
        return (a.day_value ?? 0) - (b.day_value ?? 0)
      }
      return 0
    })
  }, [filteredTemplates])

  const roomFilters = useMemo(() => {
    const roomSet = new Set<string>()
    for (const t of templates) {
      if (t.frequency === activeFreq && t.room?.name) roomSet.add(t.room.name)
    }
    return Array.from(roomSet).sort()
  }, [templates, activeFreq])

  const totalPages = Math.ceil(sortedTemplates.length / PAGE_SIZE)
  const [page, setPage] = useState(0)
  const pageStart = page * PAGE_SIZE
  const pageEnd = Math.min(pageStart + PAGE_SIZE, sortedTemplates.length)
  const pageItems = sortedTemplates.slice(pageStart, pageEnd)

  function handleFreqChange(freq: string) {
    setActiveFreq(freq)
    setActiveRoomFilter(null)
    setPage(0)
  }

  function handleRoomFilterChange(room: string | null) {
    setActiveRoomFilter(room)
    setPage(0)
  }

  function startEdit(t: Template) {
    setEditingId(t.id)
    setEditRoomId(t.room_id ?? "")
  }

  async function saveEdit(templateId: string) {
    await updateTemplateRoom(templateId, editRoomId || null)
    setEditingId(null)
    router.refresh()
  }

  async function handleDelete(templateId: string) {
    await deleteTemplate(templateId)
    router.refresh()
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground text-sm">Nenhum template cadastrado.</p>
      </div>
    )
  }

  const selectClass = "px-2 py-1 border border-input rounded-lg bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[120px]"

  return (
    <div className="space-y-4">
      {/* Frequency tabs */}
      <div className="flex flex-wrap gap-1">
        {FREQ_ORDER.map((freq) => {
          const count = freqCount[freq] ?? 0
          if (count === 0) return null
          return (
            <button
              key={freq}
              onClick={() => handleFreqChange(freq)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeFreq === freq
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-primary border border-border"
              }`}
            >
              {freqLabels[freq] ?? freq}
              <span className="ml-1 opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Room sub-tabs */}
      {roomFilters.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => handleRoomFilterChange(null)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              activeRoomFilter === null
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Todos ({sortedTemplates.length})
          </button>
          {roomFilters.map((room) => {
            const count = templates.filter(t => t.frequency === activeFreq && t.room?.name === room).length
            return (
              <button
                key={room}
                onClick={() => handleRoomFilterChange(room)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  activeRoomFilter === room
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <span
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: getRoomColor(room) }}
                />
                {room} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Template list */}
      <div className="space-y-2">
        {pageItems.map((t) => {
          const roomName = t.room?.name ?? ""
          const roomColor = roomName ? getRoomColor(roomName) : undefined
          const dayLabel =
            t.frequency === "weekly" && t.day_value != null
              ? dayNames[t.day_value]
              : t.frequency === "monthly" && t.day_value != null
                ? `${t.day_value}º dia`
                : ""
          return (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] hover:border-primary/30 transition-all"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.description}</p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs mt-1.5">
                  {editingId === t.id ? (
                    <div className="flex items-center gap-1">
                      <select
                        value={editRoomId}
                        onChange={(e) => setEditRoomId(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Sem cômodo</option>
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveEdit(t.id)}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-xs font-semibold rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      {roomName && (
                        <span
                          className="px-2 py-0.5 rounded-full text-white font-semibold"
                          style={{ backgroundColor: roomColor }}
                        >
                          {roomName}
                        </span>
                      )}
                      {t.assigned_to && (
                        <span className="px-2 py-0.5 bg-secondary rounded-full text-primary font-semibold">
                          {t.assigned_to}
                        </span>
                      )}
                      {dayLabel && (
                        <span className="px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          {dayLabel}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {editingId !== t.id && (
                  <button
                    onClick={() => startEdit(t)}
                    className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <PencilSimple className="size-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash className="size-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            &larr; Anterior
          </button>
          <span className="text-xs text-muted-foreground">
            {pageStart + 1}-{pageEnd} de {sortedTemplates.length}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Próxima &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
