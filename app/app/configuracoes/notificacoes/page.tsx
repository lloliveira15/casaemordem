import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NotificationsForm } from "./notifications-form"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const { data: settings } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("household_id", profile?.household_id)
    .single()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Notificações</h1>
      <NotificationsForm
        settings={{
          email_enabled: settings?.email_enabled ?? true,
          reminder_times: settings?.reminder_times ?? ["08:00", "14:00", "18:00"],
          deadline_time: settings?.deadline_time ?? "21:00",
        }}
      />
    </div>
  )
}
