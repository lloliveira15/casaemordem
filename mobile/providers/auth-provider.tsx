import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase-client"

interface AuthState {
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setState({
          session,
          isLoading: false,
          isAuthenticated: !!session,
        })
      })
      .catch(() => {
        setState({ session: null, isLoading: false, isAuthenticated: false })
      })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        session,
        isLoading: false,
        isAuthenticated: !!session,
      })
    })

    return () => subscription?.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setState({
      session: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
