# Visual Restoration — Malva/Lilas Theme + Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original malva/lilas visual identity and full marketing landing page from the Vanilla JS app into the Next.js 15 project.

**Architecture:** Replace shadcn/ui neutral CSS variables with the original hex palette, add Plus Jakarta Sans via next/font, swap lucide-react for phosphor-react, rebuild the landing page as component files under `components/landing/`, update sidebar styling.

**Tech Stack:** Next.js 15, Tailwind CSS 4, shadcn/ui, phosphor-react, next/font

---

### Task 1: Install phosphor-react

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add phosphor-react dependency**

Run:
```bash
npm install phosphor-react
```

Expected: package.json updated with `"phosphor-react"` dependency and `node_modules` updated.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add phosphor-react dependency"
```

---

### Task 2: Rewrite globals.css with malva/lilas token system

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace entire globals.css**

Write `app/globals.css`:

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  --background: #FAF5FF;
  --foreground: #1F1B2E;
  --card: #FFFFFF;
  --card-foreground: #1F1B2E;
  --popover: #FFFFFF;
  --popover-foreground: #1F1B2E;
  --primary: #7C3AED;
  --primary-foreground: #FFFFFF;
  --secondary: #F5F3FF;
  --secondary-foreground: #5B21B6;
  --muted: #F0E8F8;
  --muted-foreground: #6B5B8D;
  --accent: #EA580C;
  --accent-foreground: #FFFFFF;
  --destructive: #DC2626;
  --destructive-foreground: #FFFFFF;
  --success: #059669;
  --border: #E8E0F0;
  --input: #E8E0F0;
  --ring: #7C3AED;
  --radius: 0.75rem;
  --sidebar-background: #5B21B6;
  --sidebar-foreground: #FFFFFF;
  --sidebar-primary: #7C3AED;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #6D28D9;
  --sidebar-accent-foreground: #FFFFFF;
  --sidebar-border: #4C1D95;
  --sidebar-ring: #7C3AED;
  /* Shadows with purple nuance */
  --shadow-sm: 0 1px 3px rgba(124,58,237,0.08);
  --shadow-md: 0 4px 12px rgba(124,58,237,0.12);
  --shadow-lg: 0 8px 24px rgba(124,58,237,0.12);
  /* Room colors */
  --room-cozinha: #F97316;
  --room-quarto: #3B82F6;
  --room-sala: #8B5CF6;
  --room-banheiro: #06B6D4;
  --room-area-servico: #10B981;
  --room-varanda: #84CC16;
  --room-escritorio: #6B7280;
  --room-hall: #EC4899;
  --room-corredor: #EC4899;
  --room-suite: #F472B6;
  --room-lavabo: #06B6D4;
  --room-geral: #7C3AED;
}

.dark {
  --background: #0F0820;
  --foreground: #E8E0F0;
  --card: #1A1130;
  --card-foreground: #E8E0F0;
  --popover: #1A1130;
  --popover-foreground: #E8E0F0;
  --primary: #A78BFA;
  --primary-foreground: #0F0820;
  --secondary: #2D1B4E;
  --secondary-foreground: #C4B5FD;
  --muted: #22183A;
  --muted-foreground: #9C89B8;
  --accent: #F97316;
  --accent-foreground: #0F0820;
  --destructive: #EF4444;
  --destructive-foreground: #0F0820;
  --success: #34D399;
  --border: #2E204A;
  --input: #2E204A;
  --ring: #A78BFA;
  --sidebar-background: #1A1130;
  --sidebar-foreground: #E8E0F0;
  --sidebar-primary: #7C3AED;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #2D1B4E;
  --sidebar-accent-foreground: #E8E0F0;
  --sidebar-border: #2E204A;
  --sidebar-ring: #A78BFA;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
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
  --color-success: var(--success);
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
  --color-room-cozinha: var(--room-cozinha);
  --color-room-quarto: var(--room-quarto);
  --color-room-sala: var(--room-sala);
  --color-room-banheiro: var(--room-banheiro);
  --color-room-area-servico: var(--room-area-servico);
  --color-room-varanda: var(--room-varanda);
  --color-room-escritorio: var(--room-escritorio);
  --color-room-hall: var(--room-hall);
  --color-room-corredor: var(--room-corredor);
  --color-room-suite: var(--room-suite);
  --color-room-lavabo: var(--room-lavabo);
  --color-room-geral: var(--room-geral);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --shadow-custom-sm: var(--shadow-sm);
  --shadow-custom-md: var(--shadow-md);
  --shadow-custom-lg: var(--shadow-lg);
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes counterUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Skeleton utility classes */
:where(.skeleton) {
  background: linear-gradient(90deg, var(--border) 25%, var(--muted) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  color: transparent !important;
  user-select: none;
  pointer-events: none;
}

.skeleton-text { height: 14px; margin-bottom: 8px; width: 100%; }
.skeleton-text\.short { width: 60%; }
.skeleton-text\.tiny { width: 40%; }
.skeleton-card { height: 80px; margin-bottom: 12px; }
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }

/* Safe area support */
@supports (padding-top: env(safe-area-inset-top)) {
  :root {
    --safe-top: env(safe-area-inset-top);
    --safe-bottom: env(safe-area-inset-bottom);
    --safe-left: env(safe-area-inset-left);
    --safe-right: env(safe-area-inset-right);
  }
}

@supports not (padding-top: env(safe-area-inset-top)) {
  :root { --safe-top: 0px; --safe-bottom: 0px; --safe-left: 0px; --safe-right: 0px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify file writes correctly**

```bash
wc -l app/globals.css
```

Expected output: ~180 lines

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace shadcn/ui tokens with malva/lilas palette"
```

---

### Task 3: Update layout.tsx with Plus Jakarta Sans font

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add Plus Jakarta Sans font + improved metadata**

Write `app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
})

export const metadata: Metadata = {
  title: "Casa em Ordem - Organize as tarefas da sua casa com quem você ama",
  description:
    "Crie, atribua e acompanhe tarefas domésticas em casal. Com templates inteligentes, lembretes por email e relatórios de produtividade.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={plusJakartaSans.variable}>
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

- [ ] **Step 2: Set Plus Jakarta Sans as default font in tailwind**

Add to `app/globals.css` inside `@theme inline {}`:

```css
--font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
```

Add this line after `--shadow-custom-lg` definition (before the closing brace).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: add Plus Jakarta Sans via next/font"
```

---

### Task 4: Build landing page components

**Files:**
- Create: `components/landing/landing-nav.tsx`
- Create: `components/landing/hero.tsx`
- Create: `components/landing/stats.tsx`
- Create: `components/landing/features.tsx`
- Create: `components/landing/testimonials.tsx`
- Create: `components/landing/plans.tsx`
- Create: `components/landing/cta-section.tsx`
- Create: `components/landing/footer.tsx`

#### Subtask 4a: landing-nav.tsx

- [ ] **Step 1: Create components/landing/ directory**

```bash
mkdir -p components/landing
```

- [ ] **Step 2: Write landing-nav.tsx**

```tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FlowerTulip, List, X } from "phosphor-react"

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-200 ${
        scrolled ? "bg-white/95 backdrop-blur shadow-[var(--shadow-sm)]" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#5B21B6] flex items-center gap-2">
          <FlowerTulip className="text-[#7C3AED] size-6" />
          Casa em Ordem
        </Link>

        <div
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row fixed md:static top-[60px] left-0 right-0 bg-white md:bg-transparent p-6 md:p-0 shadow-lg md:shadow-none gap-3 md:gap-6 md:items-center`}
        >
          <Link href="#features" className="text-sm font-medium text-[#6B5B8D] hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
            Funcionalidades
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-[#6B5B8D] hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
            Depoimentos
          </Link>
          <Link href="#plans" className="text-sm font-medium text-[#6B5B8D] hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
            Planos
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-5 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#5B21B6] transition-colors"
            onClick={() => setOpen(false)}
          >
            Entrar
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#F5F3FF] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <List className="size-6" />}
        </button>
      </div>
    </nav>
  )
}
```

#### Subtask 4b: hero.tsx

- [ ] **Step 3: Write hero.tsx**

```tsx
import Link from "next/link"
import { FlowerTulip, ListChecks, CalendarBlank } from "phosphor-react"

export function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-[120px] pb-20 grid md:grid-cols-2 gap-16 items-center min-h-[90vh]">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1F1B2E] mb-5">
          Organize as tarefas da sua casa{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#EA580C] bg-clip-text text-transparent">
            com quem você ama
          </span>
        </h1>
        <p className="text-lg text-[#6B5B8D] leading-relaxed mb-8">
          Crie, atribua e acompanhe tarefas domésticas em casal. Com templates inteligentes,
          lembretes por email e relatórios de produtividade, sua casa nunca esteve tão em ordem.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/auth/cadastro"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#7C3AED] text-white rounded-lg text-base font-semibold hover:bg-[#5B21B6] hover:-translate-y-0.5 transition-all"
          >
            Criar conta gratuita
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-[#1F1B2E] border-2 border-[#E8E0F0] rounded-lg text-base font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
          >
            Ver funcionalidades
          </Link>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-[var(--shadow-lg)] overflow-hidden border border-[#E8E0F0]">
          <div className="bg-[#FAF5FF] px-4 py-3 flex gap-1.5 border-b border-[#E8E0F0]">
            <span className="size-2.5 rounded-full bg-red-500" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex min-h-[280px]">
            <div className="w-12 bg-[#5B21B6] pt-3 pb-3 flex flex-col items-center gap-4">
              <FlowerTulip className="size-5 text-white" />
              <div className="size-8 flex items-center justify-center rounded-md bg-white/15 text-white">
                <ListChecks className="size-4" />
              </div>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-2.5">
              <div className="text-sm font-semibold text-[#5B21B6] flex items-center gap-1.5 mb-1">
                <CalendarBlank className="size-4" /> Hoje
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#FAF5FF] rounded-lg text-xs">
                <input type="checkbox" defaultChecked className="accent-[#7C3AED]" />
                <span className="flex-1 line-through opacity-50">Lavar louça</span>
                <span className="px-2 py-0.5 bg-[#F5F3FF] rounded-full text-[11px] text-[#7C3AED] font-semibold">Maria</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#FAF5FF] rounded-lg text-xs">
                <input type="checkbox" className="accent-[#7C3AED]" />
                <span className="flex-1">Aspirar sala</span>
                <span className="px-2 py-0.5 bg-[#F5F3FF] rounded-full text-[11px] text-[#7C3AED] font-semibold">João</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#FAF5FF] rounded-lg text-xs">
                <input type="checkbox" className="accent-[#7C3AED]" />
                <span className="flex-1">Regar plantas</span>
                <span className="px-2 py-0.5 bg-[#F5F3FF] rounded-full text-[11px] text-[#7C3AED] font-semibold">Maria</span>
              </div>
              <div className="px-3 py-2.5 border border-dashed border-[#A78BFA] rounded-lg text-xs text-[#A78BFA] text-center">
                + Adicionar tarefa
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-[#E8E0F0] bg-[#FAF5FF] flex items-center gap-2.5 text-xs font-semibold text-[#7C3AED]">
            <div className="flex-1 h-1.5 bg-[#E8E0F0] rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-[#7C3AED] to-[#EA580C] rounded-full" />
            </div>
            <span>33%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

#### Subtask 4c: stats.tsx

- [ ] **Step 4: Write stats.tsx**

```tsx
"use client"

import { useEffect, useRef, useState } from "react"

function AnimatedNumber({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const start = performance.now()

          function update(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const value = Math.round(eased * target)
            setCurrent(value)
            if (progress < 1) requestAnimationFrame(update)
          }

          requestAnimationFrame(update)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  const display =
    target === 98 ? `${current}%` : `${current.toLocaleString("pt-BR")}${suffix}`

  return <div ref={ref} className="text-4xl md:text-5xl font-extrabold leading-none mb-2">{display}</div>
}

export function Stats() {
  return (
    <section className="bg-[#7C3AED] py-12 px-6">
      <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
        <div>
          <AnimatedNumber target={10000} suffix="+" />
          <div className="text-base opacity-85 font-medium">tarefas concluídas</div>
        </div>
        <div>
          <AnimatedNumber target={500} suffix="+" />
          <div className="text-base opacity-85 font-medium">casas organizadas</div>
        </div>
        <div>
          <AnimatedNumber target={98} suffix="%" />
          <div className="text-base opacity-85 font-medium">% de satisfação</div>
        </div>
      </div>
    </section>
  )
}
```

#### Subtask 4d: features.tsx

- [ ] **Step 5: Write features.tsx**

```tsx
import { ListChecks, ClipboardText, Bell, ChartBar, QrCode, CalendarPlus, Star } from "phosphor-react"

const features = [
  { icon: ListChecks, title: "Tarefas Diárias", desc: "Crie e gerencie tarefas por data, ambiente e responsável. Visualize o que precisa ser feito hoje, amanhã ou na semana." },
  { icon: ClipboardText, title: "Templates Personalizáveis", desc: "Crie modelos de tarefas recorrentes por ambiente e frequência. Economize tempo não precisando digitar sempre as mesmas tarefas." },
  { icon: Bell, title: "Notificações por Email", desc: "Receba lembretes diários das tarefas pendentes. Configure a frequência e o horário ideal para você e seu parceiro." },
  { icon: ChartBar, title: "Produtividade por Membro", desc: "Acompanhe a taxa de conclusão de cada membro da casa. Veja quem está contribuindo mais com gráficos claros." },
  { icon: QrCode, title: "Convite por QR Code", desc: "Compartilhe o código da sua casa com outros membros via QR Code, link ou email. Convidar é rápido e prático." },
  { icon: CalendarPlus, title: "Geração Automática", desc: "Gere tarefas para o mês, semana ou dia baseado nos seus templates. Repita tarefas de períodos anteriores com um clique." },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5F3FF] text-[#7C3AED] rounded-full text-sm font-semibold mb-4">
          <Star className="size-4" /> Funcionalidades
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F1B2E] mb-3">
          Tudo que você precisa para manter a casa em ordem
        </h2>
        <p className="text-base text-[#6B5B8D] leading-relaxed">
          Ferramentas simples e poderosas para dividir as tarefas domésticas com transparência
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-xl p-8 border border-[#F0E8F8] hover:shadow-[var(--shadow-md)] hover:border-[#A78BFA] transition-all">
            <div className="size-12 flex items-center justify-center bg-[#F5F3FF] rounded-xl text-2xl text-[#7C3AED] mb-4">
              <f.icon className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F1B2E] mb-2">{f.title}</h3>
            <p className="text-sm text-[#6B5B8D] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

#### Subtask 4e: testimonials.tsx

- [ ] **Step 6: Write testimonials.tsx**

```tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, CaretLeft, CaretRight, Chats } from "phosphor-react"

const testimonials = [
  {
    text: "Desde que começamos a usar o Casa em Ordem, as brigas por tarefa doméstica acabaram. Sabemos exatamente quem faz o quê e quando.",
    author: "Ana e Carlos",
    time: "Usuários há 6 meses",
    color: "#7C3AED",
    initial: "A",
  },
  {
    text: "Os templates semanais são incríveis! Montamos nossa rotina de limpeza uma vez e as tarefas são geradas automaticamente toda semana.",
    author: "Marina e Pedro",
    time: "Usuários há 3 meses",
    color: "#EA580C",
    initial: "M",
  },
  {
    text: "O relatório de produtividade virou nosso aliado. Dá para ver claramente quem está ajudando mais e ajustar a divisão das tarefas.",
    author: "Rafael e Julia",
    time: "Usuários há 1 ano",
    color: "#059669",
    initial: "R",
  },
]

export function Testimonials() {
  const [slide, setSlide] = useState(0)
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
  const totalSlides = isMobile ? testimonials.length - 1 : Math.ceil(testimonials.length / 2) - 1

  const goTo = useCallback((i: number) => {
    setSlide(Math.max(0, Math.min(i, totalSlides)))
  }, [totalSlides])

  useEffect(() => {
    function onResize() {
      setSlide((prev) => Math.min(prev, Math.ceil(testimonials.length / 2) - 1))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5F3FF] text-[#7C3AED] rounded-full text-sm font-semibold mb-4">
          <Chats className="size-4" /> Depoimentos
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F1B2E] mb-3">Quem usa, aprova</h2>
        <p className="text-base text-[#6B5B8D] leading-relaxed">
          Veja o que outros casais estão dizendo sobre o Casa em Ordem
        </p>
      </div>
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden mb-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 border border-[#F0E8F8] transition-transform duration-300"
              style={{
                display: isMobile && i < slide ? "none" : undefined,
              }}
            >
              <div className="flex gap-1 text-amber-400 text-base mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="size-4" weight="fill" />
                ))}
              </div>
              <p className="text-sm text-[#1F1B2E] leading-relaxed italic mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="size-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initial}
                </div>
                <div>
                  <strong className="block text-sm text-[#1F1B2E]">{t.author}</strong>
                  <span className="text-xs text-[#6B5B8D]">{t.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(slide - 1)}
            className="size-10 rounded-full border border-[#E8E0F0] bg-white flex items-center justify-center text-[#6B5B8D] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
            aria-label="Anterior"
          >
            <CaretLeft className="size-4" />
          </button>
          <div className="flex gap-1.5">
            {[...Array(totalSlides + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === slide ? "w-6 bg-[#7C3AED]" : "w-2 bg-[#E8E0F0]"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(slide + 1)}
            className="size-10 rounded-full border border-[#E8E0F0] bg-white flex items-center justify-center text-[#6B5B8D] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
            aria-label="Próximo"
          >
            <CaretRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
```

#### Subtask 4f: plans.tsx

- [ ] **Step 7: Write plans.tsx**

```tsx
import Link from "next/link"
import { Check, X, Tag } from "phosphor-react"

export function Plans() {
  return (
    <section id="plans" className="py-24 px-6 max-w-[900px] mx-auto">
      <div className="text-center max-w-[640px] mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5F3FF] text-[#7C3AED] rounded-full text-sm font-semibold mb-4">
          <Tag className="size-4" /> Planos
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F1B2E] mb-3">
          Escolha o plano ideal para você
        </h2>
        <p className="text-base text-[#6B5B8D] leading-relaxed">
          Comece grátis e faça upgrade quando precisar de mais
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-xl p-10 border border-[#F0E8F8]">
          <div className="text-sm font-bold text-[#6B5B8D] uppercase tracking-wide mb-4">Grátis</div>
          <div className="text-5xl font-extrabold text-[#1F1B2E] mb-6">
            R$ 0<span className="text-base font-normal text-[#6B5B8D]">/mês</span>
          </div>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Até 2 membros", true],
              ["Templates básicos", true],
              ["Notificações diárias", true],
              ["Convite por código", true],
              ["Membros ilimitados", false],
              ["Relatórios avançados", false],
              ["Suporte prioritário", false],
            ].map(([label, included]) => (
              <li key={label as string} className="flex items-center gap-2.5 text-sm text-[#1F1B2E]">
                {included ? (
                  <Check className="size-4 text-[#059669]" />
                ) : (
                  <X className="size-4 text-[#9C89B8]" />
                )}
                {label as string}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/cadastro"
            className="block text-center py-3 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#5B21B6] transition-colors"
          >
            Começar grátis
          </Link>
        </div>

        <div className="bg-white rounded-xl p-10 border-2 border-[#7C3AED] shadow-[0_4px_20px_rgba(124,58,237,0.15)] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            Mais Popular
          </div>
          <div className="text-sm font-bold text-[#6B5B8D] uppercase tracking-wide mb-4">Premium</div>
          <div className="text-5xl font-extrabold text-[#1F1B2E] mb-6">
            Em breve<span className="text-base font-normal text-[#6B5B8D]" />
          </div>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              ["Membros ilimitados", true],
              ["Templates avançados", true],
              ["Notificações personalizadas", true],
              ["Relatórios de produtividade", true],
              ["Suporte prioritário", true],
              ["Histórico completo", true],
              ["Exportação de dados", true],
            ].map(([label, included]) => (
              <li key={label as string} className="flex items-center gap-2.5 text-sm text-[#1F1B2E]">
                {included ? (
                  <Check className="size-4 text-[#059669]" />
                ) : (
                  <X className="size-4 text-[#9C89B8]" />
                )}
                {label as string}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/login"
            className="block text-center py-3 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#5B21B6] transition-colors"
          >
            Lista de espera
          </Link>
        </div>
      </div>
    </section>
  )
}
```

#### Subtask 4g: cta-section.tsx + footer.tsx

- [ ] **Step 8: Write cta-section.tsx**

```tsx
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-6 text-center bg-gradient-to-br from-[#5B21B6] to-[#7C3AED]">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Pronto para organizar sua casa?
        </h2>
        <p className="text-base text-white/85 mb-8 leading-relaxed">
          Cadastre-se grátis e comece a dividir as tarefas domésticas de forma justa e transparente.
        </p>
        <Link
          href="/auth/cadastro"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#5B21B6] rounded-lg text-base font-semibold hover:bg-[#F5F3FF] hover:-translate-y-0.5 transition-all"
        >
          Começar grátis
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 9: Write footer.tsx**

```tsx
import Link from "next/link"
import { FlowerTulip } from "phosphor-react"

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-[#E8E0F0] pt-16 pb-6 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold text-[#5B21B6] flex items-center gap-2 mb-3">
            <FlowerTulip className="text-[#7C3AED] size-6" />
            Casa em Ordem
          </div>
          <p className="text-sm text-[#6B5B8D] leading-relaxed max-w-[280px]">
            Organize as tarefas da sua casa com quem você ama.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#1F1B2E] mb-4">Produto</h4>
          {[
            ["Funcionalidades", "#features"],
            ["Planos", "#plans"],
            ["Entrar", "/auth/login"],
          ].map(([label, href]) => (
            <Link
              key={label as string}
              href={href as string}
              className="block text-sm text-[#6B5B8D] mb-2.5 hover:text-[#7C3AED] transition-colors"
            >
              {label as string}
            </Link>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#1F1B2E] mb-4">Suporte</h4>
          {["Central de ajuda", "Contato", "Status"].map((label) => (
            <a
              key={label}
              href="#"
              className="block text-sm text-[#6B5B8D] mb-2.5 hover:text-[#7C3AED] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#1F1B2E] mb-4">Legal</h4>
          {["Privacidade", "Termos"].map((label) => (
            <a
              key={label}
              href="#"
              className="block text-sm text-[#6B5B8D] mb-2.5 hover:text-[#7C3AED] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto pt-6 border-t border-[#F0E8F8] text-center text-xs text-[#9C89B8]">
        &copy; {new Date().getFullYear()} Casa em Ordem. Todos os direitos reservados.
      </div>
    </footer>
  )
}
```

- [ ] **Step 10: Commit landing components**

```bash
git add components/landing/
git commit -m "feat: add landing page components (nav, hero, stats, features, testimonials, plans, cta, footer)"
```

---

### Task 5: Rewrite app/page.tsx as the full landing page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write new page.tsx**

```tsx
import { LandingNav } from "@/components/landing/landing-nav"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Features } from "@/components/landing/features"
import { Testimonials } from "@/components/landing/testimonials"
import { Plans } from "@/components/landing/plans"
import { CTASection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <Plans />
        <CTASection />
      </main>
      <LandingFooter />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewrite landing page with full replica of original marketing page"
```

---

### Task 6: Migrate lucide icons to phosphor in app components + update sidebar theme

**Files:**
- Modify: `components/layout/sidebar.tsx`
- Modify: `components/dashboard/today-tasks.tsx`
- Modify: `components/tasks/date-nav.tsx`
- Modify: `components/tasks/task-list.tsx`
- Modify: `components/members/member-card.tsx`
- Modify: `components/templates/template-list.tsx`

#### Subtask 6a: sidebar.tsx — icon migration + malva styling

- [ ] **Step 1: Update sidebar.tsx**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/app/auth/actions"
import {
  ChartBar,
  ListChecks,
  Users,
  GearSix,
  SignOut,
} from "phosphor-react"

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: ChartBar },
  { href: "/app/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/app/membros", label: "Membros", icon: Users },
  { href: "/app/configuracoes", label: "Configurações", icon: GearSix },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar-background text-sidebar-foreground p-4">
        <div className="text-lg font-bold mb-8 px-4 flex items-center gap-2">
          <span className="size-2 rounded-full bg-sidebar-primary" />
          Casa em Ordem
        </div>
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
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors"
          >
            <SignOut className="size-5" />
            Sair
          </button>
        </form>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50 safe-area-pb">
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

#### Subtask 6b: today-tasks.tsx

- [ ] **Step 2: Update today-tasks.tsx**

Change `import { Trash2 } from "lucide-react"` to `import { Trash } from "phosphor-react"` and update the JSX usage from `<Trash2 className="size-4" />` to `<Trash className="size-4" />`.

Edit `components/dashboard/today-tasks.tsx`:
- Line 5: `import { Trash2 } from "lucide-react"` → `import { Trash } from "phosphor-react"`
- Line 43: `<Trash2 className="size-4" />` → `<Trash className="size-4" />`

#### Subtask 6c: date-nav.tsx

- [ ] **Step 3: Update date-nav.tsx**

Edit `components/tasks/date-nav.tsx`:
- Line 5: `import { ChevronLeft, ChevronRight } from "lucide-react"` → `import { CaretLeft, CaretRight } from "phosphor-react"`
- Line 29: `<ChevronLeft className="size-4" />` → `<CaretLeft className="size-4" />`
- Line 35: `<ChevronRight className="size-4" />` → `<CaretRight className="size-4" />`

#### Subtask 6d: task-list.tsx

- [ ] **Step 4: Update task-list.tsx**

Edit `components/tasks/task-list.tsx`:
- Line 6: `import { Trash2 } from "lucide-react"` → `import { Trash } from "phosphor-react"`
- Line 96: `<Trash2 className="size-4" />` → `<Trash className="size-4" />`

#### Subtask 6e: member-card.tsx

- [ ] **Step 5: Update member-card.tsx**

Edit `components/members/member-card.tsx`:
- Line 6: `import { Pencil, Check, X } from "lucide-react"` → `import { Pencil, Check, X } from "phosphor-react"`
- JSX uses already match (`Check`, `X`, `Pencil`) — just the import changes

#### Subtask 6f: template-list.tsx

- [ ] **Step 6: Update template-list.tsx**

Edit `components/templates/template-list.tsx`:
- Line 6: `import { Trash2 } from "lucide-react"` → `import { Trash } from "phosphor-react"`
- Line 39: `<Trash2 className="size-4" />` → `<Trash className="size-4" />`

- [ ] **Step 7: Commit icon migrations**

```bash
git add components/layout/sidebar.tsx components/dashboard/today-tasks.tsx components/tasks/date-nav.tsx components/tasks/task-list.tsx components/members/member-card.tsx components/templates/template-list.tsx
git commit -m "feat: migrate lucide-react to phosphor-react across all components"
```

---

### Task 7: Build and verify

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: Build succeeds without errors. Note any TypeScript errors and fix them.

- [ ] **Step 2: Fix any build errors**

If there are TypeScript errors about missing types for phosphor-react, verify types are included.

If there are missing phosphor icon names, check the phosphor-react documentation and fix.

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "chore: fix build after visual restoration"
```
