"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function switchHousehold(householdId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: membership } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", householdId)
    .eq("user_id", user.id)
    .single()

  if (!membership) return { error: "Você não é membro desta casa" }

  const { error } = await supabase
    .from("profiles")
    .update({ household_id: householdId })
    .eq("id", user.id)

  if (!error) revalidatePath("/app")
  return { error: error?.message }
}

export async function createNewHousehold(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("households").insert({
    name,
    admin_id: user.id,
  })

  if (!error) revalidatePath("/app")
  return { error: error?.message }
}
