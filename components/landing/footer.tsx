"use client"

import Link from "next/link"
import { Flower } from "phosphor-react"

export function LandingFooter() {
  return (
    <footer className="bg-card/70 border-t border-border pt-16 pb-6 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold text-primary flex items-center gap-2 mb-3">
            <Flower className="text-primary size-6" />
            Casa em Ordem
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
            Organize as tarefas da sua casa com quem você ama.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground mb-4">Produto</h4>
          {[
            ["Funcionalidades", "#features"],
            ["Planos", "#plans"],
            ["Entrar", "/auth/login"],
          ].map(([label, href]) => (
            <Link
              key={label as string}
              href={href as string}
              className="block text-sm text-muted-foreground mb-2.5 hover:text-primary transition-colors"
            >
              {label as string}
            </Link>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground mb-4">Suporte</h4>
          {["Central de ajuda", "Contato", "Status"].map((label) => (
            <a
              key={label}
              href="#"
              className="block text-sm text-muted-foreground mb-2.5 hover:text-primary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground mb-4">Legal</h4>
          {["Privacidade", "Termos"].map((label) => (
            <a
              key={label}
              href="#"
              className="block text-sm text-muted-foreground mb-2.5 hover:text-primary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto pt-6 border-t border-border text-center text-xs text-muted-foreground/70">
        &copy; {new Date().getFullYear()} Casa em Ordem. Todos os direitos reservados.
      </div>
    </footer>
  )
}
