"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createTemplateSchema } from "@/lib/validations"

export async function createTemplate(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const data = createTemplateSchema.parse(Object.fromEntries(formData))

  const { error } = await supabase.from("task_templates").insert({
    household_id: profile?.household_id,
    ...data,
  })

  if (!error) revalidatePath("/app/configuracoes")
  return { error: error?.message }
}

export async function deleteTemplate(templateId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("task_templates")
    .update({ is_active: false })
    .eq("id", templateId)

  if (!error) revalidatePath("/app/configuracoes")
  return { error: error?.message }
}
