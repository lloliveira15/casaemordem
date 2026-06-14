"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"

interface CalendarProps {
  currentDate: string
  taskDates: Set<string>
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export function Calendar({ currentDate, taskDates }: CalendarProps) {
  const router = useRouter()

  const { year, month, days, firstDayOfWeek, todayStr } = useMemo(() => {
    const d = new Date(currentDate + "T12:00:00")
    const y = d.getFullYear()
    const m = d.getMonth()
    const first = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const today = new Date()
    const tStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    return { year: y, month: m, days: daysInMonth, firstDayOfWeek: first, todayStr: tStr }
  }, [currentDate])

  function goToDate(dateStr: string) {
    const params = new URLSearchParams(window.location.search)
    params.set("data", dateStr)
    router.push(`/app/dashboard?${params.toString()}`)
  }

  function prevMonth() {
    const d = new Date(year, month - 1, 1)
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
    goToDate(str)
  }

  function nextMonth() {
    const d = new Date(year, month + 1, 1)
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
    goToDate(str)
  }

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }
  for (let day = 1; day <= days; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const isToday = dateStr === todayStr
    const isSelected = dateStr === currentDate
    const hasTasks = taskDates.has(dateStr)
    cells.push(
      <button
        key={day}
        onClick={() => goToDate(dateStr)}
        className={`relative flex items-center justify-center h-9 rounded-lg text-sm transition-all ${
          isSelected
            ? "bg-primary text-primary-foreground font-bold"
            : isToday
              ? "bg-primary/10 text-primary font-bold"
              : "text-foreground hover:bg-secondary"
        }`}
      >
        {day}
        {hasTasks && !isSelected && (
          <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
        )}
      </button>
    )
  }

  return (
    <div className="p-4 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-all">&larr;</button>
        <span className="text-sm font-bold text-foreground">{MONTH_NAMES[month]} {year}</span>
        <button onClick={nextMonth} className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-all">&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_NAMES.map(d => <div key={d} className="text-[11px] font-semibold text-muted-foreground py-1">{d}</div>)}
        {cells}
      </div>
    </div>
  )
}
