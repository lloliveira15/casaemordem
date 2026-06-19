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

  let roomId = formData.get("room_id") as string | null
  const roomName = formData.get("room") as string | null

  if (!roomId && roomName && roomName.trim()) {
    const name = roomName.trim()
    const { data: existingRoom } = await supabase
      .from("rooms")
      .select("id")
      .eq("household_id", profile.household_id)
      .eq("name", name)
      .maybeSingle()

    if (existingRoom) {
      roomId = existingRoom.id
    } else {
      const { data: newRoom, error: createError } = await supabase
        .from("rooms")
        .insert({ household_id: profile.household_id, name })
        .select("id")
        .single()

      if (createError) return { error: createError.message }
      roomId = newRoom.id
    }
  }

  const isSporadic = !data.frequency

  const { error } = await supabase.from("task_templates").insert({
    household_id: profile.household_id,
    room_id: roomId,
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
