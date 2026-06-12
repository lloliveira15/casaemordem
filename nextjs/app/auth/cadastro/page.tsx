"use client"

import { useActionState } from "react"
import { register } from "../actions"

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, { error: undefined as string | undefined })

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-muted-foreground">Organize sua casa com seu parceiro(a)</p>
        </div>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Nome</label>
            <input id="username" name="username" type="text" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone (opcional)</label>
            <input id="phone" name="phone" type="tel" className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="invite_code" className="block text-sm font-medium mb-1">Código de convite (opcional)</label>
            <input id="invite_code" name="invite_code" type="text" className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}
          <button type="submit" disabled={pending} className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50">
            {pending ? "Criando..." : "Criar conta"}
          </button>
        </form>
        <div className="text-center">
          <a href="/auth/login" className="text-sm text-primary hover:underline">
            Já tem conta? Entrar
          </a>
        </div>
      </div>
    </div>
  )
}
