import { YStack, Text } from "tamagui"
import { LoginForm } from "../../components/auth/login-form"
import { SafeAreaView } from "react-native-safe-area-context"

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <YStack flex={1} justifyContent="center" padding="$lg">
        <YStack alignItems="center" marginBottom="$xl">
          <Text fontSize="$3xl" fontWeight="bold" color="$primary">
            Casa em Ordem
          </Text>
          <Text fontSize="$md" color="$textSecondary">
            Organize sua casa em parceria
          </Text>
        </YStack>
        <LoginForm />
      </YStack>
    </SafeAreaView>
  )
}
