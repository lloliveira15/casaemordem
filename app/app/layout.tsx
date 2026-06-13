import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { AppTheme } from "@/components/layout/app-theme"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let username = "Usuário"
  let isAdmin = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, household:households(admin_id)")
        .eq("id", user.id)
        .single()

      if (profile) {
        username = profile.username ?? "Usuário"
        const household = (profile.household as unknown as { admin_id: string } | undefined)
        isAdmin = household?.admin_id === user.id
      }
    }
  } catch (e) {
    // User may not be authenticated on some pages
  }

  return (
    <div className="app-theme flex min-h-screen bg-background text-foreground">
      <AppTheme />
      <Sidebar username={username} isAdmin={isAdmin} />
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}
