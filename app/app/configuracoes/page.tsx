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

  const { data: templates } = await supabase
    .from("task_templates")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("is_active", true)
    .order("frequency")
    .order("day_value")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Templates de Tarefas</h2>
        <TemplateForm />
        <TemplateList templates={templates ?? []} />
      </section>

      <div className="flex gap-2 text-sm">
        <span className="font-medium">Templates</span>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/notificacoes" className="text-primary hover:underline">
          Notificações
        </a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/gerar" className="text-primary hover:underline">
          Gerar Tarefas
        </a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/produtividade" className="text-primary hover:underline">
          Produtividade
        </a>
      </div>
    </div>
  )
}
