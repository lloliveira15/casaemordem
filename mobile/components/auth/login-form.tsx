import { useState } from "react"
import { useRouter } from "expo-router"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { YStack, Input, Button, Text, XStack } from "tamagui"
import { loginSchema } from "../../modules/shared"
import { supabase } from "../../lib/supabase-client"

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Email ou senha incorretos"
        : authError.message
      )
      return
    }

    router.replace("/(tabs)/dashboard")
  }

  return (
    <YStack gap="$md" padding="$lg">
      <YStack gap="$xs">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <YStack gap="$xs">
              <Text fontSize="$sm" color="$textSecondary">Email</Text>
              <Input
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                borderColor={errors.email ? "$error" : "$border"}
              />
              {errors.email && (
                <Text fontSize="$xs" color="$error">{errors.email.message}</Text>
              )}
            </YStack>
          )}
        />
      </YStack>

      <YStack gap="$xs">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <YStack gap="$xs">
              <Text fontSize="$sm" color="$textSecondary">Senha</Text>
              <Input
                placeholder="Sua senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                borderColor={errors.password ? "$error" : "$border"}
              />
              {errors.password && (
                <Text fontSize="$xs" color="$error">{errors.password.message}</Text>
              )}
            </YStack>
          )}
        />
      </YStack>

      {error && (
        <Text fontSize="$sm" color="$error" textAlign="center">{error}</Text>
      )}

      <Button
        backgroundColor="$primary"
        color="white"
        size="$lg"
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        opacity={loading ? 0.7 : 1}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <XStack justifyContent="center" gap="$sm">
        <Text fontSize="$sm" color="$textSecondary">Não tem conta?</Text>
        <Text
          fontSize="$sm"
          color="$primary"
          onPress={() => router.push("/(auth)/cadastro")}
        >
          Cadastre-se
        </Text>
      </XStack>

      <Text
        fontSize="$sm"
        color="$primary"
        textAlign="center"
        onPress={() => router.push("/(auth)/esqueci-senha")}
      >
        Esqueceu a senha?
      </Text>
    </YStack>
  )
}
