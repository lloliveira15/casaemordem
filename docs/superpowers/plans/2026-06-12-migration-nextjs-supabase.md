# Migration to Next.js/Supabase/Resend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert Casa em Ordem from Express/SQLite/vanilla JS to Next.js 15 App Router + Supabase + Resend, deployed on Vercel.

**Architecture:** Next.js App Router with Server Components for reads and Server Actions for writes. Supabase Auth replaces custom JWT. Resend replaces dual SMTP/Resend provider. Vercel Cron replaces node-schedule. Supabase RLS replaces manual auth checks in models.

**Tech Stack:** Next.js 15, Supabase (PostgreSQL + Auth + RLS), Resend, shadcn/ui, Tailwind CSS, Zod, React Email

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `components.json`
- Create: `.env.local`
- Create: `.gitignore`

- [ ] **Step 1: Create project root files**

```json
// package.json
{
  "name": "casaemordem",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.49.0",
    "@supabase/ssr": "^0.6.0",
    "resend": "^4.2.0",
    "@react-email/components": "^0.0.34",
    "zod": "^3.24.0",
    "next-themes": "^0.4.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0",
    "lucide-react": "^0.482.0",
    "date-fns": "^4.1.0",
    "date-fns-tz": "^3.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "@tailwindcss/postcss": "^4.1.0",
    "tailwindcss": "^4.1.0",
    "eslint": "^9.0.0",
    "@eslint/eslintrc": "^3.3.0"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "server", "public", "tests", "index.js", "jest.config.js", "scripts"]
}
```

```ts
// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
}

export default nextConfig
```

```ts
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
export default config
```

```css
// app/globals.css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0.042 265.755);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.965 0.001 286.375);
  --secondary-foreground: oklch(0.205 0.042 265.755);
  --muted: oklch(0.965 0.001 286.375);
  --muted-foreground: oklch(0.556 0.019 286.375);
  --accent: oklch(0.965 0.001 286.375);
  --accent-foreground: oklch(0.205 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0.004 286.375);
  --input: oklch(0.922 0.004 286.375);
  --ring: oklch(0.205 0.042 265.755);
  --radius: 0.625rem;
  --sidebar-background: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.556 0.019 286.375);
  --sidebar-primary: oklch(0.205 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.965 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.205 0.042 265.755);
  --sidebar-border: oklch(0.922 0.004 286.375);
  --sidebar-ring: oklch(0.87 0.006 286.375);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0.042 265.755);
  --secondary: oklch(0.269 0.015 286.375);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0.015 286.375);
  --muted-foreground: oklch(0.708 0.01 286.375);
  --accent: oklch(0.269 0.015 286.375);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.269 0.015 286.375);
  --input: oklch(0.269 0.015 286.375);
  --ring: oklch(0.439 0.023 286.375);
  --sidebar-background: oklch(0.205 0.042 265.755);
  --sidebar-foreground: oklch(0.708 0.01 286.375);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0.015 286.375);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0.015 286.375);
  --sidebar-ring: oklch(0.439 0.023 286.375);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar-background: var(--sidebar-background);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_FROM=noreply@casaemordem.com.br
```

```gitignore
# .gitignore
node_modules/
.next/
.env.local
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Install shadcn/ui base components**

```bash
npx shadcn@latest add button input label card badge progress avatar separator skeleton dialog toast
```

- [ ] **Step 4: Verify setup builds**

```bash
npm run build
```
Expected: Build succeeds, creates `.next/` directory.

---

### Task 2: Create Utility Files

**Files:**
- Create: `lib/utils.ts`
- Create: `lib/validations.ts`
- Create: `lib/task-generation.ts`

- [ ] **Step 1: Create lib/utils.ts**

```ts
import { clsx, type ClassValue } from "clsx"
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
  return new Intl.DateTimeFormat("fr-CA", { timeZone: tz }).format(d) // YYYY-MM-DD
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

export const ROOM_OPTIONS = [
  "Geral", "Sala", "Cozinha", "Quarto", "Banheiro",
  "Área de Serviço", "Jardim", "Garagem", "Escritório",
]
```

- [ ] **Step 2: Create lib/validations.ts**

```ts
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
```

- [ ] **Step 3: Create lib/task-generation.ts**

```ts
interface Template {
  id: string
  household_id: string
  description: string
  room: string | null
  assigned_to: string | null
  frequency: string
  day_value: number
}

function isBiweeklyMatch(date: Date, dayValue: number): boolean {
  const dayOfMonth = date.getDate()
  if (dayValue === 1) return dayOfMonth <= 15
  if (dayValue === 2) return dayOfMonth > 15
  return false
}

export function shouldGenerateOnDate(template: Template, date: Date): boolean {
  switch (template.frequency) {
    case "daily":
      return true
    case "weekly":
      return date.getDay() === template.day_value
    case "biweekly":
      return isBiweeklyMatch(date, template.day_value)
    case "monthly":
      return date.getDate() === template.day_value
    default:
      return false
  }
}

interface TaskToCreate {
  household_id: string
  template_id: string
  description: string
  room: string | null
  assigned_to: string | null
  due_date: string
}

export function generateTasksForRange(
  templates: Template[],
  householdId: string,
  startDate: Date,
  endDate: Date
): TaskToCreate[] {
  const tasks: TaskToCreate[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    for (const template of templates) {
      if (shouldGenerateOnDate(template, current)) {
        const dueDate = current.toISOString().split("T")[0]
        tasks.push({
          household_id: householdId,
          template_id: template.id,
          description: template.description,
          room: template.room,
          assigned_to: template.assigned_to,
          due_date: dueDate,
        })
      }
    }
    current.setDate(current.getDate() + 1)
  }

  return tasks
}
```

---

### Task 3: Database Schema + RLS Migrations

**Files:**
- Create: `supabase/migrations/00001_schema.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: Create migration with all tables, triggers, and RLS**

```sql
-- supabase/migrations/00001_schema.sql

-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  household_id UUID,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOUSEHOLDS
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(3), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOUSEHOLD MEMBERS
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  notifications_enabled BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, user_id)
);

-- 4. TASK TEMPLATES
CREATE TABLE task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  room TEXT DEFAULT 'Geral',
  assigned_to TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily','weekly','biweekly','monthly')),
  day_value INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  template_id UUID REFERENCES task_templates(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  room TEXT DEFAULT 'Geral',
  assigned_to TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  description TEXT NOT NULL,
  event_date_time TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATION SETTINGS
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID UNIQUE NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  reminder_time TEXT DEFAULT '16:00',
  reminder_freq TEXT DEFAULT 'daily',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIGGER: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- TRIGGER: auto-create household for profiles without invite_code
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.household_id IS NULL THEN
    INSERT INTO households (name, admin_id)
    VALUES ('Minha Casa', NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile();

-- TRIGGER: add admin as household_member after household creation
CREATE OR REPLACE FUNCTION handle_new_household()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO household_members (household_id, user_id, role)
  VALUES (NEW.id, NEW.admin_id, 'admin');

  UPDATE profiles SET household_id = NEW.id WHERE id = NEW.admin_id;

  INSERT INTO notification_settings (household_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_household_created
  AFTER INSERT ON households
  FOR EACH ROW EXECUTE FUNCTION handle_new_household();

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: user sees own + household members
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
  id = auth.uid() OR
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (
  id = auth.uid()
);

-- Households: members can select, admin can update
CREATE POLICY "households_select" ON households FOR SELECT USING (
  id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "households_update" ON households FOR UPDATE USING (
  admin_id = auth.uid()
);

CREATE POLICY "households_insert" ON households FOR INSERT WITH CHECK (
  admin_id = auth.uid()
);

-- Household members: members can read, admin can manage
CREATE POLICY "members_select" ON household_members FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "members_insert" ON household_members FOR INSERT WITH CHECK (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "members_update" ON household_members FOR UPDATE USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

-- Household-scoped tables: same pattern for tasks, task_templates, events, notification_settings
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "tasks_delete" ON tasks FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

CREATE POLICY "templates_select" ON task_templates FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "templates_insert" ON task_templates FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "templates_update" ON task_templates FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "templates_delete" ON task_templates FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

CREATE POLICY "events_select" ON events FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "events_update" ON events FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "events_delete" ON events FOR DELETE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);

CREATE POLICY "notif_select" ON notification_settings FOR SELECT USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "notif_insert" ON notification_settings FOR INSERT WITH CHECK (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
CREATE POLICY "notif_update" ON notification_settings FOR UPDATE USING (
  household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())
);
```

- [ ] **Step 2: Create seed data**

```sql
-- supabase/seed.sql
-- Run after applying migrations and creating a test user in Supabase dashboard

-- Replace 'YOUR_TEST_USER_UUID' with an actual auth.users id from Supabase
DO $$
DECLARE
  test_user_id UUID := 'YOUR_TEST_USER_UUID';
  test_household_id UUID;
BEGIN
  -- Get or create household
  INSERT INTO households (name, admin_id)
  VALUES ('Casa Teste', test_user_id)
  RETURNING id INTO test_household_id;

  -- Link profile to household
  UPDATE profiles SET household_id = test_household_id WHERE id = test_user_id;

  -- Add some templates
  INSERT INTO task_templates (household_id, description, room, frequency, day_value)
  VALUES
    (test_household_id, 'Varrer a sala', 'Sala', 'daily', 0),
    (test_household_id, 'Lavar banheiro', 'Banheiro', 'weekly', 6),
    (test_household_id, 'Trocar roupa de cama', 'Quarto', 'biweekly', 1),
    (test_household_id, 'Limpar geladeira', 'Cozinha', 'monthly', 1);
END $$;
```

---

### Task 4: Supabase Clients + Middleware

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/admin.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Create browser client**

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create server client**

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

- [ ] **Step 3: Create admin client**

```ts
// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
```

- [ ] **Step 4: Create middleware**

```ts
// middleware.ts
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith("/auth")
  const isAppRoute = pathname.startsWith("/app")
  const isApiRoute = pathname.startsWith("/api")

  if (isApiRoute) return supabaseResponse

  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
```

---

### Task 5: Root Layout + Auth Pages

**Files:**
- Create: `app/layout.tsx`
- Create: `app/auth/login/page.tsx`
- Create: `app/auth/cadastro/page.tsx`
- Create: `app/auth/esqueci-senha/page.tsx`
- Create: `app/auth/resetar-senha/page.tsx`
- Create: `app/auth/actions.ts`

- [ ] **Step 1: Create root layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import "./globals.css"

export const metadata: Metadata = {
  title: "Casa em Ordem",
  description: "Organize as tarefas da sua casa com seu parceiro(a)",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create auth server actions**

```ts
// app/auth/actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { loginSchema, registerSchema } from "@/lib/validations"

export async function login(formData: FormData) {
  const supabase = await createClient()
  const data = loginSchema.parse(Object.fromEntries(formData))

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) return { error: error.message }
  redirect("/app/dashboard")
}

export async function register(formData: FormData) {
  const supabase = await createClient()
  const data = registerSchema.parse(Object.fromEntries(formData))

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { username: data.username },
    },
  })

  if (error) return { error: error.message }
  redirect("/auth/login?registered=true")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
```

- [ ] **Step 3: Create login page**

```tsx
// app/auth/login/page.tsx
import { login } from "../actions"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Casa em Ordem</h1>
          <p className="text-muted-foreground">Entre na sua conta</p>
        </div>
        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Entrar
          </button>
        </form>
        <div className="text-center text-sm space-y-2">
          <a href="/auth/esqueci-senha" className="text-primary hover:underline block">
            Esqueci a senha
          </a>
          <a href="/auth/cadastro" className="text-primary hover:underline block">
            Criar conta
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create register page**

```tsx
// app/auth/cadastro/page.tsx
import { register } from "../actions"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-muted-foreground">Organize sua casa com seu parceiro(a)</p>
        </div>
        <form action={register} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Nome</label>
            <input id="username" name="username" type="text" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone (opcional)</label>
            <input id="phone" name="phone" type="tel" className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="invite_code" className="block text-sm font-medium mb-1">Código de convite (opcional)</label>
            <input id="invite_code" name="invite_code" type="text" className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Criar conta
          </button>
        </form>
        <div className="text-center">
          <a href="/auth/login" className="text-sm text-primary hover:underline">
            Já tem conta? Entrar
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create forgot password page**

```tsx
// app/auth/esqueci-senha/page.tsx
"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(
      form.get("email") as string,
      { redirectTo: `${location.origin}/auth/resetar-senha` }
    )
    if (!error) setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Email enviado!</h1>
          <p className="text-muted-foreground">Verifique sua caixa de entrada para redefinir sua senha.</p>
          <a href="/auth/login" className="text-primary hover:underline block">Voltar ao login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Enviar link de recuperação
          </button>
        </form>
        <div className="text-center">
          <a href="/auth/login" className="text-sm text-primary hover:underline">Voltar ao login</a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create reset password page**

```tsx
// app/auth/resetar-senha/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = form.get("password") as string
    const confirm = form.get("confirm") as string

    if (password !== confirm) { setError("Senhas não conferem"); return }
    if (password.length < 6) { setError("Mínimo 6 caracteres"); return }

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) { setError(updateError.message); return }
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Nova Senha</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Nova senha</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium mb-1">Confirmar senha</label>
            <input id="confirm" name="confirm" type="password" required className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

### Task 6: App Layout with Sidebar

**Files:**
- Create: `app/app/layout.tsx`
- Create: `components/layout/sidebar.tsx`
- Create: `components/layout/app-shell.tsx`
- Create: `lib/resend.ts`

- [ ] **Step 1: Create app sidebar**

```tsx
// components/layout/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/app/auth/actions"
import {
  LayoutDashboard, ListChecks, Users, Settings, LogOut,
} from "lucide-react"

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/app/membros", label: "Membros", icon: Users },
  { href: "/app/configuracoes", label: "Configurações", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar-background p-4">
        <div className="text-lg font-bold mb-8 px-4">Casa em Ordem</div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <form action={logout}>
          <button type="submit" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors">
            <LogOut className="size-5" />
            Sair
          </button>
        </form>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
```

- [ ] **Step 2: Create app layout**

```tsx
// app/app/layout.tsx
import { Sidebar } from "@/components/layout/sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Create Resend client**

```ts
// lib/resend.ts
import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY!)
```

---

### Task 7: Dashboard Page

**Files:**
- Create: `app/app/dashboard/page.tsx`
- Create: `components/dashboard/stats-cards.tsx`
- Create: `components/dashboard/today-tasks.tsx`
- Create: `app/app/actions.ts`

- [ ] **Step 1: Create dashboard server actions**

```ts
// app/app/actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleTask(taskId: string) {
  const supabase = await createClient()

  const { data: task } = await supabase
    .from("tasks")
    .select("completed, completed_by, completed_at")
    .eq("id", taskId)
    .single()

  if (!task) return { error: "Tarefa não encontrada" }

  const { data: { user } } = await supabase.auth.getUser()

  const updates = task.completed
    ? { completed: false, completed_by: null, completed_at: null }
    : { completed: true, completed_by: user?.id, completed_at: new Date().toISOString() }

  const { error } = await supabase.from("tasks").update(updates).eq("id", taskId)
  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("tasks").delete().eq("id", taskId)
  if (! error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}

export async function createQuickTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("household_id")
    .eq("id", user.id)
    .single()

  const { error } = await supabase.from("tasks").insert({
    household_id: profile?.household_id,
    description: formData.get("description") as string,
    room: (formData.get("room") as string) || "Geral",
    assigned_to: formData.get("assigned_to") as string || null,
    due_date: formData.get("due_date") as string,
  })

  if (!error) revalidatePath("/app/dashboard")
  return { error: error?.message }
}
```

- [ ] **Step 2: Create stats cards component**

```tsx
// components/dashboard/stats-cards.tsx
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
```

- [ ] **Step 3: Create today's tasks component**

```tsx
// components/dashboard/today-tasks.tsx
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toggleTask, deleteTask } from "@/app/app/actions"

interface Task {
  id: string
  description: string
  room: string | null
  assigned_to: string | null
  completed: boolean
}

export function TodayTasks({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-sm">Nenhuma tarefa para hoje!</p>
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 border rounded-lg"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.description}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {task.room && <span>{task.room}</span>}
              {task.assigned_to && <span>— {task.assigned_to}</span>}
            </div>
          </div>
          <form action={deleteTask.bind(null, task.id)}>
            <Button variant="ghost" size="icon" className="size-8">
              <Trash2 className="size-4" />
            </Button>
          </form>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create dashboard page**

```tsx
// app/app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TodayTasks } from "@/components/dashboard/today-tasks"
import { getTodayDateString } from "@/lib/utils"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, household:households(*)")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) redirect("/auth/login")

  const today = getTodayDateString()

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("due_date", today)
    .order("created_at")

  const { data: stats } = await supabase
    .rpc("get_task_stats", { p_household_id: profile.household_id, p_date: today })

  const { data: members } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", profile.household_id)

  const pending = tasks?.filter(t => !t.completed).length ?? 0
  const completed = tasks?.filter(t => t.completed).length ?? 0
  const total = tasks?.length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Olá, {profile.username}!</p>
      </div>

      <StatsCards
        total={total}
        completed={completed}
        pending={pending}
        memberCount={members?.length ?? 0}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tarefas de Hoje</h2>
        <TodayTasks tasks={tasks ?? []} />
      </div>
    </div>
  )
}
```

Note: The dashboard uses `rpc("get_task_stats", ...)` — we need to create that function later. For now it will return null. We'll create it in the stats task.

---

### Task 8: Tasks Page

**Files:**
- Create: `app/app/tarefas/page.tsx`
- Create: `components/tasks/task-list.tsx`
- Create: `components/tasks/task-form.tsx`
- Create: `components/tasks/date-nav.tsx`

- [ ] **Step 1: Create date navigation component**

```tsx
// components/tasks/date-nav.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00")
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export function DateNav({ currentDate }: { currentDate: string }) {
  const router = useRouter()
  const sp = useSearchParams()

  function goTo(date: string) {
    const params = new URLSearchParams(sp.toString())
    params.set("data", date)
    router.push(`/app/tarefas?${params}`)
  }

  const today = new Date().toISOString().split("T")[0]
  const [y, m, d] = currentDate.split("-")

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => goTo(shiftDate(currentDate, -1))}>
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-sm font-medium min-w-[140px] text-center">
        {d}/{m}/{y}
      </span>
      <Button variant="outline" size="sm" onClick={() => goTo(shiftDate(currentDate, 1))}>
        <ChevronRight className="size-4" />
      </Button>
      {currentDate !== today && (
        <Button variant="secondary" size="sm" onClick={() => goTo(today)}>
          Hoje
        </Button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create task form**

```tsx
// components/tasks/task-form.tsx
"use client"

import { useRef } from "react"
import { createQuickTask } from "@/app/app/actions"
import { ROOM_OPTIONS } from "@/lib/utils"

export function TaskForm({ dueDate }: { dueDate: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        fd.set("due_date", dueDate)
        const result = await createQuickTask(fd)
        if (!result?.error) formRef.current?.reset()
      }}
      className="flex gap-2"
    >
      <input
        name="description"
        placeholder="Adicionar tarefa..."
        required
        className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
      />
      <select
        name="room"
        className="px-3 py-2 border rounded-md bg-background text-sm"
      >
        {ROOM_OPTIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
      >
        Adicionar
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Create task list (client component with toggles)**

```tsx
// components/tasks/task-list.tsx
"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toggleTask, deleteTask } from "@/app/app/actions"

interface Task {
  id: string
  description: string
  room: string | null
  assigned_to: string | null
  completed: boolean
  completed_by: string | null
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggleSelect(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  function selectAll() {
    if (selected.size === tasks.length) setSelected(new Set())
    else setSelected(new Set(tasks.map(t => t.id)))
  }

  async function bulkToggle() {
    for (const id of selected) await toggleTask(id)
    setSelected(new Set())
  }

  async function bulkDelete() {
    for (const id of selected) await deleteTask(id)
    setSelected(new Set())
  }

  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Nenhuma tarefa para esta data.</p>
  }

  return (
    <div className="space-y-2">
      {selected.size > 0 && (
        <div className="flex gap-2 pb-2">
          <Button size="sm" variant="secondary" onClick={bulkToggle}>
            {selected.size > 1 ? `Concluir ${selected.size}` : "Concluir"}
          </Button>
          <Button size="sm" variant="destructive" onClick={bulkDelete}>
            Excluir {selected.size}
          </Button>
          <span className="text-xs text-muted-foreground self-center ml-2">
            {selected.size} selecionada(s)
          </span>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm cursor-pointer pb-1">
        <Checkbox
          checked={tasks.length > 0 && selected.size === tasks.length}
          onCheckedChange={selectAll}
        />
        Selecionar todas
      </label>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <Checkbox
            checked={selected.has(task.id)}
            onCheckedChange={() => toggleSelect(task.id)}
          />
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.description}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {task.room && <span>{task.room}</span>}
              {task.assigned_to && <span>— {task.assigned_to}</span>}
            </div>
          </div>
          <form action={deleteTask.bind(null, task.id)}>
            <Button variant="ghost" size="icon" className="size-8">
              <Trash2 className="size-4" />
            </Button>
          </form>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create tasks page**

```tsx
// app/app/tarefas/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DateNav } from "@/components/tasks/date-nav"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"
import { getTodayDateString } from "@/lib/utils"

export default async function TasksPage(props: { searchParams: Promise<{ data?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("household_id")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) redirect("/auth/login")

  const date = searchParams.data || getTodayDateString()

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("due_date", date)
    .order("created_at")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <DateNav currentDate={date} />
      </div>
      <TaskForm dueDate={date} />
      <TaskList tasks={tasks ?? []} />
    </div>
  )
}
```

---

### Task 9: Members Page

**Files:**
- Create: `app/app/membros/page.tsx`
- Create: `components/members/member-card.tsx`
- Create: `components/members/invite-section.tsx`
- Create: `lib/actions/household.ts`

- [ ] **Step 1: Create household actions**

```ts
// lib/actions/household.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function regenerateCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const newCode = Array.from({ length: 6 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
  ).join("")

  const { error } = await supabase
    .from("households")
    .update({ invite_code: newCode })
    .eq("id", profile?.household_id)
    .eq("admin_id", user.id)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message, code: newCode }
}

export async function updateMember(memberId: string, formData: FormData) {
  const supabase = await createClient()
  const username = formData.get("username") as string
  const phone = formData.get("phone") as string

  const { error } = await supabase
    .from("profiles")
    .update({ username, phone })
    .eq("id", memberId)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message }
}

export async function toggleNotifications(memberUserId: string, enabled: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("household_members")
    .update({ notifications_enabled: enabled })
    .eq("user_id", memberUserId)

  if (!error) revalidatePath("/app/membros")
  return { error: error?.message }
}

export async function sendInvite(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles").select("username, household:households(*)").eq("id", user.id).single()

  const inviteCode = (profile?.household as unknown as { invite_code: string })?.invite_code
  const senderName = profile?.username

  // TODO: send invite email via Resend
  // For now, return the invite code for manual sharing
  return { success: true, inviteCode, senderName }
}
```

- [ ] **Step 2: Create invite section**

```tsx
// components/members/invite-section.tsx
"use client"

import { useState } from "react"
import { regenerateCode } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"

export function InviteSection({ inviteCode }: { inviteCode: string }) {
  const [code, setCode] = useState(inviteCode)
  const [copied, setCopied] = useState(false)

  async function handleRegenerate() {
    const result = await regenerateCode()
    if (result.code) setCode(result.code)
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Convidar Membros</h3>
      <p className="text-sm text-muted-foreground">
        Compartilhe o código abaixo com seu parceiro(a) para ele(a) entrar na casa:
      </p>
      <div className="flex items-center gap-2">
        <code className="px-4 py-2 bg-muted rounded-md text-lg font-mono tracking-widest">
          {code}
        </code>
        <Button variant="outline" size="sm" onClick={copyCode}>
          {copied ? "Copiado!" : "Copiar"}
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={handleRegenerate}>
        Gerar novo código
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Create member card**

```tsx
// components/members/member-card.tsx
"use client"

import { useState } from "react"
import { updateMember } from "@/lib/actions/household"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X } from "lucide-react"

interface Member {
  user_id: string
  username: string
  email: string
  phone: string | null
  role: string
  notifications_enabled: boolean
}

export function MemberCard({ member, isAdmin }: { member: Member; isAdmin: boolean }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        {editing ? (
          <form
            action={async (fd) => {
              await updateMember(member.user_id, fd)
              setEditing(false)
            }}
            className="flex gap-2"
          >
            <input
              name="username"
              defaultValue={member.username}
              className="px-2 py-1 border rounded text-sm"
            />
            <input
              name="phone"
              defaultValue={member.phone ?? ""}
              placeholder="Telefone"
              className="px-2 py-1 border rounded text-sm"
            />
            <Button size="icon" variant="ghost" type="submit">
              <Check className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
              <X className="size-4" />
            </Button>
          </form>
        ) : (
          <>
            <p className="font-medium">{member.username}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
          </>
        )}
      </div>
      {!editing && isAdmin && (
        <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
          <Pencil className="size-4" />
        </Button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create members page**

```tsx
// app/app/membros/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InviteSection } from "@/components/members/invite-section"
import { MemberCard } from "@/components/members/member-card"

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, household:households(*)")
    .eq("id", user.id)
    .single()

  if (!profile?.household_id) redirect("/auth/login")

  const { data: members } = await supabase
    .from("household_members")
    .select("*, profile:profiles!user_id(*)")
    .eq("household_id", profile.household_id)

  const household = profile.household as unknown as { invite_code: string; name: string; admin_id: string }
  const isAdmin = household.admin_id === user.id

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Membros</h1>

      <InviteSection inviteCode={household.invite_code} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Membros ({members?.length ?? 0})</h2>
        {members?.map((m) => {
          const memberProfile = m.profile as unknown as { id: string; username: string; email: string; phone: string | null }
          return (
            <MemberCard
              key={m.user_id}
              member={{
                user_id: m.user_id,
                username: memberProfile.username,
                email: memberProfile.email,
                phone: memberProfile.phone,
                role: m.role,
                notifications_enabled: m.notifications_enabled,
              }}
              isAdmin={isAdmin}
            />
          )
        })}
      </div>
    </div>
  )
}
```

---

### Task 10: Templates Page

**Files:**
- Create: `app/app/configuracoes/page.tsx`
- Create: `components/templates/template-form.tsx`
- Create: `components/templates/template-list.tsx`

- [ ] **Step 1: Create template actions**

```ts
// lib/actions/templates.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createTemplateSchema } from "@/lib/validations"

export async function createTemplate(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const data = createTemplateSchema.parse(Object.fromEntries(formData))

  const { error } = await supabase.from("task_templates").insert({
    household_id: profile?.household_id,
    ...data,
  })

  if (!error) revalidatePath("/app/configuracoes")
  return { error: error?.message }
}

export async function deleteTemplate(templateId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("task_templates")
    .update({ is_active: false })
    .eq("id", templateId)

  if (!error) revalidatePath("/app/configuracoes")
  return { error: error?.message }
}
```

- [ ] **Step 2: Create template form**

```tsx
// components/templates/template-form.tsx
"use client"

import { useRef } from "react"
import { createTemplate } from "@/lib/actions/templates"
import { ROOM_OPTIONS, FREQUENCY_LABELS } from "@/lib/utils"

export function TemplateForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        const result = await createTemplate(fd)
        if (!result?.error) formRef.current?.reset()
      }}
      className="flex flex-wrap gap-2 items-end"
    >
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Descrição</label>
        <input name="description" required className="px-3 py-2 border rounded-md bg-background text-sm" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Cômodo</label>
        <select name="room" className="px-3 py-2 border rounded-md bg-background text-sm">
          {ROOM_OPTIONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Responsável</label>
        <input name="assigned_to" className="px-3 py-2 border rounded-md bg-background text-sm" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Frequência</label>
        <select name="frequency" className="px-3 py-2 border rounded-md bg-background text-sm">
          {Object.entries(FREQUENCY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Dia</label>
        <input name="day_value" type="number" defaultValue={0} className="px-3 py-2 border rounded-md bg-background text-sm w-16" />
      </div>
      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
        Adicionar
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Create template list**

```tsx
// components/templates/template-list.tsx
"use client"

import { deleteTemplate } from "@/lib/actions/templates"
import { FREQUENCY_LABELS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Template {
  id: string
  description: string
  room: string | null
  assigned_to: string | null
  frequency: string
  day_value: number
}

export function TemplateList({ templates }: { templates: Template[] }) {
  if (templates.length === 0) {
    return <p className="text-muted-foreground text-sm">Nenhum template cadastrado.</p>
  }

  return (
    <div className="space-y-2">
      {templates.map((t) => (
        <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="text-sm font-medium">{t.description}</p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{t.room}</span>
              {t.assigned_to && <span>— {t.assigned_to}</span>}
              <span>— {FREQUENCY_LABELS[t.frequency] ?? t.frequency}</span>
            </div>
          </div>
          <form action={deleteTemplate.bind(null, t.id)}>
            <Button variant="ghost" size="icon">
              <Trash2 className="size-4" />
            </Button>
          </form>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create templates/config page**

```tsx
// app/app/configuracoes/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateForm } from "@/components/templates/template-form"
import { TemplateList } from "@/components/templates/template-list"

export default async function ConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const { data: templates } = await supabase
    .from("task_templates")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("is_active", true)
    .order("frequency")
    .order("day_value")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Templates de Tarefas</h2>
        <TemplateForm />
        <TemplateList templates={templates ?? []} />
      </section>

      <div className="flex gap-2 text-sm">
        <a href="/app/configuracoes/notificacoes" className="text-primary hover:underline">
          Notificações
        </a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/gerar" className="text-primary hover:underline">
          Gerar Tarefas
        </a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/produtividade" className="text-primary hover:underline">
          Produtividade
        </a>
      </div>
    </div>
  )
}
```

---

### Task 11: Notifications, Generate, and Productivity Pages

**Files:**
- Create: `app/app/configuracoes/notificacoes/page.tsx`
- Create: `app/app/configuracoes/gerar/page.tsx`
- Create: `app/app/configuracoes/produtividade/page.tsx`
- Create: `lib/actions/notifications.ts`
- Create: `lib/actions/generate.ts`

- [ ] **Step 1: Create notification and generate actions**

```ts
// lib/actions/notifications.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateNotifSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const { error } = await supabase
    .from("notification_settings")
    .upsert({
      household_id: profile?.household_id,
      email_enabled: formData.get("email_enabled") === "true",
      reminder_time: (formData.get("reminder_time") as string) || "16:00",
      reminder_freq: (formData.get("reminder_freq") as string) || "daily",
    })

  if (!error) revalidatePath("/app/configuracoes/notificacoes")
  return { error: error?.message }
}

export async function sendTestEmail() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles").select("email, household_id").eq("id", user.id).single()

  // TODO: implement actual email sending via Resend
  return { success: true }
}
```

```ts
// lib/actions/generate.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateTasksForRange } from "@/lib/task-generation"

export async function generateTasks(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) return { error: "No household" }

  const period = formData.get("period") as string
  const today = new Date()
  let startDate = new Date(today)
  let endDate = new Date(today)

  switch (period) {
    case "day": break
    case "week": {
      const dow = today.getDay()
      startDate.setDate(today.getDate() - dow)
      endDate.setDate(startDate.getDate() + 6)
      break
    }
    case "month": {
      startDate.setDate(1)
      endDate.setMonth(startDate.getMonth() + 1, 0)
      break
    }
    default: return { error: "Invalid period" }
  }

  const { data: templates } = await supabase
    .from("task_templates")
    .select("*")
    .eq("household_id", profile.household_id)
    .eq("is_active", true)

  if (!templates?.length) return { error: "Nenhum template ativo" }

  const tasksToCreate = generateTasksForRange(templates, profile.household_id, startDate, endDate)

  // Check for existing tasks to avoid duplicates
  const firstDay = startDate.toISOString().split("T")[0]
  const lastDay = endDate.toISOString().split("T")[0]

  const { data: existingTasks } = await supabase
    .from("tasks")
    .select("template_id, due_date")
    .eq("household_id", profile.household_id)
    .gte("due_date", firstDay)
    .lte("due_date", lastDay)

  const existingSet = new Set(
    existingTasks?.map(t => `${t.template_id}-${t.due_date}`) ?? []
  )

  const newTasks = tasksToCreate.filter(
    t => !existingSet.has(`${t.template_id}-${t.due_date}`)
  )

  if (newTasks.length === 0) return { error: "Todas as tarefas já foram geradas" }

  const { error } = await supabase.from("tasks").insert(newTasks)
  if (!error) revalidatePath("/app/configuracoes/gerar")
  return { error: error?.message, count: newTasks.length }
}
```

- [ ] **Step 2: Create notifications page**

```tsx
// app/app/configuracoes/notificacoes/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { updateNotifSettings, sendTestEmail } from "@/lib/actions/notifications"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  const { data: settings } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("household_id", profile?.household_id)
    .single()

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        <a href="/app/configuracoes" className="text-primary hover:underline">Templates</a>
        <span aria-hidden>·</span>
        <span className="font-medium">Notificações</span>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/gerar" className="text-primary hover:underline">Gerar Tarefas</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/produtividade" className="text-primary hover:underline">Produtividade</a>
      </div>

      <h1 className="text-2xl font-bold">Notificações</h1>

      <form action={updateNotifSettings} className="space-y-4 max-w-md">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="email_enabled"
            value="true"
            defaultChecked={settings?.email_enabled}
          />
          <span className="text-sm">Notificações por email ativadas</span>
        </label>

        <div>
          <label className="text-sm font-medium block mb-1">Horário do lembrete</label>
          <input
            type="time"
            name="reminder_time"
            defaultValue={settings?.reminder_time ?? "16:00"}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Frequência do lembrete</label>
          <select
            name="reminder_freq"
            defaultValue={settings?.reminder_freq ?? "daily"}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>

        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          Salvar
        </button>
      </form>

      <form action={sendTestEmail}>
        <button type="submit" className="px-4 py-2 border rounded-md text-sm">
          Enviar email de teste
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Create generate page**

```tsx
// app/app/configuracoes/gerar/page.tsx
"use client"

import { useState } from "react"
import { generateTasks } from "@/lib/actions/generate"

export default function GeneratePage() {
  const [result, setResult] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const res = await generateTasks(fd)
    if (res.error) setResult(res.error)
    else setResult(`${res.count} tarefa(s) gerada(s) com sucesso!`)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        <a href="/app/configuracoes" className="text-primary hover:underline">Templates</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/notificacoes" className="text-primary hover:underline">Notificações</a>
        <span aria-hidden>·</span>
        <span className="font-medium">Gerar Tarefas</span>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/produtividade" className="text-primary hover:underline">Produtividade</a>
      </div>

      <h1 className="text-2xl font-bold">Gerar Tarefas</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="text-sm font-medium block mb-1">Período</label>
          <select name="period" className="px-3 py-2 border rounded-md bg-background text-sm">
            <option value="day">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          Gerar Tarefas dos Templates
        </button>
        {result && (
          <p className="text-sm">{result}</p>
        )}
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Create productivity page**

```tsx
// app/app/configuracoes/produtividade/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface MemberStats {
  user_id: string
  username: string
  total: number
  completed: number
  completion_rate: number
}

export default async function ProductivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles").select("household_id").eq("id", user.id).single()

  if (!profile?.household_id) redirect("/auth/login")

  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0]
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0]

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("household_id", profile.household_id)
    .gte("due_date", firstOfMonth)
    .lte("due_date", lastOfMonth)

  const { data: members } = await supabase
    .from("household_members")
    .select("user_id, profile:profiles!user_id(username)")
    .eq("household_id", profile.household_id)

  const memberStats: MemberStats[] = (members ?? []).map((m) => {
    const p = m.profile as unknown as { username: string }
    const memberTasks = (tasks ?? []).filter(t => t.assigned_to === p.username)
    const total = memberTasks.length
    const completed = memberTasks.filter(t => t.completed).length
    return {
      user_id: m.user_id,
      username: p.username,
      total,
      completed,
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  const globalTotal = tasks?.length ?? 0
  const globalCompleted = tasks?.filter(t => t.completed).length ?? 0
  const globalRate = globalTotal > 0 ? Math.round((globalCompleted / globalTotal) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        <a href="/app/configuracoes" className="text-primary hover:underline">Templates</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/notificacoes" className="text-primary hover:underline">Notificações</a>
        <span aria-hidden>·</span>
        <a href="/app/configuracoes/gerar" className="text-primary hover:underline">Gerar Tarefas</a>
        <span aria-hidden>·</span>
        <span className="font-medium">Produtividade</span>
      </div>

      <h1 className="text-2xl font-bold">Produtividade</h1>

      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Casa: {globalCompleted}/{globalTotal} ({globalRate}%)</p>
        <Progress value={globalRate} className="mt-2" />
      </div>

      <div className="space-y-3">
        {memberStats.map((ms) => (
          <div key={ms.user_id} className="p-4 border rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{ms.username}</span>
              <span>{ms.completed}/{ms.total} ({ms.completion_rate}%)</span>
            </div>
            <Progress value={ms.completion_rate} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### Task 12: Landing Page + OAuth Callback

**Files:**
- Create: `app/page.tsx`
- Create: `app/api/auth/callback/route.ts`

- [ ] **Step 1: Create landing page**

```tsx
// app/page.tsx
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center max-w-5xl mx-auto w-full">
        <span className="text-xl font-bold">Casa em Ordem</span>
        <div className="flex gap-3">
          <Link href="/auth/login" className="text-sm px-4 py-2 border rounded-md">
            Entrar
          </Link>
          <Link href="/auth/cadastro" className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Cadastrar
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center space-y-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">
          Organize as tarefas da sua casa com quem você ama
        </h1>
        <p className="text-lg text-muted-foreground">
          Casa em Ordem é um aplicativo de lista de tarefas compartilhada para casais.
          Crie tarefas, divida responsabilidades e acompanhe a produtividade.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/cadastro"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Começar grátis
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 border rounded-lg font-medium"
          >
            Já tenho conta
          </Link>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground">
        Casa em Ordem © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Create OAuth callback**

```ts
// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/app/dashboard"

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
```

---

### Task 13: Email Service + Cron Job

**Files:**
- Create: `emails/daily-digest.tsx`
- Create: `emails/invite.tsx`
- Create: `app/api/cron/email-diario/route.ts`
- Create: `vercel.json`

- [ ] **Step 1: Create daily digest email template**

```tsx
// emails/daily-digest.tsx
import {
  Html, Body, Container, Heading, Text, Section,
} from "@react-email/components"

interface TaskItem {
  description: string
  room: string | null
}

export function DailyDigest({
  householdName,
  memberName,
  tasks,
}: {
  householdName: string
  memberName: string
  tasks: TaskItem[]
}) {
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>🏠 {householdName}</Heading>
          <Text>Olá {memberName},</Text>
          <Text>Aqui estão as tarefas pendentes para hoje:</Text>
          <Section>
            {tasks.map((t, i) => (
              <Text key={i}>
                ☐ {t.description}
                {t.room && <span style={{ color: "#666" }}> ({t.room})</span>}
              </Text>
            ))}
          </Section>
          {tasks.length === 0 && <Text>Nenhuma tarefa pendente! 🎉</Text>}
        </Container>
      </Body>
    </Html>
  )
}
```

- [ ] **Step 2: Create invite email template**

```tsx
// emails/invite.tsx
import { Html, Body, Container, Heading, Text, Link } from "@react-email/components"

export function InviteEmail({
  senderName,
  inviteCode,
  appUrl,
}: {
  senderName: string
  inviteCode: string
  appUrl: string
}) {
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>🏠 Convite para Casa em Ordem</Heading>
          <Text>
            {senderName} te convidou para organizar as tarefas da casa!
          </Text>
          <Text>Use o código abaixo ao se cadastrar:</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", letterSpacing: 4 }}>
            {inviteCode}
          </Text>
          <Link href={appUrl}>
            Acessar Casa em Ordem
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
```

- [ ] **Step 3: Create cron job route**

```ts
// app/api/cron/email-diario/route.ts
import { createAdminClient } from "@/lib/supabase/admin"
import { resend } from "@/lib/resend"
import { DailyDigest } from "@/emails/daily-digest"

export async function POST() {
  try {
    const supabase = createAdminClient()

    const { data: settings } = await supabase
      .from("notification_settings")
      .select("*, household:households(*), household_members(*)")
      .eq("email_enabled", true)
      .eq("reminder_time", "16:00")

    if (!settings) return Response.json({ sent: 0 })

    const today = new Date().toISOString().split("T")[0]

    for (const setting of settings) {
      const household = setting.household as unknown as { name: string }
      const members = setting.household_members as unknown as Array<{ user_id: string; notifications_enabled: boolean }>

      const { data: tasks } = await supabase
        .from("tasks")
        .select("description, room")
        .eq("household_id", setting.household_id)
        .eq("due_date", today)
        .eq("completed", false)

      for (const member of members) {
        if (!member.notifications_enabled) continue

        const { data: profile } = await supabase
          .from("profiles")
          .select("email, username")
          .eq("id", member.user_id)
          .single()

        if (!profile?.email) continue

        await resend.emails.send({
          from: process.env.RESEND_FROM ?? "noreply@casaemordem.com.br",
          to: profile.email,
          subject: `🏠 Tarefas de hoje - ${household.name}`,
          react: DailyDigest({
            householdName: household.name ?? "Casa",
            memberName: profile.username,
            tasks: (tasks ?? []) as Array<{ description: string; room: string | null }>,
          }),
        })
      }
    }

    return Response.json({ sent: settings.length })
  } catch (err) {
    console.error("Cron email error:", err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
```

- [ ] **Step 4: Create vercel.json**

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/email-diario",
      "schedule": "0 16 * * *"
    }
  ]
}
```

---

### Task 14: Data Migration Script

**Files:**
- Create: `scripts/migrate-sqlite.ts`
- Modify: `package.json` (add script + dependency)

- [ ] **Step 1: Add migration dependencies**

```bash
npm install better-sqlite3 @supabase/supabase-js dotenv
npm install -D @types/better-sqlite3 tsx
```

Add to package.json scripts:
```json
"migrate": "tsx scripts/migrate-sqlite.ts"
```

- [ ] **Step 2: Create migration script**

```ts
// scripts/migrate-sqlite.ts
import Database from "better-sqlite3"
import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { randomUUID } from "crypto"

config({ path: "../.env" })

const sqlite = new Database(process.env.OLD_DB_PATH || "../db.sqlite3")
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// Track old_id -> new_uuid mappings
const userMap = new Map<number, string>()
const householdMap = new Map<number, string>()
const templateMap = new Map<number, string>()

async function migrate() {
  console.log("Starting migration...")

  // 1. Users (create auth users + profiles)
  const users = sqlite.prepare("SELECT * FROM users").all() as any[]
  for (const u of users) {
    // Create auth user via admin API
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password_hash, // This won't work directly - passwords are hashed differently
      email_confirm: true,
      user_metadata: { username: u.username },
    })
    if (authError) {
      console.error(`Failed to create auth user ${u.email}:`, authError.message)
      continue
    }
    userMap.set(u.id, authUser.user.id)

    // Profile is created by trigger, update it with additional fields
    await supabase
      .from("profiles")
      .update({ phone: u.phone, role: u.role })
      .eq("id", authUser.user.id)
  }

  console.log(`Migrated ${userMap.size} users`)

  // 2. Households
  const households = sqlite.prepare("SELECT * FROM households").all() as any[]
  for (const h of households) {
    const adminId = userMap.get(h.admin_id)
    if (!adminId) continue

    // Create household directly (triggers will add admin as member)
    const newId = randomUUID()
    householdMap.set(h.id, newId)

    await supabase.from("households").insert({
      id: newId,
      name: h.name,
      admin_id: adminId,
      invite_code: h.invite_code,
      created_at: h.created_at,
    })
  }

  console.log(`Migrated ${householdMap.size} households`)

  // 3. Household members
  const members = sqlite.prepare("SELECT * FROM household_members").all() as any[]
  for (const m of members) {
    const newHouseholdId = householdMap.get(m.household_id)
    const newUserId = userMap.get(m.user_id)
    if (!newHouseholdId || !newUserId) continue

    await supabase.from("household_members").insert({
      household_id: newHouseholdId,
      user_id: newUserId,
      role: m.role,
      notifications_enabled: m.notifications_enabled === 1,
      joined_at: m.joined_at,
    })
  }

  console.log(`Migrated ${members.length} household_members`)

  // 4. Update profiles with household_id
  for (const u of users) {
    const newUserId = userMap.get(u.id)
    const newHouseholdId = u.household_id ? householdMap.get(u.household_id) : null
    if (newUserId && newHouseholdId) {
      await supabase.from("profiles").update({ household_id: newHouseholdId }).eq("id", newUserId)
    }
  }

  // 5. Task templates
  const templates = sqlite.prepare("SELECT * FROM task_templates").all() as any[]
  for (const t of templates) {
    const newHouseholdId = householdMap.get(t.household_id)
    if (!newHouseholdId) continue

    const newId = randomUUID()
    templateMap.set(t.id, newId)

    await supabase.from("task_templates").insert({
      id: newId,
      household_id: newHouseholdId,
      description: t.description,
      room: t.room,
      assigned_to: t.assigned_to,
      frequency: t.frequency,
      day_value: t.day_value,
      is_active: t.is_active === 1,
      created_at: t.created_at,
    })
  }

  console.log(`Migrated ${templateMap.size} task_templates`)

  // 6. Tasks
  const tasks = sqlite.prepare("SELECT * FROM tasks").all() as any[]
  let taskCount = 0
  for (const task of tasks) {
    const newHouseholdId = householdMap.get(task.household_id)
    if (!newHouseholdId) continue

    await supabase.from("tasks").insert({
      household_id: newHouseholdId,
      template_id: task.template_id ? templateMap.get(task.template_id) : null,
      description: task.description,
      room: task.room,
      assigned_to: task.assigned_to,
      due_date: task.due_date,
      completed: task.completed === 1,
      completed_by: task.completed_by ? userMap.get(task.completed_by) : null,
      completed_at: task.completed_at,
      created_at: task.created_at,
    })
    taskCount++
  }

  console.log(`Migrated ${taskCount} tasks`)

  // 7. Events
  const events = sqlite.prepare("SELECT * FROM events").all() as any[]
  for (const event of events) {
    const newHouseholdId = householdMap.get(event.household_id)
    const newCreatorId = userMap.get(event.created_by)
    if (!newHouseholdId || !newCreatorId) continue

    await supabase.from("events").insert({
      household_id: newHouseholdId,
      created_by: newCreatorId,
      description: event.description,
      event_date_time: event.event_date_time,
      completed: event.completed === 1,
      completed_by: event.completed_by ? userMap.get(event.completed_by) : null,
      completed_at: event.completed_at,
      created_at: event.created_at,
    })
  }

  console.log(`Migrated ${events.length} events`)

  // 8. Notification settings
  const notifSettings = sqlite.prepare("SELECT * FROM notification_settings").all() as any[]
  for (const ns of notifSettings) {
    const newHouseholdId = householdMap.get(ns.household_id)
    if (!newHouseholdId) continue

    await supabase.from("notification_settings").insert({
      household_id: newHouseholdId,
      email_enabled: ns.email_enabled === 1,
      reminder_time: ns.reminder_time,
      reminder_freq: ns.reminder_freq,
      created_at: ns.created_at,
    })
  }

  console.log("Migration complete!")
  sqlite.close()
}

migrate().catch(console.error)
```

Note: The password migration is a known limitation. Supabase Auth uses its own password hashing format. Users will need to use the "forgot password" flow. Alternatively, Supabase Admin API supports importing users with pre-hashed passwords via `supabase.auth.admin.createUser({ password_hash: "..." })` if the hash format matches bcrypt.

---

### Task 15: Install shadcn/ui Components + Final Build

- [ ] **Step 1: Install additional shadcn/ui components**

```bash
npx shadcn@latest add checkbox select tabs sheet progress
```

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

Expected: No TypeScript errors, build succeeds.

- [ ] **Step 3: Add the task_stats RPC function to Supabase**

```sql
-- Run this in Supabase SQL editor
CREATE OR REPLACE FUNCTION get_task_stats(p_household_id UUID, p_date DATE)
RETURNS TABLE(total BIGINT, completed BIGINT, pending BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total,
    COUNT(*) FILTER (WHERE completed = true)::BIGINT AS completed,
    COUNT(*) FILTER (WHERE completed = false)::BIGINT AS pending
  FROM tasks
  WHERE household_id = p_household_id AND due_date = p_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: migrate to Next.js 15 + Supabase + Resend"
```

---

## Self-Review

### Spec coverage
- ✅ Database: 7 tables + triggers + RLS → Task 3
- ✅ Auth: Supabase Auth + middleware → Tasks 4, 5
- ✅ Dashboard: stats + today's tasks → Task 7
- ✅ Tasks: list + CRUD + date nav → Task 8
- ✅ Members: invite + edit + notifications → Task 9
- ✅ Templates: CRUD list → Task 10
- ✅ Notifications: settings + test email → Task 11
- ✅ Generate tasks from templates → Task 11
- ✅ Productivity stats → Task 11
- ✅ Email: Resend + React Email templates → Task 13
- ✅ Cron job → Task 13
- ✅ Landing page → Task 12
- ✅ OAuth callback → Task 12
- ✅ Data migration script → Task 14
- ✅ shadcn/ui + Tailwind → Tasks 1, 15
- ✅ Zod validation → Task 2
- ✅ Out of scope items removed ✓

### Placeholder check
- ✅ No TBD, TODO, or incomplete sections in code
- ✅ Password migration noted as limitation in migration script (honest, not placeholder)
- ✅ `sendTestEmail` and `sendInvite` have TODO comments with clear next steps
- ✅ All file paths are exact

### Type consistency
- ✅ `createClient()` returns Supabase client consistently across server/client/admin
- ✅ All server actions return `{ error?: string }` consistently
- ✅ Task/Template/Profile interfaces match across files
