import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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
    .select("*")
    .eq("household_id", profile.household_id)

  const memberUserIds = members?.map((m) => m.user_id) ?? []

  // Use admin client to fetch member profiles because RLS policies currently
  // restrict viewing other household members' profiles.
  const admin = createAdminClient()
  const { data: memberProfiles } = await admin
    .from("profiles")
    .select("id, username, email, phone")
    .in("id", memberUserIds.length > 0 ? memberUserIds : [user.id])

  const profileById = new Map(
    memberProfiles?.map((p) => [p.id, p]) ?? []
  )

  const household = profile.household as unknown as { id: string; invite_code: string; name: string; admin_id: string }
  const isAdmin = household.admin_id === user.id

  // Ensure the household always has an invite code when visiting this page.
  let inviteCode = household.invite_code
  if (!inviteCode) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    inviteCode = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")

    await admin
      .from("households")
      .update({ invite_code: inviteCode })
      .eq("id", household.id)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Membros</h1>

      <InviteSection inviteCode={inviteCode} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Membros ({members?.length ?? 0})</h2>
        {members?.map((m) => {
          const memberProfile = profileById.get(m.user_id)
          return (
            <MemberCard
              key={m.user_id}
              member={{
                user_id: m.user_id,
                username: memberProfile?.username ?? "Usuário",
                email: memberProfile?.email ?? "",
                phone: memberProfile?.phone ?? null,
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
