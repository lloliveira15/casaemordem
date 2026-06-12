import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InviteSection } from "@/components/members/invite-section"
import { MemberCard } from "@/components/members/member-card"

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, household:households(*)")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) redirect("/auth/login")

  const { data: members } = await supabase
    .from("household_members")
    .select("*, profile:profiles!user_id(*)")
    .eq("household_id", profile.household_id)

  const household = profile.household as unknown as { invite_code: string; name: string; admin_id: string }
  const isAdmin = household.admin_id === user.id

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Membros</h1>

      <InviteSection inviteCode={household.invite_code} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Membros ({members?.length ?? 0})</h2>
        {members?.map((m) => {
          const memberProfile = m.profile as unknown as { id: string; username: string; email: string; phone: string | null }
          return (
            <MemberCard
              key={m.user_id}
              member={{
                user_id: m.user_id,
                username: memberProfile.username,
                email: memberProfile.email,
                phone: memberProfile.phone,
                role: m.role,
                notifications_enabled: m.notifications_enabled,
              }}
              isAdmin={isAdmin}
            />
          )
        })}
      </div>
    </div>
  )
}
