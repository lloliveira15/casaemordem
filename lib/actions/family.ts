"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addFamilyMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("household_id")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) return { error: "Perfil não encontrado" }

  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const phone = formData.get("phone") as string
  const notes = formData.get("notes") as string

  if (!name || !type) return { error: "Nome e tipo são obrigatórios" }

  const { error } = await supabase.from("family_members").insert({
    household_id: profile.household_id,
    name,
    type,
    phone: phone || null,
    notes: notes || null,
  })

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message }
}

export async function updateFamilyMember(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const phone = formData.get("phone") as string
  const notes = formData.get("notes") as string

  if (!name || !type) return { error: "Nome e tipo são obrigatórios" }

  const { error } = await supabase
    .from("family_members")
    .update({ name, type, phone: phone || null, notes: notes || null })
    .eq("id", id)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message }
}

export async function removeFamilyMember(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", id)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message }
}
