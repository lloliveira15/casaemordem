import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface MemberStats {
  user_id: string
  username: string
  total: number
  completed: number
  completion_rate: number
}

export default async function ProductivityPage(props: { searchParams?: Promise<{ periodo?: string }> }) {
  const sp = props.searchParams ? await props.searchParams : {}
  const period = sp.periodo || "month"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const today = new Date()
  let startDate: Date
  let endDate: Date

  switch (period) {
    case "week": {
      const dow = today.getDay()
      startDate = new Date(today)
      startDate.setDate(today.getDate() - dow)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      break
    }
    case "year": {
      startDate = new Date(today.getFullYear(), 0, 1)
      endDate = new Date(today.getFullYear(), 11, 31)
      break
    }
    case "month":
    default: {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    }
  }

  const firstDay = startDate.toISOString().split("T")[0]
  const lastDay = endDate.toISOString().split("T")[0]

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("household_id", profile.household_id)
    .gte("due_date", firstDay)
    .lte("due_date", lastDay)

  const { data: members } = await supabase
    .from("household_members")
    .select("user_id, profile:profiles!user_id(username)")
    .eq("household_id", profile.household_id)

  const memberStats: MemberStats[] = (members ?? []).map((m) => {
    const p = m.profile as unknown as { username: string } | null
    const username = p?.username ?? "Usuário"
    const memberTasks = (tasks ?? []).filter(t => t.assigned_to === username)
    const total = memberTasks.length
    const completed = memberTasks.filter(t => t.completed).length
    return {
      user_id: m.user_id,
      username,
      total,
      completed,
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  const globalTotal = tasks?.length ?? 0
  const globalCompleted = tasks?.filter(t => t.completed).length ?? 0
  const globalRate = globalTotal > 0 ? Math.round((globalCompleted / globalTotal) * 100) : 0

  const tabClass = (href: string) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      href === "/app/configuracoes/produtividade"
        ? "bg-primary text-primary-foreground"
        : "bg-card text-muted-foreground hover:text-primary border border-border"
    }`

  const periodLink = (p: string) => {
    const base = "/app/configuracoes/produtividade"
    return p === period ? base : `${base}?periodo=${p}`
  }

  const periodClass = (p: string) =>
    `px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
      p === period
        ? "bg-primary text-primary-foreground"
        : "bg-card text-muted-foreground hover:text-primary border border-border"
    }`

  function barColor(rate: number): string {
    if (rate >= 70) return "bg-primary"
    if (rate >= 40) return "bg-amber-500"
    return "bg-primary/30"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <a href="/app/configuracoes" className={tabClass("/app/configuracoes")}>Templates</a>
        <a href="/app/configuracoes/notificacoes" className={tabClass("/app/configuracoes/notificacoes")}>Notificações</a>
        <a href="/app/configuracoes/gerar" className={tabClass("/app/configuracoes/gerar")}>Gerar Tarefas</a>
        <a href="/app/configuracoes/produtividade" className={tabClass("/app/configuracoes/produtividade")}>Produtividade</a>
      </div>

      <h1 className="text-2xl font-extrabold">Produtividade</h1>

      <div className="flex flex-wrap gap-2">
        <a href={periodLink("week")} className={periodClass("week")}>Semana</a>
        <a href={periodLink("month")} className={periodClass("month")}>Mês</a>
        <a href={periodLink("year")} className={periodClass("year")}>Ano</a>
      </div>

      <div className="p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)] space-y-3">
        <p className="text-sm text-muted-foreground">Casa: {globalCompleted}/{globalTotal} ({globalRate}%)</p>
        <Progress value={globalRate} className={`h-2 [&>div]:${barColor(globalRate)}`} />
      </div>

      <div className="space-y-3">
        {memberStats.map((ms) => {
          const barClass = barColor(ms.completion_rate)
          return (
            <div key={ms.user_id} className="p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-foreground">{ms.username}</span>
                <span className="text-muted-foreground">{ms.completed}/{ms.total} ({ms.completion_rate}%)</span>
              </div>
              <Progress value={ms.completion_rate} className={`h-2 [&>div]:${barClass}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
