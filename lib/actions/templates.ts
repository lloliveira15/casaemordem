"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createRoomTaskSchema } from "@/lib/validations"

export async function createRoomTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) return { error: "Sem casa ativa" }

  const raw = Object.fromEntries(formData)
  const data = createRoomTaskSchema.parse(raw)

  const isSporadic = !data.frequency || data.frequency === ""

  const { error } = await supabase.from("task_templates").insert({
    household_id: profile.household_id,
    room_id: formData.get("room_id") as string || null,
    description: data.description,
    assigned_to_id: data.assigned_to_id || null,
    frequency: isSporadic ? "daily" : data.frequency,
    day_value: data.day_value ?? 0,
    is_sporadic: isSporadic,
  })

  if (!error) revalidatePath("/app/comodos")
  return { error: error?.message }
}

export async function deleteRoomTask(templateId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("task_templates")
    .update({ is_active: false })
    .eq("id", templateId)
  if (!error) revalidatePath("/app/comodos")
  return { error: error?.message }
}

export async function createTemplate(formData: FormData) {
  return createRoomTask(formData)
}

export async function deleteTemplate(templateId: string) {
  return deleteRoomTask(templateId)
}
