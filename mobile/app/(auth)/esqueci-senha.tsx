import { useState } from "react"
import { useRouter } from "expo-router"
import { YStack, Input, Button, Text } from "tamagui"
import { supabase } from "../../lib/supabase-client"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Informe seu email")
      return
    }

    setLoading(true)
    setError("")

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "casaemordem://resetar-senha",
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$lg" gap="$md">
          <Text fontSize="$xl" fontWeight="bold" color="$primary">
            Email enviado!
          </Text>
          <Text fontSize="$md" color="$textSecondary" textAlign="center">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </Text>
          <Button
            backgroundColor="$primary"
            color="white"
            onPress={() => router.push("/(auth)/login")}
          >
            Voltar ao login
          </Button>
        </YStack>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <YStack flex={1} justifyContent="center" padding="$lg" gap="$md">
        <YStack alignItems="center" marginBottom="$lg">
          <Text fontSize="$2xl" fontWeight="bold" color="$primary">
            Esqueceu a senha?
          </Text>
          <Text fontSize="$sm" color="$textSecondary" textAlign="center">
            Digite seu email e enviaremos instruções para redefinir sua senha.
          </Text>
        </YStack>

        <YStack gap="$xs">
          <Text fontSize="$sm" color="$textSecondary">Email</Text>
          <Input
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </YStack>

        {error && (
          <Text fontSize="$sm" color="$error" textAlign="center">{error}</Text>
        )}

        <Button
          backgroundColor="$primary"
          color="white"
          size="$lg"
          onPress={handleReset}
          disabled={loading}
          opacity={loading ? 0.7 : 1}
        >
          {loading ? "Enviando..." : "Enviar instruções"}
        </Button>

        <Text
          fontSize="$sm"
          color="$primary"
          textAlign="center"
          onPress={() => router.push("/(auth)/login")}
        >
          Voltar ao login
        </Text>
      </YStack>
    </SafeAreaView>
  )
}
