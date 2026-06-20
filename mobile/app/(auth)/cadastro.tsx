import { YStack, Text } from "tamagui"
import { RegisterForm } from "../../components/auth/register-form"
import { SafeAreaView } from "react-native-safe-area-context"

export default function RegisterScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <YStack flex={1} padding="$lg">
        <YStack alignItems="center" marginBottom="$md" marginTop="$lg">
          <Text fontSize="$2xl" fontWeight="bold" color="$primary">
            Criar Conta
          </Text>
          <Text fontSize="$sm" color="$textSecondary">
            Comece a organizar sua casa
          </Text>
        </YStack>
        <RegisterForm />
      </YStack>
    </SafeAreaView>
  )
}
