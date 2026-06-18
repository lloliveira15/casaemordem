"use client"

import { useRouter } from "next/navigation"
import { CaretLeft, CaretRight } from "phosphor-react"

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00")
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0]
}

export function DateNavigator({ currentDate, dateFormatted }: { currentDate: string; dateFormatted: string }) {
  const router = useRouter()

  function goTo(dateStr: string) {
    router.push(`/app/dashboard?data=${dateStr}`)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => goTo(shiftDate(currentDate, -1))}
        className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors"
        aria-label="Dia anterior"
      >
        <CaretLeft className="size-4" />
      </button>

      <p className="text-muted-foreground text-sm capitalize min-w-[200px] text-center">
        {dateFormatted}
      </p>

      <button
        onClick={() => goTo(shiftDate(currentDate, 1))}
        className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors"
        aria-label="Próximo dia"
      >
        <CaretRight className="size-4" />
      </button>

      {!isToday(currentDate) && (
        <button
          onClick={() => goTo(new Date().toISOString().split("T")[0])}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Hoje
        </button>
      )}
    </div>
  )
}
