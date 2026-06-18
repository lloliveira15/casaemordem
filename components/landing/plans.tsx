"use client"

import Link from "next/link"
import { Check, X, Tag } from "phosphor-react"

export function Plans() {
  return (
    <section id="plans" className="py-24 px-6 max-w-[900px] mx-auto">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card text-primary border border-border rounded-full text-sm font-semibold mb-4">
          <Tag className="size-4" /> Planos
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Escolha o plano ideal para você
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Comece grátis e faça upgrade quando precisar de mais
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-card rounded-2xl p-10 border border-border shadow-[var(--shadow-sm)]">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">Grátis</div>
          <div className="text-5xl font-extrabold text-foreground mb-6">
            R$ 0<span className="text-base font-normal text-muted-foreground">/mês</span>
          </div>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Até 2 membros", true],
              ["Templates básicos", true],
              ["Notificações diárias", true],
              ["Convite por código", true],
              ["Membros ilimitados", false],
              ["Relatórios avançados", false],
              ["Suporte prioritário", false],
            ].map(([label, included]) => (
              <li key={label as string} className="flex items-center gap-2.5 text-sm text-foreground">
                {included ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <X className="size-4 text-muted-foreground" />
                )}
                {label as string}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/cadastro"
            className="block text-center py-3 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Começar grátis
          </Link>
        </div>

        <div className="bg-card rounded-2xl p-10 border-2 border-primary/30 shadow-[var(--shadow-md)] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            Mais Popular
          </div>
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">Premium</div>
          <div className="text-5xl font-extrabold text-foreground mb-6">
            Em breve<span className="text-base font-normal text-muted-foreground" />
          </div>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Membros ilimitados", true],
              ["Templates avançados", true],
              ["Notificações personalizadas", true],
              ["Relatórios de produtividade", true],
              ["Suporte prioritário", true],
              ["Histórico completo", true],
              ["Exportação de dados", true],
            ].map(([label, included]) => (
              <li key={label as string} className="flex items-center gap-2.5 text-sm text-foreground">
                {included ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <X className="size-4 text-muted-foreground" />
                )}
                {label as string}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/login"
            className="block text-center py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Lista de espera
          </Link>
        </div>
      </div>
    </section>
  )
}
