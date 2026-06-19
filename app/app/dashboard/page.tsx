import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar } from "@/components/dashboard/calendar"
import { TaskTable } from "@/components/tasks/task-table"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DateNavigator } from "@/components/dashboard/date-navigator"
import { QuickTaskDialog } from "@/components/tasks/quick-task-dialog"
import { getTodayDateString } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CompromissoCard } from "@/components/events/compromisso-card"
import { AddCompromisso } from "@/components/events/add-compromisso"

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

  const { data: rawMembers } = await supabase
    .from("household_members")
    .select("id, user_id")
    .eq("household_id", profile.household_id)

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name")
    .eq("household_id", profile.household_id)
    .order("sort_order")

  const memberIds = rawMembers?.map(m => m.user_id) ?? []
  const { data: memberProfiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", memberIds.length > 0 ? memberIds : [user.id])

  const profileMap = new Map(memberProfiles?.map(p => [p.id, p]) ?? [])
  const members = (rawMembers ?? []).map(m => ({
    id: m.id,
    username: profileMap.get(m.user_id)?.username ?? "Usuário",
  }))

  const { data: compromissos } = await supabase
    .from("events")
    .select("*, profiles!events_created_by_fkey(username)")
    .eq("household_id", profile.household_id)
    .gte("event_date_time", `${currentDate}T00:00:00`)
    .lt("event_date_time", `${currentDate}T23:59:59`)
    .order("event_date_time")

  const householdName = profile.household?.name

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DateNavigator currentDate={currentDate} dateFormatted={dateFormatted} />
        <div className="flex items-center gap-2 shrink-0">
          <QuickTaskDialog rooms={rooms ?? []} members={members} currentDate={currentDate} />
          <Link href="/app/configuracoes/gerar">
            <Button variant="outline" className="rounded-lg">
              Gerar Tarefas
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-2/5 lg:w-1/3">
          <Calendar currentDate={currentDate} taskDates={taskDates} />
        </div>
        <div className="w-full md:w-3/5 lg:w-2/3">
          <StatsCards
            total={total}
            completed={completed}
            pending={pending}
            memberCount={rawMembers?.length ?? 0}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            Compromissos do Dia {(compromissos?.length ?? 0) > 0 && `(${compromissos?.length})`}
          </h2>
        </div>
        {compromissos && compromissos.length > 0 ? (
          <div className="space-y-2">
            {compromissos.map((c) => (
              <CompromissoCard
                key={c.id}
                compromisso={{
                  id: c.id,
                  description: c.description,
                  event_date_time: c.event_date_time,
                  location: c.location,
                  created_by_name: c.profiles?.username ?? "Usuário",
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum compromisso para hoje.</p>
        )}
        <AddCompromisso />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Tarefas do Dia</h2>
        <TaskTable tasks={tasks ?? []} />
      </div>
    </div>
  )
}
