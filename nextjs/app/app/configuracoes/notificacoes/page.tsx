import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { updateNotifSettings } from "@/lib/actions/notifications"

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
      <div className="flex gap-2 text-sm">
        <a href="/app/configuracoes" className="text-primary hover:underline">Templates</a>
        <span aria-hidden>·</span>
        <span className="font-medium">Notificações</span>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/gerar" className="text-primary hover:underline">Gerar Tarefas</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/produtividade" className="text-primary hover:underline">Produtividade</a>
      </div>

      <h1 className="text-2xl font-bold">Notificações</h1>

      <form action={updateNotifSettings} className="space-y-4 max-w-md">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="email_enabled"
            value="true"
            defaultChecked={settings?.email_enabled ?? true}
          />
          <span className="text-sm">Notificações por email ativadas</span>
        </label>

        <div>
          <label className="text-sm font-medium block mb-1">Horário do lembrete</label>
          <input
            type="time"
            name="reminder_time"
            defaultValue={settings?.reminder_time ?? "16:00"}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Frequência do lembrete</label>
          <select
            name="reminder_freq"
            defaultValue={settings?.reminder_freq ?? "daily"}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>

        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          Salvar
        </button>
      </form>
    </div>
  )
}
