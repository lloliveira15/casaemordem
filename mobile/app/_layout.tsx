import { useEffect } from "react"
import { Stack, useRouter, useSegments } from "expo-router"
import { TamaguiProvider, Theme } from "tamagui"
import appConfig from "../tamagui.config"
import { AuthProvider, useAuth } from "../providers"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const segmentsPath = segments.join("/")

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login")
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/dashboard")
    }
  }, [isAuthenticated, isLoading, segmentsPath])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={appConfig} defaultTheme="light">
      <Theme name="light">
        <SafeAreaProvider>
          <AuthProvider>
            <RootLayoutNav />
            <StatusBar style="dark" />
          </AuthProvider>
        </SafeAreaProvider>
      </Theme>
    </TamaguiProvider>
  )
}
