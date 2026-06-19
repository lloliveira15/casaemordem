"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { loginSchema, registerSchema } from "@/lib/validations"

export async function login(formData: FormData): Promise<never | void> {
  const supabase = await createClient()

  const redirectTo = (formData.get("redirect") as string) || ""

  const parsed = loginSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const errorParams = new URLSearchParams({ erro: "Dados inválidos" })
    if (redirectTo) errorParams.set("redirect", redirectTo)
    return redirect(`/auth/login?${errorParams.toString()}`)
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    const errorParams = new URLSearchParams({ erro: error.message })
    if (redirectTo) errorParams.set("redirect", redirectTo)
    return redirect(`/auth/login?${errorParams.toString()}`)
  }

  redirect(redirectTo || "/app/dashboard")
}

export async function register(formData: FormData): Promise<never | void> {
  const supabase = await createClient()

  const parsed = registerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return redirect("/auth/cadastro?erro=Dados+inválidos")
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
    },
  })

  if (error) return redirect(`/auth/cadastro?erro=${encodeURIComponent(error.message)}`)

  if (parsed.data.invite_code) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const code = parsed.data.invite_code.trim().toUpperCase()
      const { data: household } = await supabase
        .from("households")
        .select("id")
        .eq("invite_code", code)
        .single()

      if (household) {
        const { data: existing } = await supabase
          .from("household_members")
          .select("id")
          .eq("household_id", household.id)
          .eq("user_id", user.id)
          .maybeSingle()

        if (!existing) {
          await supabase.from("household_members").insert({
            household_id: household.id,
            user_id: user.id,
            role: "member",
          })
        }

        await supabase.from("profiles").update({ household_id: household.id }).eq("id", user.id)
      }
    }
  }

  redirect("/app/dashboard")
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
