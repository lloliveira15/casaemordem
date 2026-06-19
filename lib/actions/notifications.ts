"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateNotifSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) return { error: "No household" }

  const emailEnabled = formData.get("email_enabled") === "true"
  const eventsEnabled = formData.get("events_enabled") !== "false"
  const deadlineTime = (formData.get("deadline_time") as string) || "21:00"
  const timesRaw = formData.getAll("reminder_time") as string[]
  const reminderTimes = timesRaw.filter(t => t).length > 0 ? timesRaw.filter(t => t) : ["08:00", "14:00", "18:00"]

  const { error } = await supabase
    .from("notification_settings")
    .update({
      email_enabled: emailEnabled,
      events_enabled: eventsEnabled,
      reminder_times: reminderTimes,
      deadline_time: deadlineTime,
    })
    .eq("household_id", profile.household_id)

  if (!error) revalidatePath("/app/configuracoes/notificacoes")
  return { error: error?.message }
}
