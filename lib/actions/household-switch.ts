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

export async function joinHousehold(inviteCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const code = inviteCode.trim().toUpperCase()
  if (!code) return { error: "Código inválido" }

  const { data: household } = await supabase
    .from("households")
    .select("id, name")
    .eq("invite_code", code)
    .single()

  if (!household) return { error: "Código de convite não encontrado" }

  const { data: existing } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", household.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) return { error: "Você já é membro desta casa" }

  await supabase.from("household_members").insert({
    household_id: household.id,
    user_id: user.id,
    role: "member",
  })

  await supabase.from("profiles").update({ household_id: household.id }).eq("id", user.id)

  revalidatePath("/app")
  return { error: null }
}
