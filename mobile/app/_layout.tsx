import { useEffect } from "react"
import { Stack, useRouter, useSegments } from "expo-router"
import { TamaguiProvider } from "tamagui"
import { useFonts } from "expo-font"
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans"
import appConfig from "../tamagui.config"
import { AuthProvider, useAuth } from "../providers"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { View, ActivityIndicator } from "react-native"

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF5FF" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    )
  }

  return (
    <TamaguiProvider config={appConfig} defaultTheme="light">
      <SafeAreaProvider>
        <AuthProvider>
          <RootLayoutNav />
          <StatusBar style="dark" />
        </AuthProvider>
      </SafeAreaProvider>
    </TamaguiProvider>
  )
}
