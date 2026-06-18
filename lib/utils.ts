import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DAY_NAMES: Record<number, string> = {
  0: "Domingo", 1: "Segunda", 2: "Terça", 3: "Quarta",
  4: "Quinta", 5: "Sexta", 6: "Sábado",
}

export function getDayName(day: number): string {
  return DAY_NAMES[day] ?? ""
}

export function getTodayDateString(): string {
  const d = new Date()
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return new Intl.DateTimeFormat("fr-CA", { timeZone: tz }).format(d)
}

export function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  monthly: "Mensal",
}

export const ROOM_OPTIONS: string[] = []

export function getWeekId(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`
}

export function getWeekRange(weekId: string): { start: Date; end: Date } {
  const [yearStr, weekStr] = weekId.split("-W")
  const year = Number(yearStr)
  const week = Number(weekStr)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayNum = jan4.getUTCDay() || 7
  jan4.setUTCDate(jan4.getUTCDate() - (dayNum - 4))
  const start = new Date(jan4)
  start.setUTCDate(start.getUTCDate() + (week - 1) * 7)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 6)
  return { start, end }
}

export function formatWeekRange(weekId: string): string {
  const { start, end } = getWeekRange(weekId)
  const fmt = (d: Date) =>
    String(d.getUTCDate()).padStart(2, "0") + "/" +
    String(d.getUTCMonth() + 1).padStart(2, "0")
  return `${fmt(start)} a ${fmt(end)}`
}
