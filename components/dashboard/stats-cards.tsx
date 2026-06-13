import { Card, CardContent } from "@/components/ui/card"

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all"
        >
          <CardContent className="p-5 text-center space-y-1">
            <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
