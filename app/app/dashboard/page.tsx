import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar } from "@/components/dashboard/calendar"
import { TaskTable } from "@/components/tasks/task-table"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { getTodayDateString } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage(props: { searchParams: Promise<{ data?: string }> }) {
  const searchParams = await props.searchParams
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
  const currentDate = searchParams.data || today

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, room:rooms(name), assigned:household_members!tasks_assigned_to_id_fkey(user_id, profiles!inner(username))")
    .eq("household_id", profile.household_id)
    .eq("due_date", currentDate)
    .order("created_at")

  const [year, month] = currentDate.split("-").map(Number)
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  const { data: monthTasks } = await supabase
    .from("tasks")
    .select("due_date")
    .eq("household_id", profile.household_id)
    .gte("due_date", monthStart)
    .lte("due_date", monthEnd)

  const taskDates = new Set(monthTasks?.map(t => t.due_date) ?? [])

  const { data: members } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", profile.household_id)

  const pending = tasks?.filter(t => !t.completed).length ?? 0
  const completed = tasks?.filter(t => t.completed).length ?? 0
  const total = tasks?.length ?? 0

  const d = new Date(currentDate + "T12:00:00")
  const dateFormatted = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5 capitalize">{dateFormatted}</p>
        </div>
        <Link href="/app/configuracoes/gerar">
          <Button variant="outline" className="rounded-lg">
            Gerar Tarefas
          </Button>
        </Link>
      </div>

      <StatsCards
        total={total}
        completed={completed}
        pending={pending}
        memberCount={members?.length ?? 0}
      />

      <Calendar currentDate={currentDate} taskDates={taskDates} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Tarefas do Dia</h2>
        <TaskTable tasks={tasks ?? []} />
      </div>
    </div>
  )
}
