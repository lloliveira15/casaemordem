"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function regenerateCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const newCode = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("")

  const { error } = await supabase
    .from("households")
    .update({ invite_code: newCode })
    .eq("id", profile?.household_id)
    .eq("admin_id", user.id)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message, code: newCode }
}

export async function updateMember(memberId: string, formData: FormData) {
  const supabase = await createClient()
  const username = formData.get("username") as string
  const phone = formData.get("phone") as string

  const { error } = await supabase
    .from("profiles")
    .update({ username, phone })
    .eq("id", memberId)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message }
}

export async function toggleNotifications(memberUserId: string, enabled: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("household_members")
    .update({ notifications_enabled: enabled })
    .eq("user_id", memberUserId)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message }
}

export async function sendInvite(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, household:households(invite_code)")
    .eq("id", user.id)
    .single()

  const household = profile?.household as unknown as { invite_code: string }
  return { success: true, inviteCode: household?.invite_code, senderName: profile?.username }
}
