import { Html, Body, Container, Heading, Text, Link, Button, Section, Hr } from "@react-email/components"

export function InviteEmail({
  senderName,
  inviteCode,
  appUrl,
}: {
  senderName: string
  inviteCode: string
  appUrl: string
}) {
  const inviteUrl = `${appUrl}/auth/cadastro?invite=${encodeURIComponent(inviteCode)}`

  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#F9FAFB", padding: "40px 0" }}>
        <Container style={{ backgroundColor: "#FFFFFF", borderRadius: 12, padding: "40px 32px", maxWidth: 480 }}>
          <Heading style={{ fontSize: 24, color: "#7C3AED", marginBottom: 16, textAlign: "center" }}>
            🌸 Convite para Casa em Ordem
          </Heading>

          <Text style={{ fontSize: 16, color: "#374151", lineHeight: 1.5 }}>
            <strong>{senderName}</strong> te convidou para organizar as tarefas da casa!
          </Text>

          <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 20 }}>
            Com o Casa em Ordem, vocês podem dividir as tarefas, criar listas de compras e manter a casa organizada em parceria.
          </Text>

          <Section style={{ textAlign: "center", marginTop: 28 }}>
            <Button
              href={inviteUrl}
              style={{
                backgroundColor: "#7C3AED",
                color: "#FFFFFF",
                padding: "14px 32px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Aceitar Convite
            </Button>
          </Section>

          <Hr style={{ margin: "28px 0", borderColor: "#E5E7EB" }} />

          <Text style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
            Ou use o código abaixo ao se cadastrar:
          </Text>

          <Text style={{
            fontSize: 28,
            fontWeight: "bold",
            letterSpacing: 6,
            textAlign: "center",
            color: "#7C3AED",
            fontFamily: "monospace",
            margin: "8px 0 0",
          }}>
            {inviteCode}
          </Text>

          <Hr style={{ margin: "28px 0", borderColor: "#E5E7EB" }} />

          <Text style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
            Se você não espera este convite, ignore este email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
