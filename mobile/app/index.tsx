import { ActivityIndicator, View } from "react-native"
import { Redirect } from "expo-router"
import { useAuth } from "../providers"

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF5FF" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    )
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />
  }

  return <Redirect href="/(auth)/login" />
}
