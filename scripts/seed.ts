import { config } from "dotenv"
config({ path: ".env.local" })
import { createAdminClient } from "@/lib/supabase/admin"

const SEED_USERS = [
  { email: "seed1@casaemordem.local", password: "seed123456", username: "João" },
  { email: "seed2@casaemordem.local", password: "seed123456", username: "Maria" },
]

const TEMPLATES = [
  { description: "Varrer a sala", room: "Sala", frequency: "daily", day_value: 0 },
  { description: "Lavar banheiro", room: "Banheiro", frequency: "weekly", day_value: 6 },
  { description: "Trocar roupa de cama", room: "Quarto", frequency: "biweekly", day_value: 1 },
  { description: "Limpar geladeira", room: "Cozinha", frequency: "monthly", day_value: 1 },
  { description: "Regar plantas", room: "Varanda", frequency: "daily", day_value: 0 },
  { description: "Passar aspirador", room: "Corredor", frequency: "weekly", day_value: 3 },
]

function formatDate(date: Date) {
  return date.toISOString().split("T")[0]
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

async function getOrCreateUser(admin: ReturnType<typeof createAdminClient>, seed: typeof SEED_USERS[0]) {
  const { data: existing } = await admin.auth.admin.listUsers()
  const found = existing?.users?.find((u) => u.email === seed.email)

  if (found) {
    console.log(`Usuário já existe: ${seed.email} (${found.id})`)
    return found.id
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: seed.email,
    password: seed.password,
    email_confirm: true,
    user_metadata: { username: seed.username },
  })

  if (error) {
    throw new Error(`Erro ao criar usuário ${seed.email}: ${error.message}`)
  }

  if (!data.user) {
    throw new Error(`Usuário não retornado para ${seed.email}`)
  }

  console.log(`Usuário criado: ${seed.email} (${data.user.id})`)
  return data.user.id
}

async function getProfile(admin: ReturnType<typeof createAdminClient>, userId: string) {
  const { data, error } = await admin.from("profiles").select("*").eq("id", userId).single()
  if (error) throw new Error(`Erro ao buscar perfil ${userId}: ${error.message}`)
  return data
}

async function main() {
  const admin = createAdminClient()

  console.log("\n🌱 Iniciando seed de cadastros...\n")

  // 1. Criar usuários
  const userIds = await Promise.all(SEED_USERS.map((u) => getOrCreateUser(admin, u)))

  // 2. Atualizar usernames
  for (let i = 0; i < SEED_USERS.length; i++) {
    const { error } = await admin
      .from("profiles")
      .update({ username: SEED_USERS[i].username })
      .eq("id", userIds[i])
    if (error) throw new Error(`Erro ao atualizar username: ${error.message}`)
  }

  // 3. Buscar household do primeiro usuário (criado automaticamente pelo trigger)
  const adminProfile = await getProfile(admin, userIds[0])
  if (!adminProfile.household_id) {
    throw new Error("Household não foi criado automaticamente para o primeiro usuário")
  }

  const householdId = adminProfile.household_id
  console.log(`Household: ${householdId}`)

  // 4. Adicionar segundo usuário ao household
  const memberProfile = await getProfile(admin, userIds[1])
  if (memberProfile.household_id !== householdId) {
    const { error: memberError } = await admin.from("household_members").insert({
      household_id: householdId,
      user_id: userIds[1],
      role: "member",
    })
    if (memberError) {
      console.warn(`Membro já pode existir: ${memberError.message}`)
    } else {
      console.log(`Membro adicionado: ${SEED_USERS[1].email}`)
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update({ household_id: householdId })
      .eq("id", userIds[1])
    if (updateError) throw new Error(`Erro ao atualizar household_id: ${updateError.message}`)
  }

  // 5. Atualizar nome da casa
  const { error: householdError } = await admin
    .from("households")
    .update({ name: "Nosso Apê" })
    .eq("id", householdId)
  if (householdError) throw new Error(`Erro ao atualizar household: ${householdError.message}`)

  // 6. Criar templates
  const { data: existingTemplates } = await admin
    .from("task_templates")
    .select("id")
    .eq("household_id", householdId)

  let templateIds: string[] = []
  if (existingTemplates && existingTemplates.length > 0) {
    console.log(`Templates já existem: ${existingTemplates.length}`)
    templateIds = existingTemplates.map((t) => t.id)
  } else {
    const { data: inserted, error: templateError } = await admin
      .from("task_templates")
      .insert(
        TEMPLATES.map((t) => ({
          household_id: householdId,
          ...t,
          assigned_to: userIds[Math.floor(Math.random() * userIds.length)],
        }))
      )
      .select("id")
    if (templateError) throw new Error(`Erro ao criar templates: ${templateError.message}`)
    templateIds = inserted?.map((t) => t.id) || []
    console.log(`Templates criados: ${templateIds.length}`)
  }

  // 7. Criar tarefas para hoje, ontem e amanhã
  const today = new Date()
  const taskDates = [addDays(today, -1), today, addDays(today, 1), addDays(today, 2)]

  const { data: existingTasks } = await admin
    .from("tasks")
    .select("id")
    .eq("household_id", householdId)

  if (existingTasks && existingTasks.length > 0) {
    console.log(`Tarefas já existem: ${existingTasks.length}`)
  } else {
    const tasksToInsert = []
    for (const date of taskDates) {
      for (let i = 0; i < TEMPLATES.length; i++) {
        const template = TEMPLATES[i]
        const assignedTo = userIds[Math.floor(Math.random() * userIds.length)]
        tasksToInsert.push({
          household_id: householdId,
          template_id: templateIds[i],
          description: template.description,
          room: template.room,
          assigned_to: assignedTo,
          due_date: formatDate(date),
          completed: Math.random() > 0.7,
          completed_by: Math.random() > 0.7 ? assignedTo : null,
          completed_at: Math.random() > 0.7 ? new Date().toISOString() : null,
        })
      }
    }

    const { error: tasksError } = await admin.from("tasks").insert(tasksToInsert)
    if (tasksError) throw new Error(`Erro ao criar tarefas: ${tasksError.message}`)
    console.log(`Tarefas criadas: ${tasksToInsert.length}`)
  }

  console.log("\n✅ Seed concluído!")
  console.log("\nCredenciais de teste:")
  SEED_USERS.forEach((u) => {
    console.log(`  ${u.username}: ${u.email} / ${u.password}`)
  })
}

main().catch((err) => {
  console.error("\n❌ Seed falhou:", err)
  process.exit(1)
})
