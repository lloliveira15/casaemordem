# Casa em Ordem

Task management app for couples with email notifications, Brazilian Portuguese UI.

## Commands

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # next lint
```

## Architecture

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Database**: Supabase PostgreSQL at `NEXT_PUBLIC_SUPABASE_URL`
- **Auth**: Supabase Auth (email/password) with SSR middleware
- **Email**: Resend API via `RESEND_API_KEY`
- **Styling**: Tailwind CSS 4 with shadcn/ui + malva/lilas custom theme
- **Icons**: phosphor-react (replaces lucide-react)
- **Font**: Plus Jakarta Sans via next/font
- **Deploy**: Vercel (cron jobs for daily email notifications)

## Environment

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side)
- `RESEND_API_KEY` — Resend email API key
- `RESEND_FROM` — Resend sender email
- `NEXT_PUBLIC_APP_URL` — public app URL (defaults to localhost in dev)

## Key Files

- `app/page.tsx` — Marketing landing page (hero, stats, features, testimonials, plans, CTA, footer)
- `app/app/dashboard/page.tsx` — Authenticated dashboard
- `app/app/tarefas/page.tsx` — Task management page
- `app/app/membros/page.tsx` — Member management page
- `app/app/configuracoes/` — Settings: templates, notifications, generate, productivity
- `app/auth/` — Login, register, password reset pages
- `middleware.ts` — Auth middleware (redirects unauthenticated users from /app/*)
- `lib/supabase/` — Supabase client (server, browser, admin)
- `lib/utils.ts` — Shared utilities (date formatting, room options, frequency labels)
- `lib/validations.ts` — Zod schemas for auth forms
- `lib/actions/` — Server actions (generate tasks, household, notifications, templates)
- `components/ui/` — shadcn/ui primitives (button, card, checkbox, progress, select)
- `components/landing/` — Landing page components
- `components/layout/sidebar.tsx` — App sidebar (phosphor icons)
- `supabase/migrations/` — Database schema migrations

## Database

Supabase PostgreSQL with RLS. Tables: profiles, households, household_members, task_templates, tasks, events, notification_settings. Triggers auto-create profile + household + member on signup.
