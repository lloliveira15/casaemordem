# Design Spec: Landing Page + Dashboard Redesign

## Overview
Redesign completo da interface do Casa em Ordem: landing page separada para onboarding,
dashboard modernizado, CSS modular com design tokens, roteamento atualizado.

## Arquitetura de Arquivos

```
public/
├── css/
│   ├── tokens.css             # Design tokens + reset + utilidades
│   ├── landing.css            # Estilos da landing page
│   └── app.css                # Estilos do dashboard (extraído do index.html)
├── js/
│   ├── landing.js             # Interações da landing (scroll, contagem, carrossel)
│   └── app.js                 # Lógica do dashboard (extraído do index.html)
├── landing.html               # Landing page (servida em /)
└── index.html                 # Dashboard (servido em /app)
```

## Roteamento (server/app.js)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `GET /` | `landing.html` | Landing page |
| `GET /app` | `index.html` | Dashboard |
| `GET /login` | `index.html` | Dashboard com auth (backward compat) |
| `GET /api/*` | — | APIs existentes (mantidas) |
| `GET /auth/*` | — | Autenticação (mantida) |

## Design System

### Paleta de Cores
- **Primary:** `#7C3AED` (roxo) — botões, links, headings
- **Primary Dark:** `#5B21B6` — hover, seções de destaque
- **Primary Light:** `#F5F3FF` — cards, backgrounds sutis
- **Accent:** `#EA580C` (laranja) — CTAs, badges, estatísticas
- **Accent Dark:** `#C2410C` — hover do accent
- **Surface:** `#FFFFFF` — cards
- **Background:** `#FAF5FF` — fundo da página
- **Text:** `#1F1B2E` — texto principal
- **Text Muted:** `#6B5B8D` — texto secundário
- **Border:** `#E8E0F0` — bordas
- **Destructive:** `#DC2626` — ações destrutivas
- **Success:** `#059669` — sucesso

### Tipografia
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Headings:** 700–800 weight
- **Body:** 400 weight
- **Scale:** 12 / 14 / 16 / 18 / 24 / 32 / 40 / 48 / 64
- **Line-height:** 1.5 (body), 1.2 (headings)

### Spacing (4pt system)
`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80`

### Breakpoints
`375px / 640px / 768px / 1024px / 1280px`

### Efeitos
- **Radius:** 8px (sm), 12px (md), 16px (lg)
- **Shadows:** `0 1px 3px rgba(124,58,237,0.08)` (card), `0 8px 24px rgba(124,58,237,0.12)` (elevated)
- **Transitions:** 150–200ms ease

## Landing Page (landing.html + landing.css + landing.js)

### Seções
1. **Hero** — Header fixo transparente→sólido no scroll. Headline grande, subtítulo, CTA duplo, mockup do app.
2. **Estatísticas** — 3 números (10k+ tarefas, 500+ casas, 98% satisfação) com ícones laranja + contagem animada ao scroll.
3. **Funcionalidades** — Grid 3/2/1 colunas. 6 cards: Tarefas Diárias, Templates, Notificações, Produtividade, QR Code, Geração Automática.
4. **Depoimentos** — Carrossel horizontal com 2 cards visíveis (desktop) / 1 (mobile). Foto + nome + texto + estrelas.
5. **Planos** — Grátis (2 membros) vs Premium (ilimitado). Card em destaque com badge "Popular".
6. **CTA Final** — Seção roxa escura. Headline + botão branco.
7. **Footer** — 4 colunas (desktop) → empilhado (mobile). Logo + links + contato + copyright.

### Interações (landing.js)
- Navbar scroll (muda de transparente para bg sólida)
- Contagem animada ao entrar na viewport
- Carrossel de depoimentos (clique/swipe)
- Scroll suave para seções
- Botão "Começar grátis" → redireciona para `/login`

### Responsivo
- **Mobile:** seções empilhadas, hero com ilustração abaixo do texto, carrossel 1 card
- **Desktop:** hero em duas colunas, grid 3 colunas, carrossel 2 cards

## Dashboard (index.html → app.css + app.js)

### Estrutura Extraída
O `index.html` atual (3227 linhas) será dividido em:
- `index.html` — apenas HTML estrutural (template + container)
- `app.css` — todos os estilos (importados via `<link>`)
- `app.js` — todo o JavaScript (importado via `<script>`)

O conteúdo permanece semanticamente idêntico. Apenas a organização dos assets muda.

### Melhorias no CSS (app.css)
- Design tokens importados de `tokens.css`
- Nova paleta de cores (roxo + laranja)
- Cards com sombra sutil (sem borda externa)
- Botões com a nova paleta
- Melhor espaçamento (4pt system)
- Responsivo refinado

### Melhorias no Dashboard (visual)
- Sidebar com ícones maiores e hover states refinados
- Header com badge de pendências em destaque
- Widgets sem borda, só com sombra
- Toggle switches, modais, cards atualizados com a nova paleta
- Produtividade com cores da paleta

## Backend (server/app.js)

### Mudanças necessárias
```js
// Rota landing page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/landing.html');
});

// Rota dashboard (mantida para compatibilidade)
app.get('/app', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Rota login (redireciona para dashboard que mostra auth)
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});
```

### Assets estáticos
O Express já serve `public/` via `express.static('public')`. CSS e JS serão servidos automaticamente.

## Checklist de Implementação

### Fase 1: Base
1. Criar `public/css/tokens.css` com design tokens
2. Atualizar `server/app.js` com novas rotas
3. Extrair CSS do `index.html` para `public/css/app.css`
4. Extrair JS do `index.html` para `public/js/app.js`
5. Atualizar `index.html` para importar assets externos

### Fase 2: Landing Page
6. Criar `public/landing.html` com estrutura HTML
7. Criar `public/css/landing.css` com estilos responsivos
8. Criar `public/js/landing.js` com interações (scroll, contagem, carrossel)

### Fase 3: Polimento 
9. Aplicar nova paleta de cores roxo+laranja no dashboard
10. Refinar responsivo do dashboard
11. Ajustar modais, toasts, e componentes menores

### Fase 4: Verificação
12. Rodar testes (`npm test`)
13. Revisar contraste e acessibilidade
14. Verificar em mobile e desktop
