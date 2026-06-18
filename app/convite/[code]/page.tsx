import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ConvitePage(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/cadastro?invite=${encodeURIComponent(code)}`)
  }

  const normalizedCode = code.trim().toUpperCase()

  const { data: household } = await supabase
    .from("households")
    .select("id, name")
    .eq("invite_code", normalizedCode)
    .single()

  if (!household) {
    redirect(`/auth/cadastro?invite=${encodeURIComponent(code)}&erro=Código+de+convite+não+encontrado`)
  }

  const { data: existing } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", household.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from("profiles").update({ household_id: household.id }).eq("id", user.id)
    redirect("/app/dashboard")
  }

  await supabase.from("household_members").insert({
    household_id: household.id,
    user_id: user.id,
    role: "member",
  })

  await supabase.from("profiles").update({ household_id: household.id }).eq("id", user.id)

  redirect("/app/dashboard")
}
