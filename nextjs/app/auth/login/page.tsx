import { login } from "../actions"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Casa em Ordem</h1>
          <p className="text-muted-foreground">Entre na sua conta</p>
        </div>
        <form action={login as (formData: FormData) => Promise<void>} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Entrar
          </button>
        </form>
        <div className="text-center text-sm space-y-2">
          <a href="/auth/esqueci-senha" className="text-primary hover:underline block">
            Esqueci a senha
          </a>
          <a href="/auth/cadastro" className="text-primary hover:underline block">
            Criar conta
          </a>
        </div>
      </div>
    </div>
  )
}
