import { useState, useEffect } from "react"
import { useRouter } from "expo-router"
import { YStack, Input, Button, Text } from "tamagui"
import { supabase } from "../../lib/supabase-client"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ResetPasswordScreen() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/(auth)/login")
      }
    })
  }, [])

  const handleReset = async () => {
    if (password.length < 6) {
      setError("Mínimo 6 caracteres")
      return
    }
    if (password !== confirmPassword) {
      setError("Senhas não conferem")
      return
    }

    setLoading(true)
    setError("")

    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    router.replace("/(auth)/login")
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <YStack flex={1} justifyContent="center" padding="$lg" gap="$md">
        <YStack alignItems="center" marginBottom="$lg">
          <Text fontSize="$2xl" fontWeight="bold" color="$primary">
            Redefinir senha
          </Text>
          <Text fontSize="$sm" color="$textSecondary">
            Digite sua nova senha
          </Text>
        </YStack>

        <YStack gap="$xs">
          <Text fontSize="$sm" color="$textSecondary">Nova senha</Text>
          <Input
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </YStack>

        <YStack gap="$xs">
          <Text fontSize="$sm" color="$textSecondary">Confirmar senha</Text>
          <Input
            placeholder="Repita a senha"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </YStack>
    </SafeAreaView>
  )
}
