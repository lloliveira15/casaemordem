# Todo Layout Redesign — Casa em Ordem

## Overview

Redesign visual e de layout do app Casa em Ordem, trocando o tema azul/cinza por uma paleta malva elegante (lilás sóbrio) e implementando layout responsivo com sidebar no desktop.

## Color Palette (Malva Elegante)

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#f9f5f9` | Page background |
| Surface | `#ffffff` | Cards, sidebar, modals |
| Border | `#e8dce8` | Card borders, dividers |
| Primary | `#9b6b9d` | Buttons, badges, active states, toggles |
| Primary Light | `#f5eff5` | Active nav bg, tags, subtle highlights |
| Primary Dark | `#5c3d5e` | Headings, logo text |
| Text Primary | `#3d2d3f` | Task descriptions, body text |
| Text Muted | `#8b6b8d` | Labels, secondary text, metadata |
| Text Subtle | `#b89bb8` | Placeholder, disabled, muted elements |
| Dashed | `#d5b8d5` | Dashed borders (add buttons) |
| Progress Bar | `#c4aac4` | Secondary progress fill |

## Layout

### Mobile (< 768px)

- **Header**: Compact, logo + pending badge
- **Navigation**: Bottom tab bar (Tarefas, Config, Progresso, Perfil)
- **Content**: Single column, full width
- **Cards**: Full-width task items with rounded corners

### Desktop (>= 768px)

- **Sidebar** (220px): Fixed left, contains logo, nav items, user info + logout
- **Content area**: Grid layout with 2 columns (1.8fr / 1fr)
- **Left column**: Task list with date navigation pills (Ontem/Hoje/Amanhã)
- **Right column**: Widgets (pending count, productivity, members)

## Components

### Sidebar (desktop only)
- Logo + tagline at top
- Nav items: Tarefas, Configurações, Progresso, Membros
- Active state: `background: #f5eff5, color: #9b6b9d`
- Bottom: current user name + logout link

### Bottom Nav (mobile only)
- 4 tabs replacing the sidebar nav
- Active state same as sidebar

### Header
- Always visible, shows logo + pending count badge
- Desktop: integrated with top of content area (sidebar handles nav)
- Mobile: header only, nav is at bottom

### Date Navigation
- Pills: Ontem | Hoje | Amanhã
- "Hoje" is always filled (primary color)
- Desktop: aligned right next to section title
- Mobile: centered

### Task Items
- White card with border `#e8dce8`, border-radius 12px
- Checkbox with `accent-color: #9b6b9d`
- Task description + room in muted color
- Assignee as small tag `background: #f5eff5`
- Check button (circle) on right
- Completed tasks: opacity 0.55, strikethrough text
- Hover: subtle shadow lift

### Add Task Button
- Dashed border `#d5b8d5`, border-radius 12px
- Full width, white background
- Text: "+ Adicionar tarefa" in primary color

### Right Column Widgets (desktop)
1. **Pending Count**: Gradient bg, big number, thin progress bar
2. **Productivity**: Per-member bar chart with percentage
3. **Members**: Tags with names, "+ Convidar" dashed tag

### Config Page (desktop)
- Same sidebar, content area shows config sub-tabs
- Current sub-tab layout works but with new colors

### Task Picker Modal
- Same modal structure but with new border radius and colors
- Suggestion items hover: background `#9b6b9d`

## Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 768px | Mobile: bottom nav, single column |
| >= 768px | Desktop: sidebar, 2-column grid |
| >= 1200px | Desktop expanded: max comfortable width |

## Transitions & Animation

- All interactive elements: `transition: all 0.2s`
- Sidebar nav items: smooth color/bg transition
- Task items: subtle shadow on hover
- Checkbox/button hover: slight scale or color shift

## Accessibility

- `prefers-reduced-motion` respected (already in codebase)
- Focus-visible outlines in primary color
- Sufficient contrast ratios for all text
- Touch targets >= 44px on mobile

## Files to Modify

- `public/index.html` — all CSS variables, HTML structure (sidebar, bottom nav), JS for responsive behavior

## What WON'T Change

- App logic (auth, tasks CRUD, templates, notifications, productivity)
- Server-side code
- Database schema
- API endpoints
- Phosphor Icons library
