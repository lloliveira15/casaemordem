"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = form.get("password") as string
    const confirm = form.get("confirm") as string

    if (password !== confirm) { setError("Senhas não conferem"); return }
    if (password.length < 6) { setError("Mínimo 6 caracteres"); return }

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) { setError(updateError.message); return }
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Nova Senha</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Nova senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium mb-1">Confirmar senha</label>
            <input id="confirm" name="confirm" type="password" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  )
}
