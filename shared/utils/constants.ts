export const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  monthly: "Mensal",
}

export const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "monthly", label: "Mensal" },
]

export const ROOM_COLORS: Record<string, string> = {
  Cozinha: "#F97316",
  Quarto: "#3B82F6",
  Sala: "#7C3AED",
  Banheiro: "#06B6D4",
  Varanda: "#22C55E",
  "Área de Serviço": "#EC4899",
  Jardim: "#22C55E",
  Garagem: "#6B7280",
  Escritório: "#8B5CF6",
  Geral: "#6B7280",
}

export const FAMILY_MEMBER_TYPES = [
  { value: "baby", label: "Bebê" },
  { value: "pet", label: "Pet" },
  { value: "other", label: "Outro" },
] as const

export const DAY_NAMES: Record<number, string> = {
  0: "Domingo", 1: "Segunda", 2: "Terça", 3: "Quarta",
  4: "Quinta", 5: "Sexta", 6: "Sábado",
}

export function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export function getTodayDateString(): string {
  const d = new Date()
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return new Intl.DateTimeFormat("fr-CA", { timeZone: tz }).format(d)
}
