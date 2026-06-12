# Visual Restoration — Malva/Lilas Theme + Landing Page

## Objective

Restore the original malva/lilas visual identity and full marketing landing page from the Vanilla JS app into the Next.js 15 + Supabase project, replacing the default shadcn/ui neutral theme.

## Scope

1. Design token system (globals.css)
2. Typography (Plus Jakarta Sans)
3. Icon migration (lucide-react → phosphor-react)
4. Landing page (full replica of public/landing.html)
5. App theme updates (sidebar, components, pages)

## 1. Design Token System

### globals.css

Replace all shadcn/ui neutral oklch CSS variables with the original malva/lilas hex palette.

**Light mode:**

| Variable | Value |
|---|---|
| `--primary` | `#7C3AED` |
| `--primary-dark` | `#5B21B6` |
| `--primary-light` | `#F5F3FF` |
| `--primary-subtle` | `#A78BFA` |
| `--accent` | `#EA580C` |
| `--accent-dark` | `#C2410C` |
| `--accent-light` | `#FFF7ED` |
| `--background` | `#FAF5FF` |
| `--foreground` | `#1F1B2E` |
| `--card` | `#FFFFFF` |
| `--card-foreground` | `#1F1B2E` |
| `--muted` | `#F0E8F8` |
| `--muted-foreground` | `#6B5B8D` |
| `--border` | `#E8E0F0` |
| `--input` | `#E8E0F0` |
| `--ring` | `#7C3AED` |
| `--destructive` | `#DC2626` |
| `--success` | `#059669` |
| `--sidebar-background` | `#5B21B6` |
| `--sidebar-foreground` | `#FFFFFF` |
| `--sidebar-primary` | `#7C3AED` |
| `--sidebar-accent` | `#6D28D9` |
| `--sidebar-border` | `#4C1D95` |
| `--radius` | `0.75rem` |

**Dark mode:**

| Variable | Value |
|---|---|
| `--primary` | `#A78BFA` |
| `--primary-dark` | `#C4B5FD` |
| `--primary-light` | `#2D1B4E` |
| `--background` | `#0F0820` |
| `--foreground` | `#E8E0F0` |
| `--card` | `#1A1130` |
| `--muted` | `#22183A` |
| `--muted-foreground` | `#9C89B8` |
| `--border` | `#2E204A` |
| `--sidebar-background` | `#1A1130` |
| `--sidebar-foreground` | `#E8E0F0` |
| `--sidebar-primary` | `#7C3AED` |
| `--sidebar-accent` | `#2D1B4E` |

### Room Colors

Keep the 12 room color CSS variables identical to tokens.css:
- `--room-cozinha: #F97316`
- `--room-quarto: #3B82F6`
- `--room-sala: #8B5CF6`
- `--room-banheiro: #06B6D4`
- `--room-area-servico: #10B981`
- `--room-varanda: #84CC16`
- `--room-escritorio: #6B7280`
- `--room-hall: #EC4899`
- `--room-corredor: #EC4899`
- `--room-suite: #F472B6`
- `--room-lavabo: #06B6D4`
- `--room-geral: #7C3AED`

### Animations

- `@keyframes fadeIn` — opacity 0→1, translateY 8px→0
- `@keyframes shimmer` — skeleton loading gradient sweep
- `.skeleton`, `.skeleton-text`, `.skeleton-card`, `.skeleton-avatar` utility classes

### Safe Area

Reuse `env(safe-area-inset-*)` support for mobile devices.

### Prefers Reduced Motion

Respect `prefers-reduced-motion: reduce` by disabling animations/transitions.

## 2. Typography

- Import `Plus Jakarta Sans` via `next/font` in `app/layout.tsx`
- Set it as the default `--font-sans` in Tailwind's `@theme inline`
- Weights: 400, 500, 600, 700, 800

## 3. Icons

- Add `phosphor-react` dependency
- Replace `lucide-react` imports in all components with phosphor equivalents
- Key mapping:

| Usage | lucide | phosphor |
|---|---|---|
| Dashboard nav | `LayoutDashboard` | `ChartBar` |
| Tasks nav | `ListChecks` | `ListChecks` |
| Members nav | `Users` | `Users` |
| Settings nav | `Settings` | `GearSix` |
| Logout | `LogOut` | `SignOut` |
| Generic check | `Check` | `Check` |
| Generic plus | `Plus` | `Plus` |
| Menu toggle | `Menu` | `List` |
| Close | `X` | `X` |
| Calendar | `Calendar` | `CalendarBlank` |
| Bell | `Bell` | `Bell` |
| Star | `Star` | `Star` (fill) |
| Chevron left | `ChevronLeft` | `CaretLeft` |
| Chevron right | `ChevronRight` | `CaretRight` |
| Tulip logo | — | `FlowerTulip` |

## 4. Landing Page

Full replica of `public/landing.html` in `app/page.tsx`, split into components under `components/landing/`.

### Sections (in order)

#### LandingNav (`components/landing/landing-nav.tsx`)
"use client" — scroll listener for background/shadow, mobile hamburger toggle.
- Logo: `<PhosphorIcon FlowerTulip /> Casa em Ordem`
- Links: Funcionalidades, Depoimentos, Planos, Entrar (button)
- Mobile: toggle button, full-width dropdown

#### Hero (`components/landing/hero.tsx`)
Server component, pure CSS mockup.
- Grid 2-col (1-col on mobile)
- Title: "Organize as tarefas da sua casa **com quem você ama**" (gradient roxo→laranja via `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`)
- Subtitle + 2 CTA buttons ("Criar conta gratuita" → /auth/cadastro, "Ver funcionalidades" → #features)
- Mockup: window chrome (traffic light dots), sidebar roxo escuro, task list, date header, progress bar

#### Stats (`components/landing/stats.tsx`)
"use client" — IntersectionObserver triggers animated counters.
- Background: primary (#7C3AED)
- 3 counters: 10k+ tarefas, 500+ casas, 98% satisfação
- Animation: cubic ease-out over 2s, triggered once when visible
- Mobile: single column

#### Features (`components/landing/features.tsx`)
Server component.
- Section tag: "Funcionalidades"
- Title: "Tudo que você precisa para manter a casa em ordem"
- Grid 3-col (2-col tablet, 1-col mobile)
- 6 cards with Phosphor icon, title, description:
  1. Tarefas Diárias (ListChecks)
  2. Templates Personalizáveis (ClipboardText)
  3. Notificações por Email (Bell)
  4. Produtividade por Membro (ChartBar)
  5. Convite por QR Code (QrCode)
  6. Geração Automática (CalendarPlus)

#### Testimonials (`components/landing/testimonials.tsx`)
"use client" — carousel with dots, prev/next buttons, touch swipe.
- Background: bg color
- 3 testimonial cards with 5 stars, quote, author avatar (colored circle + initial)
- Desktop: 2 cards visible, 1 slide = shift by 2
- Mobile: 1 card visible, 1 slide = shift by 1
- Touch: swipe left/right with 50px threshold
- Resize: recalculate slide position

#### Plans (`components/landing/plans.tsx`)
Server component.
- Grid 2-col
- Free: R$ 0/mês, até 2 membros, features with check/x
- Premium: "Mais Popular" badge, "Em breve", full feature list
- CTA buttons: "Começar grátis" / "Lista de espera"

#### CTA Section (`components/landing/cta-section.tsx`)
Server component.
- Background: gradient from primary-dark to primary
- Title: "Pronto para organizar sua casa?"
- Subtitle + white CTA button "Começar grátis"

#### LandingFooter (`components/landing/footer.tsx`)
Server component.
- Grid 4-col: logo+description, Produto, Suporte, Legal
- Bottom bar: copyright

### Dependencies
- `phosphor-react` for all icons
- `next/link` for navigation
- No external CSS files — all styling via Tailwind utility classes and CSS variables

## 5. App Theme Updates

### Sidebar (`components/layout/sidebar.tsx`)
- Background: `bg-sidebar-background` (roxo escuro)
- Text: `text-sidebar-foreground` (branco)
- Active item: `bg-sidebar-primary text-sidebar-primary-foreground`
- Hover: `hover:bg-sidebar-accent`

### shadcn/ui Components
- button, card, checkbox, progress, select — adapt automatically via CSS variables
- No manual changes needed unless hardcoded colors exist

### Dashboard
- Cards with white background, subtle purple shadow
- Progress bars with gradient (primary → accent)

### Pages (tarefas, membros, templates, configuracoes)
- Inherit theme from CSS variables automatically

## 6. Implementation Order

Even though the user chose "all at once", the practical build order within the single PR is:

1. **Install phosphor-react** + plus jakarta sans
2. **Write globals.css** with full token system + animations + room colors
3. **Update layout.tsx** — add Plus Jakarta Sans font, metadata for landing
4. **Build landing components** (8 files under components/landing/)
5. **Rewrite app/page.tsx** to compose landing components
6. **Update sidebar** with malva styling
7. **Migrate icons** — replace lucide imports with phosphor throughout components
8. **Verify build** — `npm run build` in nextjs/

## Files Modified/Created

### New files:
- `components/landing/landing-nav.tsx`
- `components/landing/hero.tsx`
- `components/landing/stats.tsx`
- `components/landing/features.tsx`
- `components/landing/testimonials.tsx`
- `components/landing/plans.tsx`
- `components/landing/cta-section.tsx`
- `components/landing/footer.tsx`

### Modified files:
- `app/globals.css` — full token replacement
- `app/layout.tsx` — add font, improve metadata
- `app/page.tsx` — full landing page rewrite
- `components/layout/sidebar.tsx` — icon migration + style updates
- `components/dashboard/stats-cards.tsx` — icon migration
- `components/dashboard/today-tasks.tsx` — icon migration
- `components/tasks/*.tsx` — icon migration
- `components/members/*.tsx` — icon migration
- `components/templates/*.tsx` — icon migration
- `components/ui/button.tsx` — icon migration
- `components/ui/card.tsx` — style adaptation
- `app/app/layout.tsx` — icon migration

### Dependencies added:
- `phosphor-react`
