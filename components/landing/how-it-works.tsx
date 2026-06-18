"use client"

import { UserPlus, ArrowsLeftRight, ChartPie } from "phosphor-react"

const steps = [
  {
    icon: UserPlus,
    title: "Convide seu par",
    desc: "Crie sua casa e convide quem divide o lar com você. Basta enviar um convite por QR Code, link ou email.",
  },
  {
    icon: ArrowsLeftRight,
    title: "Distribuam as tarefas",
    desc: "Montem juntos a lista de tarefas, definam responsáveis, frequência e prazos. Nada de um fazer mais que o outro.",
  },
  {
    icon: ChartPie,
    title: "Acompanhem o progresso",
    desc: "Veja quem fez o quê com relatórios de produtividade. Lembretes automáticos mantêm todo mundo alinhado.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 max-w-[1000px] mx-auto">
      <div className="text-center max-w-[640px] mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card text-primary border border-border rounded-full text-sm font-semibold mb-4">
          Como funciona
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Em 3 passos sua casa fica em ordem
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Simples, rápido e sem complicação
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="text-center">
            <div className="size-16 mx-auto flex items-center justify-center bg-primary/[0.06] text-primary rounded-2xl mb-5">
              <s.icon className="size-7" />
            </div>
            <div className="w-8 h-0.5 bg-accent/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
