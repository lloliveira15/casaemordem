import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TodayTasks } from "@/components/dashboard/today-tasks"
import { getTodayDateString } from "@/lib/utils"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, household:households(*)")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) return redirect("/auth/login")

  const today = getTodayDateString()

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("due_date", today)
    .order("created_at")

  const { data: members } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", profile.household_id)

  const pending = tasks?.filter(t => !t.completed).length ?? 0
  const completed = tasks?.filter(t => t.completed).length ?? 0
  const total = tasks?.length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Olá, {profile.username}!</p>
      </div>

      <StatsCards
        total={total}
        completed={completed}
        pending={pending}
        memberCount={members?.length ?? 0}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tarefas de Hoje</h2>
        <TodayTasks tasks={tasks ?? []} />
      </div>
    </div>
  )
}
