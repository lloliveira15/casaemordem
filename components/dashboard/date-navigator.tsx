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
    <div className="flex items-center gap-2 min-w-0">
      <button
        onClick={() => goTo(shiftDate(currentDate, -1))}
        className="size-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors shrink-0"
        aria-label="Dia anterior"
      >
        <CaretLeft className="size-4" />
      </button>

      <div className="flex items-center gap-3 min-w-0">
        <p className="text-xl font-bold text-foreground capitalize truncate">
          {dateFormatted}
        </p>

        {!isToday(currentDate) && (
          <button
            onClick={() => goTo(new Date().toISOString().split("T")[0])}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
          >
            Hoje
          </button>
        )}
      </div>

      <button
        onClick={() => goTo(shiftDate(currentDate, 1))}
        className="size-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-card border border-border transition-colors shrink-0"
        aria-label="Próximo dia"
      >
        <CaretRight className="size-4" />
      </button>
    </div>
  )
}
