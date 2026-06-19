"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("household_id")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) return { error: "Perfil não encontrado" }

  const description = formData.get("description") as string
  const eventDateTime = formData.get("event_date_time") as string
  const location = formData.get("location") as string

  if (!description || !eventDateTime) {
    return { error: "Descrição e data/hora são obrigatórios" }
  }

  const { error } = await supabase.from("events").insert({
    household_id: profile.household_id,
    created_by: user.id,
    description,
    event_date_time: eventDateTime,
    location: location || null,
  })

  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const description = formData.get("description") as string
  const eventDateTime = formData.get("event_date_time") as string
  const location = formData.get("location") as string

  if (!id || !description || !eventDateTime) {
    return { error: "Dados obrigatórios ausentes" }
  }

  const { error } = await supabase
    .from("events")
    .update({
      description,
      event_date_time: eventDateTime,
      location: location || null,
    })
    .eq("id", id)

  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}

export async function removeEvent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}
