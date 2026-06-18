import { Html, Body, Container, Heading, Text, Link } from "@react-email/components"

export function InviteEmail({
  senderName,
  inviteCode,
  appUrl,
}: {
  senderName: string
  inviteCode: string
  appUrl: string
}) {
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>🏠 Convite para Casa em Ordem</Heading>
          <Text>
            {senderName} te convidou para organizar as tarefas da casa!
          </Text>
          <Text>Use o código abaixo ao se cadastrar:</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", letterSpacing: 4 }}>
            {inviteCode}
          </Text>
          <Link href={appUrl}>
            Acessar Casa em Ordem
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
