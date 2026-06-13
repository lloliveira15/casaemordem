"use client"

import Link from "next/link"
import { Flower, ListChecks, CalendarBlank } from "phosphor-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-glow">
      <div className="max-w-[1200px] mx-auto px-6 pt-[120px] pb-20 grid md:grid-cols-2 gap-16 items-center min-h-[90vh] relative">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground mb-5">
            Organize as tarefas da sua casa{" "}
            <span className="text-primary">
              com quem você ama
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Chega de listas perdidas no WhatsApp. Organize as tarefas da casa com seu par
            e descubra que dividir o cuidado também aproxima.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/auth/cadastro"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-[var(--shadow-sm)]"
            >
              Criar conta gratuita
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-foreground border border-primary/30 rounded-xl text-base font-semibold hover:border-primary/50 hover:bg-primary/[0.04] hover:text-primary transition-all shadow-[var(--shadow-sm)]"
            >
              Ver funcionalidades
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[420px] bg-card rounded-2xl shadow-[var(--shadow-md)] overflow-hidden border border-border">
            <div className="bg-card px-4 py-3 flex gap-1.5 border-b border-border">
              <span className="size-2.5 rounded-full bg-rose-300" />
              <span className="size-2.5 rounded-full bg-amber-200" />
              <span className="size-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="flex min-h-[280px]">
              <div className="w-12 bg-primary/[0.06] pt-3 pb-3 flex flex-col items-center gap-4">
                <Flower className="size-5 text-primary/80" />
                <div className="size-8 flex items-center justify-center rounded-lg bg-primary/[0.08] text-primary/80">
                  <ListChecks className="size-4" />
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-2.5">
                <div className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <CalendarBlank className="size-4 text-primary/80" /> Hoje
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-border rounded-xl text-xs shadow-[var(--shadow-sm)]">
                  <input type="checkbox" defaultChecked className="accent-primary" />
                  <span className="flex-1 line-through text-muted-foreground">Lavar louça</span>
                  <span className="px-2 py-0.5 bg-secondary border border-border rounded-full text-[11px] text-primary font-semibold">Maria</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-border rounded-xl text-xs shadow-[var(--shadow-sm)]">
                  <input type="checkbox" className="accent-primary" />
                  <span className="flex-1">Aspirar sala</span>
                  <span className="px-2 py-0.5 bg-secondary border border-border rounded-full text-[11px] text-primary font-semibold">João</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-border rounded-xl text-xs shadow-[var(--shadow-sm)]">
                  <input type="checkbox" className="accent-primary" />
                  <span className="flex-1">Regar plantas</span>
                  <span className="px-2 py-0.5 bg-secondary border border-border rounded-full text-[11px] text-primary font-semibold">Maria</span>
                </div>
                <div className="px-3 py-2.5 border border-dashed border-border rounded-xl text-xs text-muted-foreground text-center hover:border-primary/40 transition-colors">
                  + Adicionar tarefa
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-border bg-card flex items-center gap-2.5 text-xs font-semibold text-foreground">
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
              <span>33%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
