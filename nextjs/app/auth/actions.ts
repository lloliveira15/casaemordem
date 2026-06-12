"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { loginSchema, registerSchema } from "@/lib/validations"

export async function login(formData: FormData): Promise<never | void> {
  const supabase = await createClient()

  const parsed = loginSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return redirect("/auth/login?erro=Dados+inválidos")
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return redirect(`/auth/login?erro=${encodeURIComponent(error.message)}`)
  redirect("/app/dashboard")
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
  redirect("/app/dashboard")
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
