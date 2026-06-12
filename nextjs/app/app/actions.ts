"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleTask(taskId: string) {
  const supabase = await createClient()

  const { data: task } = await supabase
    .from("tasks")
    .select("completed, completed_by, completed_at")
    .eq("id", taskId)
    .single()

  if (!task) return { error: "Tarefa não encontrada" }

  const { data: { user } } = await supabase.auth.getUser()

  const updates = task.completed
    ? { completed: false, completed_by: null, completed_at: null }
    : { completed: true, completed_by: user?.id, completed_at: new Date().toISOString() }

  const { error } = await supabase.from("tasks").update(updates).eq("id", taskId)
  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("tasks").delete().eq("id", taskId)
  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}

export async function createQuickTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("household_id")
    .eq("id", user.id)
    .single()

  const { error } = await supabase.from("tasks").insert({
    household_id: profile?.household_id,
    description: formData.get("description") as string,
    room: (formData.get("room") as string) || "Geral",
    assigned_to: formData.get("assigned_to") as string || null,
    due_date: formData.get("due_date") as string,
  })

  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}
