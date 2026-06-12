"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateTasksForRange } from "@/lib/task-generation"

export async function generateTasks(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) return { error: "No household" }

  const period = formData.get("period") as string
  const today = new Date()
  let startDate = new Date(today)
  let endDate = new Date(today)

  switch (period) {
    case "day": break
    case "week": {
      const dow = today.getDay()
      startDate.setDate(today.getDate() - dow)
      endDate.setDate(startDate.getDate() + 6)
      break
    }
    case "month": {
      startDate.setDate(1)
      endDate.setMonth(startDate.getMonth() + 1, 0)
      break
    }
    default: return { error: "Invalid period" }
  }

  const { data: templates } = await supabase
    .from("task_templates")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("is_active", true)

  if (!templates?.length) return { error: "Nenhum template ativo" }

  const tasksToCreate = generateTasksForRange(templates, profile.household_id, startDate, endDate)

  const firstDay = startDate.toISOString().split("T")[0]
  const lastDay = endDate.toISOString().split("T")[0]

  const { data: existingTasks } = await supabase
    .from("tasks")
    .select("template_id, due_date")
    .eq("household_id", profile.household_id)
    .gte("due_date", firstDay)
    .lte("due_date", lastDay)

  const existingSet = new Set(
    existingTasks?.map(t => `${t.template_id}-${t.due_date}`) ?? []
  )

  const newTasks = tasksToCreate.filter(
    t => !existingSet.has(`${t.template_id}-${t.due_date}`)
  )

  if (newTasks.length === 0) return { error: "Todas as tarefas já foram geradas" }

  const { error } = await supabase.from("tasks").insert(newTasks)
  if (!error) revalidatePath("/app/configuracoes/gerar")
  return { error: error?.message, count: newTasks.length }
}
