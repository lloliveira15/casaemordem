"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface CalendarProps {
  currentDate: string
  taskDates: Set<string>
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export function Calendar({ currentDate, taskDates }: CalendarProps) {
  const router = useRouter()

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  function goToDate(dateStr: string) {
    const params = new URLSearchParams(window.location.search)
    params.set("data", dateStr)
    router.push(`/app/dashboard?${params.toString()}`)
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(y => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(y => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const isToday = dateStr === todayStr
    const isSelected = dateStr === currentDate
    const hasTasks = taskDates.has(dateStr)
    cells.push(
      <button
        key={day}
        onClick={() => goToDate(dateStr)}
        className={`relative flex items-center justify-center h-7 rounded-md text-xs transition-all ${
          isSelected
            ? "bg-primary text-primary-foreground font-bold"
            : isToday
              ? "bg-primary/10 text-primary font-bold"
              : "text-foreground hover:bg-secondary"
        }`}
      >
        {day}
        {hasTasks && !isSelected && (
          <span className="absolute bottom-0.5 size-0.5 rounded-full bg-primary" />
        )}
      </button>
    )
  }

  return (
    <div className="p-3 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="size-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-all text-sm">&larr;</button>
        <span className="text-xs font-bold text-foreground">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="size-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-all text-sm">&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DAY_NAMES.map(d => <div key={d} className="text-[10px] font-semibold text-muted-foreground pb-1">{d}</div>)}
        {cells}
      </div>
    </div>
  )
}
