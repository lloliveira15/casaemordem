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

export const createRoomTaskSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  is_sporadic: z.string().optional(),
  frequency: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.enum(["daily", "weekly", "biweekly", "monthly"]).optional()
  ),
  day_value: z.coerce.number().optional().default(0),
  assigned_to_id: z.string().uuid().optional().nullable(),
  due_date: z.string().optional(),
})

export const createQuickTaskSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  room_id: z.string().uuid().optional().nullable(),
  assigned_to_id: z.string().uuid().optional().nullable(),
  due_date: z.string(),
})
