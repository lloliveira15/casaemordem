"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createRoom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) return { error: "Sem casa ativa" }

  const name = (formData.get("name") as string)?.trim()
  if (!name) return { error: "Nome obrigatório" }

  const { error } = await supabase.from("rooms").insert({
    household_id: profile.household_id,
    name,
  })

  if (!error) revalidatePath("/app/comodos")
  return { error: error?.message }
}

export async function renameRoom(roomId: string, name: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("rooms").update({ name }).eq("id", roomId)
  if (!error) revalidatePath("/app/comodos")
  return { error: error?.message }
}

export async function reorderRooms(roomIds: string[]) {
  const supabase = await createClient()
  for (let i = 0; i < roomIds.length; i++) {
    await supabase.from("rooms").update({ sort_order: i }).eq("id", roomIds[i])
  }
  revalidatePath("/app/comodos")
}

export async function deleteRoom(roomId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("rooms").delete().eq("id", roomId)
  if (!error) revalidatePath("/app/comodos")
  return { error: error?.message }
}

export async function getRooms(householdId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("rooms")
    .select("*")
    .eq("household_id", householdId)
    .order("sort_order")
    .order("name")
  return data ?? []
}
