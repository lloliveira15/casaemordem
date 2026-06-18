"use client"

import { ListChecks, ClipboardText, Bell, ChartBar, QrCode, CalendarPlus, Star } from "phosphor-react"

const features = [
  { icon: ListChecks, title: "Tarefas Diárias", desc: "Crie e gerencie tarefas por data, ambiente e responsável. Visualize o que precisa ser feito hoje, amanhã ou na semana." },
  { icon: ClipboardText, title: "Templates Personalizáveis", desc: "Crie modelos de tarefas recorrentes por ambiente e frequência. Economize tempo não precisando digitar sempre as mesmas tarefas." },
  { icon: Bell, title: "Notificações por Email", desc: "Receba lembretes diários das tarefas pendentes. Configure a frequência e o horário ideal para você e seu parceiro." },
  { icon: ChartBar, title: "Produtividade por Membro", desc: "Acompanhe a taxa de conclusão de cada membro da casa. Veja quem está contribuindo mais com gráficos claros." },
  { icon: QrCode, title: "Convite por QR Code", desc: "Compartilhe o código da sua casa com outros membros via QR Code, link ou email. Convidar é rápido e prático." },
  { icon: CalendarPlus, title: "Geração Automática", desc: "Gere tarefas para o mês, semana ou dia baseado nos seus templates. Repita tarefas de períodos anteriores com um clique." },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card text-primary border border-border rounded-full text-sm font-semibold mb-4">
          <Star className="size-4" /> Funcionalidades
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Tudo que você precisa para manter a casa em ordem
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Ferramentas simples e poderosas para dividir as tarefas domésticas com transparência
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="bg-card rounded-2xl p-8 border border-border hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all">
            <div className="size-12 flex items-center justify-center bg-primary/[0.06] rounded-2xl text-primary mb-4">
              <f.icon className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
