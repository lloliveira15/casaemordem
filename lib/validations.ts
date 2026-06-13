import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

export const registerSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
  invite_code: z.string().optional(),
})

export const createTaskSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  room: z.string().default("Geral"),
  assigned_to: z.string().optional(),
  due_date: z.string(),
})

export const createTemplateSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  room: z.string().default("Geral"),
  assigned_to: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly"]).default("daily"),
  day_value: z.coerce.number().default(0),
})
