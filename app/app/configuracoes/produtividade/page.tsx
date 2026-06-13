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

export default async function ProductivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0]
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0]

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("household_id", profile.household_id)
    .gte("due_date", firstOfMonth)
    .lte("due_date", lastOfMonth)

  const { data: members } = await supabase
    .from("household_members")
    .select("user_id, profile:profiles!user_id(username)")
    .eq("household_id", profile.household_id)

  const memberStats: MemberStats[] = (members ?? []).map((m) => {
    const p = m.profile as unknown as { username: string }
    const memberTasks = (tasks ?? []).filter(t => t.assigned_to === p.username)
    const total = memberTasks.length
    const completed = memberTasks.filter(t => t.completed).length
    return {
      user_id: m.user_id,
      username: p.username,
      total,
      completed,
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  const globalTotal = tasks?.length ?? 0
  const globalCompleted = tasks?.filter(t => t.completed).length ?? 0
  const globalRate = globalTotal > 0 ? Math.round((globalCompleted / globalTotal) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        <a href="/app/configuracoes" className="text-primary hover:underline">Templates</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/notificacoes" className="text-primary hover:underline">Notificações</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/gerar" className="text-primary hover:underline">Gerar Tarefas</a>
        <span aria-hidden>·</span>
        <span className="font-medium">Produtividade</span>
      </div>

      <h1 className="text-2xl font-bold">Produtividade</h1>

      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Casa: {globalCompleted}/{globalTotal} ({globalRate}%)</p>
        <Progress value={globalRate} className="mt-2" />
      </div>

      <div className="space-y-3">
        {memberStats.map((ms) => (
          <div key={ms.user_id} className="p-4 border rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{ms.username}</span>
              <span>{ms.completed}/{ms.total} ({ms.completion_rate}%)</span>
            </div>
            <Progress value={ms.completion_rate} />
          </div>
        ))}
      </div>
    </div>
  )
}
