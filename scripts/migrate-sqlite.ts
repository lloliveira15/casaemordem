import Database from "better-sqlite3"
import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { randomUUID } from "crypto"

config({ path: "../.env" })

const sqlite = new Database(process.env.OLD_DB_PATH || "../db.sqlite3")
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

const userMap = new Map<number, string>()
const householdMap = new Map<number, string>()
const templateMap = new Map<number, string>()

async function migrate() {
  console.log("Starting migration...")

  const users = sqlite.prepare("SELECT * FROM users").all() as any[]
  for (const u of users) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: "temp-" + randomUUID().slice(0, 8),
      email_confirm: true,
      user_metadata: { username: u.username },
    })
    if (authError) {
      console.error(`Failed to create auth user ${u.email}:`, authError.message)
      continue
    }
    userMap.set(u.id, authUser.user.id)

    await supabase
      .from("profiles")
      .update({ phone: u.phone, role: u.role })
      .eq("id", authUser.user.id)
  }
  console.log(`Migrated ${userMap.size} users`)

  const households = sqlite.prepare("SELECT * FROM households").all() as any[]
  for (const h of households) {
    const adminId = userMap.get(h.admin_id)
    if (!adminId) continue
    const newId = randomUUID()
    householdMap.set(h.id, newId)
    await supabase.from("households").insert({
      id: newId,
      name: h.name,
      admin_id: adminId,
      invite_code: h.invite_code,
      created_at: h.created_at,
    })
  }
  console.log(`Migrated ${householdMap.size} households`)

  const members = sqlite.prepare("SELECT * FROM household_members").all() as any[]
  for (const m of members) {
    const newHouseholdId = householdMap.get(m.household_id)
    const newUserId = userMap.get(m.user_id)
    if (!newHouseholdId || !newUserId) continue
    await supabase.from("household_members").insert({
      household_id: newHouseholdId,
      user_id: newUserId,
      role: m.role,
      notifications_enabled: m.notifications_enabled === 1,
      joined_at: m.joined_at,
    })
  }
  console.log(`Migrated ${members.length} household_members`)

  for (const u of users) {
    const newUserId = userMap.get(u.id)
    const newHouseholdId = u.household_id ? householdMap.get(u.household_id) : null
    if (newUserId && newHouseholdId) {
      await supabase.from("profiles").update({ household_id: newHouseholdId }).eq("id", newUserId)
    }
  }

  const templates = sqlite.prepare("SELECT * FROM task_templates").all() as any[]
  for (const t of templates) {
    const newHouseholdId = householdMap.get(t.household_id)
    if (!newHouseholdId) continue
    const newId = randomUUID()
    templateMap.set(t.id, newId)
    await supabase.from("task_templates").insert({
      id: newId,
      household_id: newHouseholdId,
      description: t.description,
      room: t.room,
      assigned_to: t.assigned_to,
      frequency: t.frequency,
      day_value: t.day_value,
      is_active: t.is_active === 1,
      created_at: t.created_at,
    })
  }
  console.log(`Migrated ${templateMap.size} task_templates`)

  const tasks = sqlite.prepare("SELECT * FROM tasks").all() as any[]
  let taskCount = 0
  for (const task of tasks) {
    const newHouseholdId = householdMap.get(task.household_id)
    if (!newHouseholdId) continue
    await supabase.from("tasks").insert({
      household_id: newHouseholdId,
      template_id: task.template_id ? templateMap.get(task.template_id) : null,
      description: task.description,
      room: task.room,
      assigned_to: task.assigned_to,
      due_date: task.due_date,
      completed: task.completed === 1,
      completed_by: task.completed_by ? userMap.get(task.completed_by) : null,
      completed_at: task.completed_at,
      created_at: task.created_at,
    })
    taskCount++
  }
  console.log(`Migrated ${taskCount} tasks`)

  const events = sqlite.prepare("SELECT * FROM events").all() as any[]
  for (const event of events) {
    const newHouseholdId = householdMap.get(event.household_id)
    const newCreatorId = userMap.get(event.created_by)
    if (!newHouseholdId || !newCreatorId) continue
    await supabase.from("events").insert({
      household_id: newHouseholdId,
      created_by: newCreatorId,
      description: event.description,
      event_date_time: event.event_date_time,
      completed: event.completed === 1,
      completed_by: event.completed_by ? userMap.get(event.completed_by) : null,
      completed_at: event.completed_at,
      created_at: event.created_at,
    })
  }
  console.log(`Migrated ${events.length} events`)

  const notifSettings = sqlite.prepare("SELECT * FROM notification_settings").all() as any[]
  for (const ns of notifSettings) {
    const newHouseholdId = householdMap.get(ns.household_id)
    if (!newHouseholdId) continue
    await supabase.from("notification_settings").insert({
      household_id: newHouseholdId,
      email_enabled: ns.email_enabled === 1,
      reminder_time: ns.reminder_time,
      reminder_freq: ns.reminder_freq,
      created_at: ns.created_at,
    })
  }
  console.log(`Migrated ${notifSettings.length} notification_settings`)

  console.log("Migration complete!")
  sqlite.close()
}

migrate().catch(console.error)
