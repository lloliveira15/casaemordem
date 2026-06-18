# Migration: Express/SQLite → Next.js/Supabase/Resend

Date: 2026-06-12
Status: Draft

## Overview

Migrate Casa em Ordem from a vanilla JS SPA + Express + SQLite stack to
Next.js (App Router) + Supabase + Resend. The new stack runs on Vercel.

## Choices

- **Strategy**: Complete rewrite in parallel (new codebase, then cut over)
- **Hosting**: Vercel
- **UI**: shadcn/ui + Tailwind CSS
- **Auth**: Supabase Auth (email/password + magic link + OAuth)
- **Routing**: Next.js App Router (Server Components + Server Actions)
- **Email**: Resend only (drop SMTP dual-provider)
- **Scheduling**: Vercel Cron Jobs
- **Data**: Full migration from SQLite → Supabase PostgreSQL

## Directory Structure

```
casaemordem/
├── app/
│   ├── layout.tsx             # Root layout (providers, fonts)
│   ├── page.tsx               # Landing page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── cadastro/page.tsx
│   │   ├── esqueci-senha/page.tsx
│   │   └── resetar-senha/page.tsx
│   ├── app/                   # Protected area
│   │   ├── layout.tsx         # Sidebar + auth gate
│   │   ├── dashboard/page.tsx
│   │   ├── tarefas/page.tsx
│   │   ├── membros/page.tsx
│   │   └── configuracoes/
│   │       ├── page.tsx       # Templates (default tab)
│   │       ├── notificacoes/page.tsx
│   │       ├── gerar/page.tsx
│   │       └── produtividade/page.tsx
│   └── api/
│       ├── cron/email-diario/route.ts
│       └── auth/callback/route.ts
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── auth/                  # LoginForm, RegisterForm, etc.
│   ├── tasks/                 # TaskList, TaskItem, TaskForm
│   ├── dashboard/             # StatsCards, ProductivityPanel
│   ├── members/               # MemberCard, InviteSection
│   ├── templates/             # TemplateForm, TemplateList
│   ├── layout/                # Sidebar, Header, AppShell
│   └── emails/                # React Email templates
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server Components client
│   │   └── admin.ts           # Service-role client
│   ├── resend.ts              # Resend SDK
│   ├── utils.ts               # Date helpers, formatters
│   └── validations.ts         # Zod schemas
├── hooks/
│   ├── use-auth.ts
│   ├── use-tasks.ts
│   └── use-household.ts
├── middleware.ts              # Session check + redirect
├── supabase/
│   ├── migrations/            # SQL migrations
│   └── seed.sql
├── scripts/
│   └── migrate-sqlite.ts     # SQLite → Supabase data migration
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── components.json
└── vercel.json               # Cron jobs
```

## Database Schema

All tables use UUIDs. `auth.users` is managed by Supabase Auth. The `profiles`
table extends it with app-specific fields.

### Tables

**profiles** (extends `auth.users`):
- id UUID PK → auth.users(id) ON DELETE CASCADE
- username TEXT UNIQUE NOT NULL
- email TEXT UNIQUE NOT NULL
- phone TEXT nullable
- household_id UUID → households(id)
- role TEXT DEFAULT 'member'
- created_at TIMESTAMPTZ DEFAULT NOW()

**households**:
- id UUID PK DEFAULT gen_random_uuid()
- name TEXT
- admin_id UUID NOT NULL → profiles(id)
- invite_code TEXT UNIQUE NOT NULL
- created_at TIMESTAMPTZ DEFAULT NOW()

**household_members**:
- id UUID PK
- household_id UUID NOT NULL → households(id) ON DELETE CASCADE
- user_id UUID NOT NULL → profiles(id) ON DELETE CASCADE
- role TEXT DEFAULT 'member'
- notifications_enabled BOOLEAN DEFAULT true
- joined_at TIMESTAMPTZ DEFAULT NOW()
- UNIQUE(household_id, user_id)

**task_templates**:
- id UUID PK
- household_id UUID NOT NULL → households(id) ON DELETE CASCADE
- description TEXT NOT NULL
- room TEXT DEFAULT 'Geral'
- assigned_to TEXT
- frequency TEXT DEFAULT 'daily'  (daily|weekly|biweekly|monthly)
- day_value INTEGER DEFAULT 0
- is_active BOOLEAN DEFAULT true
- created_at TIMESTAMPTZ DEFAULT NOW()

**tasks**:
- id UUID PK
- household_id UUID NOT NULL → households(id) ON DELETE CASCADE
- template_id UUID → task_templates(id) ON DELETE SET NULL
- description TEXT NOT NULL
- room TEXT DEFAULT 'Geral'
- assigned_to TEXT
- due_date DATE NOT NULL
- completed BOOLEAN DEFAULT false
- completed_by UUID → profiles(id)
- completed_at TIMESTAMPTZ
- created_at TIMESTAMPTZ DEFAULT NOW()

**events**:
- id UUID PK
- household_id UUID NOT NULL → households(id) ON DELETE CASCADE
- created_by UUID NOT NULL → profiles(id)
- description TEXT NOT NULL
- event_date_time TIMESTAMPTZ NOT NULL
- completed BOOLEAN DEFAULT false
- completed_by UUID → profiles(id)
- completed_at TIMESTAMPTZ
- created_at TIMESTAMPTZ DEFAULT NOW()

**notification_settings**:
- id UUID PK
- household_id UUID UNIQUE NOT NULL → households(id) ON DELETE CASCADE
- email_enabled BOOLEAN DEFAULT true
- reminder_time TEXT DEFAULT '16:00'
- reminder_freq TEXT DEFAULT 'daily'
- created_at TIMESTAMPTZ DEFAULT NOW()

### RLS Policies

Every table has row-level security. The pattern for all household-scoped tables:

```sql
-- Members can SELECT rows belonging to their household
CREATE POLICY "select own household" ON tasks FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);

-- Members can INSERT into their household
CREATE POLICY "insert own household" ON tasks FOR INSERT WITH CHECK (
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);
```

Profiles policy:
```sql
-- Users can read their own profile AND profiles in their household
CREATE POLICY "select profiles" ON profiles FOR SELECT USING (
  id = auth.uid() OR
  household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
);
```

### Triggers

- **`on_auth_user_created`**: After `auth.users` insert → creates row in `profiles`
- **`on_profile_created_without_household`**: After profile insert with no invite_code → creates a household automatically (admin = this user) + inserts household_members row

## Authentication Flow

### Supabase Auth + Next.js Middleware

1. **Login**: `supabase.auth.signInWithPassword()` → Supabase creates session cookie
2. **Middleware**: `middleware.ts` checks session on every `/app/*` and `/auth/*` request
   - No session on `/app/*` → redirect `/auth/login`
   - Valid session on `/auth/*` → redirect `/app/dashboard`
3. **Registration**: `supabase.auth.signUp()` → trigger creates profile → Server Action creates household (if no invite_code) or joins existing (if invite_code provided)
4. **Password reset**: Supabase Auth built-in flow (no custom JWT needed)
5. **Profile data**: Fetched via `supabase.from('profiles').select()` using the session user's ID

### Server-side client (`lib/supabase/server.ts`)

Used in Server Components and Server Actions. Reads cookies from the request.

### Browser client (`lib/supabase/client.ts`)

Used in Client Components for real-time subscriptions and auth state changes.

## Data Access Pattern

### Reads: Server Components

```tsx
// app/app/tarefas/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TasksPage() {
  const supabase = createClient()
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('household_id', householdId)
    .eq('due_date', today)
    .order('created_at')
  
  return <TaskList tasks={tasks} />
}
```

### Writes: Server Actions

```ts
// lib/actions/tasks.ts
'use server'

export async function createTask(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ... validate with Zod, insert, revalidatePath
}
```

### Replaces all Express route handlers

| Express route | New approach |
|---|---|
| POST /api/tasks | `createTask()` server action |
| PUT /api/tasks/:id/toggle | `toggleTask(id)` server action |
| GET /api/tasks | Server Component query |
| GET /api/tasks/stats | Server Component query |
| POST /api/tasks/generate | `generateTasks()` server action |
| POST /api/tasks/repeat | `repeatTasks()` server action |
| All household routes | Server actions + Server Components |
| All template routes | Server actions + Server Components |
| All notification routes | Server actions + Server Components |

### Exceptions (remain as API Routes)

- `app/api/auth/callback/route.ts` — OAuth callback for Supabase
- `app/api/cron/email-diario/route.ts` — Vercel Cron calls this via HTTP

## Email (Resend)

Drop the dual SMTP/Resend provider. Use Resend exclusively.

### React Email templates

Email templates are React components rendered server-side via `@react-email/components`:

- **Daily digest**: Lists pending tasks per household
- **Password reset**: Handled by Supabase Auth (built-in email templates)
- **Invite email**: Custom template with invite code + link
- **Test email**: Simple verification email

### Cron job (Vercel Cron)

```json
{
  "crons": [{
    "path": "/api/cron/email-diario",
    "schedule": "0 16 * * *"
  }]
}
```

The cron handler:
1. Uses service-role Supabase client to bypass RLS
2. Queries all households with `email_enabled = true`
3. For each household, gets pending tasks for today
4. For each member with `notifications_enabled = true`, sends email via Resend
5. Logs results

## UI / Component Architecture

### Page routing (matching current SPA pages)

| Current tab | New route | Component |
|---|---|---|
| Dashboard | /app/dashboard | DashboardPage |
| Tarefas | /app/tarefas | TasksPage |
| Membros | /app/membros | MembersPage |
| Config > Templates | /app/configuracoes | ConfigPage (Templates tab default) |
| Config > Notificações | /app/configuracoes/notificacoes | NotificationsPage |
| Config > Gerar | /app/configuracoes/gerar | GeneratePage |
| Config > Produtividade | /app/configuracoes/produtividade | ProductivityPage |

### Shared components (shadcn/ui)

Components installed via `npx shadcn@latest add [component]`:
- Navigation: Sidebar, Sheet (mobile menu), Tabs
- Forms: Button, Input, Select, Checkbox, Form, Label
- Data display: Card, Table, Badge, Progress, Avatar
- Feedback: Dialog, Toast, Skeleton, Alert

### Theme system

- CSS variables via Tailwind + shadcn/ui
- Light/dark mode toggle
- `next-themes` for theme persistence
- Respects `prefers-color-scheme`

### Mobile

- Bottom tab navigation on mobile (matches current behavior)
- Sidebar on desktop
- Responsive breakpoints via Tailwind

## Task Generation Logic

Migrated as-is from `server/models/Task.js` to a shared utility:

```ts
// lib/task-generation.ts
function shouldGenerateOnDate(template: Template, date: Date): boolean {
  switch (template.frequency) {
    case 'daily': return true
    case 'weekly': return date.getDay() === template.day_value
    case 'biweekly': return isBiweeklyMatch(date, template.day_value)
    case 'monthly': return date.getDate() === template.day_value
  }
}
```

Called by the `generateTasks()` server action. No behavioral changes.

## Data Migration Script

Located at `scripts/migrate-sqlite.ts`. Steps:

1. Connect to existing SQLite database
2. Connect to Supabase PostgreSQL
3. Migrate in dependency order:
   - auth.users → profiles (create Supabase auth users with same emails, then profiles)
   - households (with new UUIDs, store mapping old_id → new_uuid)
   - household_members
   - task_templates
   - tasks
   - events
   - notification_settings
4. Update sequences and verify row counts

## Environment Variables

```
# Required
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
RESEND_AUDIENCE_ID=...       # optional, for contact management

# Next.js
NEXT_PUBLIC_APP_URL=https://casaemordem.com.br

# Optional overrides
RESEND_FROM=noreply@casaemordem.com.br
```

## Out of scope (remove from new app)

- `/api/admin/smtp` endpoint and SMTP configuration UI — Resend replaces SMTP entirely
- SMTP env vars in `.env`
- `node-schedule` dependency
- `nodemailer` dependency
- Heroku Procfile
- Landing page pricing section (Supabase handles limits)
- QR code generation for invite codes (will be added in a follow-up since it requires a canvas/QR library)
