import "react-native-get-random-values"
import { createClient } from "@supabase/supabase-js"
import { AppState } from "react-native"
import * as SecureStore from "expo-secure-store"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: async (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value)
  },
  removeItem: async (key: string) => {
    return SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
