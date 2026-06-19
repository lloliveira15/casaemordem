import { createAdminClient } from "@/lib/supabase/admin"
import { getResend } from "@/lib/resend"
import { CompromissoReminder } from "@/emails/compromisso-reminder"

export async function POST() {
  try {
    const supabase = createAdminClient()

    const { data: settings } = await supabase
      .from("notification_settings")
      .select("*, household:households(*), household_members(*)")
      .eq("email_enabled", true)
      .eq("events_enabled", true)

    if (!settings?.length) return Response.json({ sent: 0 })

    const now = new Date()
    let totalSent = 0

    for (const setting of settings) {
      const household = setting.household as unknown as { name: string; id: string }
      const members = setting.household_members as unknown as Array<{ user_id: string; notifications_enabled: boolean }>

      // Check for events in ~1h window (55-65 min from now)
      const window1hStart = new Date(now.getTime() + 55 * 60 * 1000).toISOString()
      const window1hEnd = new Date(now.getTime() + 65 * 60 * 1000).toISOString()

      const { data: events1h } = await supabase
        .from("events")
        .select("*")
        .eq("household_id", household.id)
        .eq("notified_1h", false)
        .gte("event_date_time", window1hStart)
        .lt("event_date_time", window1hEnd)

      if (events1h?.length) {
        for (const event of events1h) {
          for (const member of members) {
            if (!member.notifications_enabled) continue

            const { data: profile } = await supabase
              .from("profiles")
              .select("email, username")
              .eq("id", member.user_id)
              .single()

            if (!profile?.email) continue

            const eventTime = new Date(event.event_date_time)
              .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

            await getResend().emails.send({
              from: process.env.RESEND_FROM ?? "noreply@casaemordem.app",
              to: profile.email,
              subject: `⏰ ${event.description} em 1h`,
              react: CompromissoReminder({
                householdName: household.name ?? "Casa",
                memberName: profile.username,
                description: event.description,
                time: eventTime,
                location: event.location,
                ant: "1h",
              }),
            })

            totalSent++
          }

          await supabase
            .from("events")
            .update({ notified_1h: true })
            .eq("id", event.id)
        }
      }

      // Check for events in ~30min window (25-35 min from now)
      const window30minStart = new Date(now.getTime() + 25 * 60 * 1000).toISOString()
      const window30minEnd = new Date(now.getTime() + 35 * 60 * 1000).toISOString()

      const { data: events30min } = await supabase
        .from("events")
        .select("*")
        .eq("household_id", household.id)
        .eq("notified_30min", false)
        .gte("event_date_time", window30minStart)
        .lt("event_date_time", window30minEnd)

      if (events30min?.length) {
        for (const event of events30min) {
          for (const member of members) {
            if (!member.notifications_enabled) continue

            const { data: profile } = await supabase
              .from("profiles")
              .select("email, username")
              .eq("id", member.user_id)
              .single()

            if (!profile?.email) continue

            const eventTime = new Date(event.event_date_time)
              .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

            await getResend().emails.send({
              from: process.env.RESEND_FROM ?? "noreply@casaemordem.app",
              to: profile.email,
              subject: `⏰ ${event.description} em 30min`,
              react: CompromissoReminder({
                householdName: household.name ?? "Casa",
                memberName: profile.username,
                description: event.description,
                time: eventTime,
                location: event.location,
                ant: "30min",
              }),
            })

            totalSent++
          }

          await supabase
            .from("events")
            .update({ notified_30min: true })
            .eq("id", event.id)
        }
      }
    }

    return Response.json({ sent: totalSent })
  } catch (err) {
    console.error("Cron compromisso error:", err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
