import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center max-w-5xl mx-auto w-full">
        <span className="text-xl font-bold">Casa em Ordem</span>
        <div className="flex gap-3">
          <Link href="/auth/login" className="text-sm px-4 py-2 border rounded-md">
            Entrar
          </Link>
          <Link href="/auth/cadastro" className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Cadastrar
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center space-y-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">
          Organize as tarefas da sua casa com quem você ama
        </h1>
        <p className="text-lg text-muted-foreground">
          Casa em Ordem é um aplicativo de lista de tarefas compartilhada para casais.
          Crie tarefas, divida responsabilidades e acompanhe a produtividade.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/cadastro"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Começar grátis
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 border rounded-lg font-medium"
          >
            Já tenho conta
          </Link>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        Casa em Ordem © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
