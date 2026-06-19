import {
  Html, Body, Container, Heading, Text,
} from "@react-email/components"

export function CompromissoReminder({
  householdName,
  memberName,
  description,
  time,
  location,
  ant,
}: {
  householdName: string
  memberName: string
  description: string
  time: string
  location: string | null
  ant: "1h" | "30min"
}) {
  const label = ant === "1h" ? "1 hora" : "30 minutos"

  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>⏰ Lembrete: {description}</Heading>
          <Text>Olá {memberName},</Text>
          <Text>Falta {label} para o compromisso abaixo:</Text>
          <Text style={{ fontSize: 16, fontWeight: 600 }}>{description}</Text>
          <Text>
            🕐 {time}
            {location && <> · 📍 {location}</>}
          </Text>
          <Text>
            Casa: {householdName}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
