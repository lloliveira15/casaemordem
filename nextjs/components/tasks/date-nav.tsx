"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => goTo(shiftDate(currentDate, -1))}>
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-sm font-medium min-w-[140px] text-center">
        {d}/{m}/{y}
      </span>
      <Button variant="outline" size="sm" onClick={() => goTo(shiftDate(currentDate, 1))}>
        <ChevronRight className="size-4" />
      </Button>
      {currentDate !== today && (
        <Button variant="secondary" size="sm" onClick={() => goTo(today)}>
          Hoje
        </Button>
      )}
    </div>
  )
}
