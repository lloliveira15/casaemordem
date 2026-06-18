import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, household_id")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) redirect("/auth/login")

  const { data: currentHousehold } = await supabase
    .from("households")
    .select("id, name, admin_id")
    .eq("id", profile.household_id)
    .single()

  if (!currentHousehold) redirect("/auth/login")

  const { data: memberships } = await supabase
    .from("household_members")
    .select("household_id, household:households!inner(name)")
    .eq("user_id", user.id)

  const households = (memberships ?? []).map(m => ({
    id: m.household_id,
    name: (m.household as unknown as { name: string })?.name ?? "Casa",
  }))

  const { data: member } = await supabase
    .from("household_members")
    .select("role")
    .eq("household_id", profile.household_id)
    .eq("user_id", user.id)
    .single()

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar
        username={profile.username}
        isAdmin={currentHousehold.admin_id === user.id || member?.role === "admin"}
        currentHousehold={{ id: currentHousehold.id, name: currentHousehold.name }}
        households={households}
      />
      <main className="flex-1 p-6 pb-20 md:pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
