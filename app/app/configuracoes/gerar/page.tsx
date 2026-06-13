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

  const tabClass = (href: string) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      href === "/app/configuracoes/gerar"
        ? "bg-primary text-primary-foreground"
        : "bg-card text-muted-foreground hover:text-primary border border-border"
    }`

  const selectClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <a href="/app/configuracoes" className={tabClass("/app/configuracoes")}>Templates</a>
        <a href="/app/configuracoes/notificacoes" className={tabClass("/app/configuracoes/notificacoes")}>Notificações</a>
        <a href="/app/configuracoes/gerar" className={tabClass("/app/configuracoes/gerar")}>Gerar Tarefas</a>
        <a href="/app/configuracoes/produtividade" className={tabClass("/app/configuracoes/produtividade")}>Produtividade</a>
      </div>

      <h1 className="text-2xl font-extrabold">Gerar Tarefas</h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Período</label>
          <select name="period" className={selectClass}>
            <option value="day">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          Gerar Tarefas dos Templates
        </button>
        {result && <p className="text-sm text-success font-medium">{result}</p>}
      </form>
    </div>
  )
}
