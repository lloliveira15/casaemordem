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

  const tabClass = (href: string) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      href === "/app/configuracoes/notificacoes"
        ? "bg-primary text-primary-foreground"
        : "bg-card text-muted-foreground hover:text-primary border border-border"
    }`

  const inputClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
  const selectClass = "px-3 py-2 border border-input rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <a href="/app/configuracoes" className={tabClass("/app/configuracoes")}>Templates</a>
        <a href="/app/configuracoes/notificacoes" className={tabClass("/app/configuracoes/notificacoes")}>Notificações</a>
        <a href="/app/configuracoes/gerar" className={tabClass("/app/configuracoes/gerar")}>Gerar Tarefas</a>
        <a href="/app/configuracoes/produtividade" className={tabClass("/app/configuracoes/produtividade")}>Produtividade</a>
      </div>

      <h1 className="text-2xl font-extrabold">Notificações</h1>

      <form action={updateNotifSettings} className="space-y-5 max-w-md p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="email_enabled" value="true" defaultChecked={settings?.email_enabled ?? true} className="size-4 accent-primary rounded border-border" />
          <span className="text-sm text-foreground">Notificações por email ativadas</span>
        </label>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Horário do lembrete</label>
          <input type="time" name="reminder_time" defaultValue={settings?.reminder_time ?? "16:00"} className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Frequência do lembrete</label>
          <select name="reminder_freq" defaultValue={settings?.reminder_freq ?? "daily"} className={selectClass}>
            <option value="daily">1x ao dia</option>
            <option value="every2h">A cada 2h</option>
            <option value="every4h">A cada 4h</option>
            <option value="every6h">A cada 6h</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>

        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          Salvar
        </button>
      </form>
    </div>
  )
}
