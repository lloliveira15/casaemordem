import { createAdminClient } from "@/lib/supabase/admin"
import { getResend } from "@/lib/resend"
import { DailyDigest } from "@/emails/daily-digest"

export async function POST() {
  try {
    const supabase = createAdminClient()

    const { data: settings } = await supabase
      .from("notification_settings")
      .select("*, household:households(*), household_members(*)")
      .eq("email_enabled", true)

    if (!settings?.length) return Response.json({ sent: 0 })

    const today = new Date().toISOString().split("T")[0]

    let totalSent = 0

    for (const setting of settings) {
      const household = setting.household as unknown as { name: string; id: string }
      const members = setting.household_members as unknown as Array<{ user_id: string; notifications_enabled: boolean }>

      const { data: tasks } = await supabase
        .from("tasks")
        .select("description, room")
        .eq("household_id", household.id)
        .eq("due_date", today)
        .eq("completed", false)

      for (const member of members) {
        if (!member.notifications_enabled) continue

        const { data: profile } = await supabase
          .from("profiles")
          .select("email, username")
          .eq("id", member.user_id)
          .single()

        if (!profile?.email) continue

        await getResend().emails.send({
          from: process.env.RESEND_FROM ?? "noreply@casaemordem.com.br",
          to: profile.email,
          subject: `🏠 Tarefas de hoje - ${household.name ?? "Casa"}`,
          react: DailyDigest({
            householdName: household.name ?? "Casa",
            memberName: profile.username,
            tasks: (tasks ?? []) as Array<{ description: string; room: string | null }>,
          }),
        })

        totalSent++
      }
    }

    return Response.json({ sent: totalSent })
  } catch (err) {
    console.error("Cron email error:", err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
