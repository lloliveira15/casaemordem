"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CaretLeft, CaretRight } from "phosphor-react"

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00")
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export function DateNav({ currentDate }: { currentDate: string }) {
  const router = useRouter()
  const sp = useSearchParams()

  function goTo(date: string) {
    const params = new URLSearchParams(sp.toString())
    params.set("data", date)
    router.push(`/app/tarefas?${params}`)
  }

  const today = new Date().toISOString().split("T")[0]
  const [y, m, d] = currentDate.split("-")

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goTo(shiftDate(currentDate, -1))}
        className="rounded-lg border-border bg-card hover:bg-muted hover:text-primary"
      >
        <CaretLeft className="size-4" />
      </Button>
      <span className="text-sm font-semibold min-w-[140px] text-center text-foreground">
        {d}/{m}/{y}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => goTo(shiftDate(currentDate, 1))}
        className="rounded-lg border-border bg-card hover:bg-muted hover:text-primary"
      >
        <CaretRight className="size-4" />
      </Button>
      {currentDate !== today && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => goTo(today)}
          className="rounded-lg"
        >
          Hoje
        </Button>
      )}
    </div>
  )
}
