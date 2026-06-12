import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DateNav } from "@/components/tasks/date-nav"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"
import { getTodayDateString } from "@/lib/utils"

export default async function TasksPage(props: { searchParams: Promise<{ data?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("household_id")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) redirect("/auth/login")

  const date = searchParams.data || getTodayDateString()

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("due_date", date)
    .order("created_at")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <DateNav currentDate={date} />
      </div>
      <TaskForm dueDate={date} />
      <TaskList tasks={tasks ?? []} />
    </div>
  )
}
