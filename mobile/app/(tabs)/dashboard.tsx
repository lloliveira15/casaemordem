import { YStack, Text, Button } from "tamagui"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../../providers"

export default function DashboardScreen() {
  const { signOut } = useAuth()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$lg" padding="$lg">
        <Text fontSize="$2xl" fontWeight="bold" color="$primary">
          Casa em Ordem
        </Text>
        <Text fontSize="$md" color="$textSecondary">
          Dashboard - Em construção
        </Text>
        <Button
          backgroundColor="$error"
          color="white"
          onPress={signOut}
        >
          Sair
        </Button>
      </YStack>
    </SafeAreaView>
  )
}
