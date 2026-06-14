"use client"

import { useState } from "react"
import { generateTasks } from "@/lib/actions/generate"
import { useRouter } from "next/navigation"

export function GerarTarefas() {
  const router = useRouter()
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate(period: string) {
    setLoading(true)
    setResult(null)
    const fd = new FormData()
    fd.set("period", period)
    const res = await generateTasks(fd)
    setLoading(false)
    if (res.error) setResult(res.error)
    else setResult(`${res.count} tarefa(s) gerada(s) com sucesso!`)
    router.refresh()
  }

  return (
    <div className="space-y-5 max-w-md">
      <div className="space-y-4 p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
        <h2 className="text-sm font-semibold text-foreground">Gerar Tarefas</h2>
        <p className="text-xs text-muted-foreground">
          Cria instâncias de tarefas recorrentes para o período escolhido. Tarefas já geradas não são duplicadas.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenerate("day")}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Gerando..." : "Hoje"}
          </button>
          <button
            onClick={() => handleGenerate("week")}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Esta Semana
          </button>
          <button
            onClick={() => handleGenerate("month")}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Este Mês
          </button>
        </div>
        {result && <p className="text-sm text-success font-medium">{result}</p>}
      </div>
    </div>
  )
}
