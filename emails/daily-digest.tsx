import {
  Html, Body, Container, Heading, Text, Section,
} from "@react-email/components"

interface TaskItem {
  description: string
  room: string | null
}

export function DailyDigest({
  householdName,
  memberName,
  tasks,
}: {
  householdName: string
  memberName: string
  tasks: TaskItem[]
}) {
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>🏠 {householdName}</Heading>
          <Text>Olá {memberName},</Text>
          <Text>Aqui estão as tarefas pendentes para hoje:</Text>
          <Section>
            {tasks.map((t, i) => (
              <Text key={i}>
                ☐ {t.description}
                {t.room && <span style={{ color: "#666" }}> ({t.room})</span>}
              </Text>
            ))}
          </Section>
          {tasks.length === 0 && <Text>Nenhuma tarefa pendente! 🎉</Text>}
        </Container>
      </Body>
    </Html>
  )
}
