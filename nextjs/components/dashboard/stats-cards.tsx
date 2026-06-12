import { Card, CardContent } from "@/components/ui/card"

interface StatsProps {
  total: number
  completed: number
  pending: number
  memberCount: number
}

export function StatsCards({ total, completed, pending, memberCount }: StatsProps) {
  const productivity = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center space-y-1">
          <p className="text-3xl font-bold">{pending}</p>
          <p className="text-xs text-muted-foreground">Pendentes hoje</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center space-y-1">
          <p className="text-3xl font-bold">{productivity}%</p>
          <p className="text-xs text-muted-foreground">Produtividade</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center space-y-1">
          <p className="text-3xl font-bold">{completed}</p>
          <p className="text-xs text-muted-foreground">Concluídas</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center space-y-1">
          <p className="text-3xl font-bold">{memberCount}</p>
          <p className="text-xs text-muted-foreground">Membros</p>
        </CardContent>
      </Card>
    </div>
  )
}
