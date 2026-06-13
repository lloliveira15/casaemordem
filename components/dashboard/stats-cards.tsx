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
          className="border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
        >
          <CardContent className="p-5 space-y-2">
            <div className="size-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center mx-auto">
              <p className="text-2xl font-extrabold text-[#A78BFA]">{stat.value}</p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6B5B8D]">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
