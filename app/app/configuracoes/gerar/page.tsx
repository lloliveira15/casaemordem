import { GerarTarefas } from "@/components/tasks/gerar-tarefas"

export default function GerarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Gerar Tarefas</h1>
      <GerarTarefas />
    </div>
  )
}
