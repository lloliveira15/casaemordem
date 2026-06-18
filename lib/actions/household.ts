"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getResend } from "@/lib/resend"
import { InviteEmail } from "@/emails/invite"

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
  if (!email) return { error: "Email é obrigatório" }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, household_id")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.household_id) {
    return { error: "Perfil não encontrado" }
  }

  const { data: household, error: householdError } = await supabase
    .from("households")
    .select("invite_code")
    .eq("id", profile.household_id)
    .single()

  if (householdError || !household?.invite_code) {
    return { error: "Código de convite não encontrado" }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM ?? "noreply@casaemordem.app",
      to: email,
      subject: `${profile.username ?? "Alguém"} te convidou para o Casa em Ordem!`,
      react: InviteEmail({
        senderName: profile.username ?? "Alguém",
        inviteCode: household.invite_code,
        appUrl,
      }),
    })

    return { success: true }
  } catch (err) {
    console.error("Send invite error:", err)
    return { error: "Erro ao enviar convite. Verifique o email e tente novamente." }
  }
}
