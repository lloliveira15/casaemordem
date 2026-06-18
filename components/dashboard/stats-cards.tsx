interface StatsProps {
  total: number
  completed: number
  pending: number
  memberCount: number
}

export function StatsCards({ total, completed, pending, memberCount }: StatsProps) {
  const productivity = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats = [
    { value: pending, label: "Pendentes hoje" },
    { value: `${productivity}%`, label: "Produtividade" },
    { value: completed, label: "Concluídas" },
    { value: memberCount, label: "Membros" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-4 space-y-1 hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-150"
        >
          <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
