import { useState } from "react"
import { useRouter } from "expo-router"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { YStack, Input, Button, Text, XStack } from "tamagui"
import { registerSchema } from "@casaemordem/shared"
import { supabase } from "../../lib/supabase-client"

interface RegisterFormData {
  username: string
  email: string
  password: string
  phone?: string
  invite_code?: string
}

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", phone: "", invite_code: "" },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { username: data.username, phone: data.phone, invite_code: data.invite_code },
      },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    router.replace("/(auth)/login")
  }

  return (
    <YStack gap="$md" padding="$lg">
      <YStack gap="$xs">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <YStack gap="$xs">
              <Text fontSize="$sm" color="$textSecondary">Nome</Text>
              <Input
                placeholder="Seu nome"
                value={value}
                onChangeText={onChange}
                borderColor={errors.username ? "$error" : "$border"}
              />
              {errors.username && (
                <Text fontSize="$xs" color="$error">{errors.username.message}</Text>
              )}
            </YStack>
          )}
        />
      </YStack>

      <YStack gap="$xs">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <YStack gap="$xs">
              <Text fontSize="$sm" color="$textSecondary">Email</Text>
              <Input
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
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
          render={({ field: { onChange, value } }) => (
            <YStack gap="$xs">
              <Text fontSize="$sm" color="$textSecondary">Senha</Text>
              <Input
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                borderColor={errors.password ? "$error" : "$border"}
              />
              {errors.password && (
                <Text fontSize="$xs" color="$error">{errors.password.message}</Text>
              )}
            </YStack>
          )}
        />
      </YStack>

      <YStack gap="$xs">
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <YStack gap="$xs">
              <Text fontSize="$sm" color="$textSecondary">Telefone (opcional)</Text>
              <Input
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                value={value ?? ""}
                onChangeText={onChange}
              />
            </YStack>
          )}
        />
      </YStack>

      <YStack gap="$xs">
        <Controller
          control={control}
          name="invite_code"
          render={({ field: { onChange, value } }) => (
            <YStack gap="$xs">
              <Text fontSize="$sm" color="$textSecondary">Código de convite (opcional)</Text>
              <Input
                placeholder="abc123"
                autoCapitalize="none"
                value={value ?? ""}
                onChangeText={onChange}
              />
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
        {loading ? "Criando conta..." : "Criar conta"}
      </Button>

      <XStack justifyContent="center" gap="$sm">
        <Text fontSize="$sm" color="$textSecondary">Já tem conta?</Text>
        <Text
          fontSize="$sm"
          color="$primary"
          onPress={() => router.push("/(auth)/login")}
        >
          Faça login
        </Text>
      </XStack>
    </YStack>
  )
}
