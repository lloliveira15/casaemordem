"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateNotifSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const { error } = await supabase
    .from("notification_settings")
    .upsert({
      household_id: profile?.household_id,
      email_enabled: formData.get("email_enabled") === "true",
      reminder_time: (formData.get("reminder_time") as string) || "16:00",
      reminder_freq: (formData.get("reminder_freq") as string) || "daily",
    })

  if (!error) revalidatePath("/app/configuracoes/notificacoes")
}
