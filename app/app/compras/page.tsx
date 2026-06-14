import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ShoppingList } from "@/components/shopping/shopping-list"

export default async function ComprasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const { data: items } = await supabase
    .from("shopping_items")
    .select("*")
    .eq("household_id", profile.household_id)
    .order("created_at")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-foreground">Lista de Compras</h1>
      <ShoppingList items={items ?? []} />
    </div>
  )
}
