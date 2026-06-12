"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(
      form.get("email") as string,
      { redirectTo: `${location.origin}/auth/resetar-senha` }
    )
    if (!error) setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Email enviado!</h1>
          <p className="text-muted-foreground">Verifique sua caixa de entrada para redefinir sua senha.</p>
          <a href="/auth/login" className="text-primary hover:underline block">Voltar ao login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Enviar link de recuperação
          </button>
        </form>
        <div className="text-center">
          <a href="/auth/login" className="text-sm text-primary hover:underline">Voltar ao login</a>
        </div>
      </div>
    </div>
  )
}
