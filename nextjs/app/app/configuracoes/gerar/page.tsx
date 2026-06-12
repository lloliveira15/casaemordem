"use client"

import { useState } from "react"
import { generateTasks } from "@/lib/actions/generate"

export default function GeneratePage() {
  const [result, setResult] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const res = await generateTasks(fd)
    if (res.error) setResult(res.error)
    else setResult(`${res.count} tarefa(s) gerada(s) com sucesso!`)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        <a href="/app/configuracoes" className="text-primary hover:underline">Templates</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/notificacoes" className="text-primary hover:underline">Notificações</a>
        <span aria-hidden>·</span>
        <span className="font-medium">Gerar Tarefas</span>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/produtividade" className="text-primary hover:underline">Produtividade</a>
      </div>

      <h1 className="text-2xl font-bold">Gerar Tarefas</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="text-sm font-medium block mb-1">Período</label>
          <select name="period" className="px-3 py-2 border rounded-md bg-background text-sm">
            <option value="day">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          Gerar Tarefas dos Templates
        </button>
        {result && (
          <p className="text-sm">{result}</p>
        )}
      </form>
    </div>
  )
}
