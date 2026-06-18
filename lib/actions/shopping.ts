"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { autoCategorize, DEFAULT_CATEGORIES } from "@/lib/shopping-categories"

export async function addShoppingItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) return { error: "Sem casa ativa" }

  const itemName = (formData.get("item_name") as string)?.trim()
  const quantity = (formData.get("quantity") as string)?.trim() || null
  if (!itemName) return { error: "Nome do item obrigatório" }

  let { data: categories } = await supabase
    .from("shopping_categories")
    .select("*")
    .eq("household_id", profile.household_id)
    .order("sort_order")

  if (!categories || categories.length === 0) {
    const { error: seedError } = await supabase
      .from("shopping_categories")
      .insert(
        DEFAULT_CATEGORIES.map((cat) => ({
          household_id: profile.household_id,
          name: cat.name,
          keywords: cat.keywords,
          sort_order: cat.sort_order,
        }))
      )
    if (!seedError) {
      const { data: seeded } = await supabase
        .from("shopping_categories")
        .select("*")
        .eq("household_id", profile.household_id)
        .order("sort_order")
      categories = seeded ?? []
    }
  }

  const category = autoCategorize(itemName, categories ?? [])

  const { error } = await supabase.from("shopping_items").insert({
    household_id: profile.household_id,
    item_name: itemName,
    quantity,
    category,
  })

  if (!error) revalidatePath("/app/compras")
  return { error: error?.message }
}

export async function toggleShoppingItem(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: item } = await supabase
    .from("shopping_items")
    .select("completed")
    .eq("id", itemId)
    .single()

  if (!item) return { error: "Item não encontrado" }

  const updates = item.completed
    ? { completed: false, completed_by: null, completed_at: null }
    : { completed: true, completed_by: user.id, completed_at: new Date().toISOString() }

  const { error } = await supabase.from("shopping_items").update(updates).eq("id", itemId)
  if (!error) revalidatePath("/app/compras")
  return { error: error?.message }
}

export async function deleteShoppingItem(itemId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("shopping_items").delete().eq("id", itemId)
  if (!error) revalidatePath("/app/compras")
  return { error: error?.message }
}

export async function clearCompletedItems() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .eq("household_id", profile?.household_id)
    .eq("completed", true)

  if (!error) revalidatePath("/app/compras")
  return { error: error?.message }
}
