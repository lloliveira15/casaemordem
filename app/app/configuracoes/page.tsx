import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateForm } from "@/components/templates/template-form"
import { TemplateList } from "@/components/templates/template-list"

export default async function ConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const { data: rooms } = await supabase
    .from("rooms")
    .select("name")
    .eq("household_id", profile.household_id)
    .order("name")

  const roomNames = rooms?.map(r => r.name) ?? []

  const { data: rawMembers } = await supabase
    .from("household_members")
    .select("id, user_id")
    .eq("household_id", profile.household_id)

  const memberIds = rawMembers?.map(m => m.user_id) ?? []
  const { data: memberProfiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", memberIds.length > 0 ? memberIds : [user.id])

  const profileMap = new Map(memberProfiles?.map(p => [p.id, p]) ?? [])
  const members = (rawMembers ?? []).map(m => ({
    id: m.id,
    username: profileMap.get(m.user_id)?.username ?? "Usuário",
  }))

  const { data: templates } = await supabase
    .from("task_templates")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("is_active", true)
    .order("frequency")
    .order("day_value")

  const tabClass = (href: string) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      href === "/app/configuracoes"
        ? "bg-primary text-primary-foreground"
        : "bg-card text-muted-foreground hover:text-primary border border-border"
    }`

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Configurações</h1>

      <div className="flex flex-wrap gap-2">
        <a href="/app/configuracoes" className={tabClass("/app/configuracoes")}>Tarefas Programadas</a>
        <a href="/app/configuracoes/notificacoes" className={tabClass("/app/configuracoes/notificacoes")}>Notificações</a>
        <a href="/app/configuracoes/gerar" className={tabClass("/app/configuracoes/gerar")}>Gerar Tarefas</a>
      </div>

      <section className="space-y-4 p-5 bg-card border border-border rounded-2xl shadow-[var(--shadow-sm)]">
        <h2 className="text-lg font-semibold">Tarefas Programadas</h2>
        <TemplateForm rooms={roomNames} members={members} />
        <TemplateList templates={templates ?? []} />
      </section>
    </div>
  )
}
