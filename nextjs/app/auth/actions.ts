"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { loginSchema, registerSchema } from "@/lib/validations"

export async function login(formData: FormData): Promise<{ error: string } | void> {
  const supabase = await createClient()
  const data = loginSchema.parse(Object.fromEntries(formData))

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) return { error: error.message }
  redirect("/app/dashboard")
}

export async function register(
  prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const parsed = registerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return { error: firstError?.message ?? "Dados inválidos" }
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
    },
  })

  if (error) return { error: error.message }
  redirect("/app/dashboard")
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
