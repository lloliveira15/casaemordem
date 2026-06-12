# Landing Page + Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a modern landing page, redesign the dashboard with a new roxo+laranja palette, and split the monolithic index.html into modular assets.

**Architecture:** Landing page at `/` (landing.html), dashboard at `/app` (index.html). Shared design tokens via tokens.css. Express serves all static assets from `public/`.

**Tech Stack:** Express, vanilla JS, CSS custom properties, Phosphor Icons

---

## File Structure

```
public/
├── css/
│   ├── tokens.css        # DESIGN TOKENS — colors, typography, spacing
│   ├── landing.css       # LANDING PAGE styles
│   └── app.css           # DASHBOARD styles (extracted from index.html)
├── js/
│   ├── landing.js        # LANDING interactions (scroll, carousel, counter)
│   └── app.js            # DASHBOARD logic (extracted from index.html)
├── landing.html          # Landing page
└── index.html            # Dashboard (cleaned, imports external assets)
```

---

### Task 1: Create Design Tokens (tokens.css)

**Files:**
- Create: `public/css/tokens.css`

- [ ] **Step 1: Create tokens.css with design tokens and reset**

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #7C3AED;
  --primary-dark: #5B21B6;
  --primary-light: #F5F3FF;
  --primary-subtle: #A78BFA;
  --accent: #EA580C;
  --accent-dark: #C2410C;
  --accent-light: #FFF7ED;
  --surface: #FFFFFF;
  --bg: #FAF5FF;
  --bg-alt: #FFFFFF;
  --text: #1F1B2E;
  --text-muted: #6B5B8D;
  --text-light: #9C89B8;
  --border: #E8E0F0;
  --border-light: #F0E8F8;
  --destructive: #DC2626;
  --success: #059669;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --shadow: 0 1px 3px rgba(124,58,237,0.08);
  --shadow-hover: 0 4px 12px rgba(124,58,237,0.12);
  --shadow-lg: 0 8px 24px rgba(124,58,237,0.12);
  --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

html {
  font-family: var(--font);
  color-scheme: light;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la public/css/tokens.css`
Expected: file exists

---

### Task 2: Update Server Routes

**Files:**
- Modify: `server/app.js`

- [ ] **Step 1: Update route handlers**

Replace the existing root route handler:

Old:
```js
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});
```

New:
```js
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/landing.html');
});

app.get('/app', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});
```

- [ ] **Step 2: Run tests to verify no regression**

Run: `npm test`
Expected: All tests pass

---

### Task 3: Extract Dashboard CSS (app.css)

**Files:**
- Create: `public/css/app.css`
- Modify: `public/index.html`

- [ ] **Step 1: Extract all CSS from public/index.html**

Copy all CSS from `<style>` block (lines 11-1531 in current index.html) into `public/css/app.css`.

Replace the color palette:
| Old | New |
|-----|-----|
| `#9b6b9d` | `var(--primary)` |
| `#5c3d5e` | `var(--primary-dark)` |
| `#f5eff5` | `var(--primary-light)` |
| `#8b6b8d` | `var(--text-muted)` |
| `#b89bb8` | `var(--primary-subtle)` |
| `#e8dce8` | `var(--border)` |
| `#f0e8f0` | `var(--border-light)` |
| `#f9f5f9` | `var(--bg)` |
| `#ffffff` | `var(--surface)` |
| `#3d2d3f` | `var(--text)` |
| `#6b4b6d` | `var(--text-muted)` |
| `#d5b8d5` | `var(--primary-subtle)` |
| `#c4aac4` | `var(--primary-subtle)` |
| `rgba(91,61,94,0.08)` | `rgba(124,58,237,0.08)` |
| `rgba(91,61,94,0.12)` | `rgba(124,58,237,0.12)` |

Also replace `#d9534f` with `var(--destructive)`.

Add at the top of app.css:
```css
@import './tokens.css';
```

Remove `font-family` and `html`/`body` base declarations from app.css (they're in tokens.css).

- [ ] **Step 2: Remove inline `<style>` from index.html**

In `public/index.html`, replace the entire `<style>` block with:
```html
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/app.css">
```

Add Google Fonts preconnect:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
```

---

### Task 4: Extract Dashboard JavaScript (app.js)

**Files:**
- Create: `public/js/app.js`
- Modify: `public/index.html`

- [ ] **Step 1: Extract all JS from index.html**

Copy all JavaScript from the last `<script>` block (lines 2035-3225 in current index.html) into `public/js/app.js`.

Remove the `window.onload` wrapper at the end and keep it as a top-level function call. Change:
```js
window.onload = async () => { ... };
```
to a direct call at the end:
```js
(async () => { ... })();
```

- [ ] **Step 2: Remove inline `<script>` from index.html**

Replace the full `<script>` block with:
```html
<script src="/js/app.js"></script>
```

---

### Task 5: Create Landing Page HTML

**Files:**
- Create: `public/landing.html`

- [ ] **Step 1: Create landing.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Casa em Ordem - Organize as tarefas da sua casa com quem você ama">
  <title>Casa em Ordem - Organize suas tarefas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/landing.css">
</head>
<body>
  <nav class="landing-nav" id="landingNav">
    <div class="nav-container">
      <div class="nav-logo">
        <i class="ph ph-flower-tulip"></i>
        Casa em Ordem
      </div>
      <div class="nav-links" id="navLinks">
        <a href="#features">Funcionalidades</a>
        <a href="#testimonials">Depoimentos</a>
        <a href="#plans">Planos</a>
        <a href="/login" class="nav-cta">Entrar</a>
      </div>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">
        <i class="ph ph-list"></i>
      </button>
    </div>
  </nav>

  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Organize as tarefas da sua casa <span class="gradient-text">com quem você ama</span></h1>
        <p class="hero-subtitle">Crie, atribua e acompanhe tarefas domésticas em casal. Com templates inteligentes, lembretes por email e relatórios de produtividade, sua casa nunca esteve tão em ordem.</p>
        <div class="hero-cta">
          <a href="/login" class="btn btn-primary btn-lg">Criar conta gratuita</a>
          <a href="#features" class="btn btn-outline btn-lg">Ver funcionalidades</a>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-mockup">
          <div class="mockup-header">
            <div class="mockup-dot"></div>
            <div class="mockup-dot"></div>
            <div class="mockup-dot"></div>
          </div>
          <div class="mockup-body">
            <div class="mockup-sidebar">
              <div class="mockup-logo"><i class="ph ph-flower-tulip"></i></div>
              <div class="mockup-nav-item active"><i class="ph ph-list-checks"></i></div>
              <div class="mockup-nav-item"><i class="ph ph-gear-six"></i></div>
            </div>
            <div class="mockup-main">
              <div class="mockup-date"><i class="ph ph-calendar-blank"></i> Hoje</div>
              <div class="mockup-task"><input type="checkbox" checked><span>Lavar louça</span><span class="mockup-tag">Maria</span></div>
              <div class="mockup-task"><input type="checkbox"><span>Aspirar sala</span><span class="mockup-tag">João</span></div>
              <div class="mockup-task"><input type="checkbox"><span>Regar plantas</span><span class="mockup-tag">Maria</span></div>
              <div class="mockup-task-add">+ Adicionar tarefa</div>
            </div>
            <div class="mockup-widget">
              <div class="mockup-progress">
                <div class="mockup-progress-bar"><div class="mockup-progress-fill" style="width:33%"></div></div>
                <span>33%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number" data-target="10000">0</div>
          <div class="stat-label">tarefas concluídas</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" data-target="500">0</div>
          <div class="stat-label">casas organizadas</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" data-target="98">0</div>
          <div class="stat-label">% de satisfação</div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features">
      <div class="section-header">
        <span class="section-tag"><i class="ph ph-star"></i> Funcionalidades</span>
        <h2>Tudo que você precisa para manter a casa em ordem</h2>
        <p>Ferramentas simples e poderosas para dividir as tarefas domésticas com transparência</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><i class="ph ph-list-checks"></i></div>
          <h3>Tarefas Diárias</h3>
          <p>Crie e gerencie tarefas por data, ambiente e responsável. Visualize o que precisa ser feito hoje, amanhã ou na semana.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="ph ph-clipboard-text"></i></div>
          <h3>Templates Personalizáveis</h3>
          <p>Crie modelos de tarefas recorrentes por ambiente e frequência. Economize tempo não precisando digitar sempre as mesmas tarefas.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="ph ph-bell"></i></div>
          <h3>Notificações por Email</h3>
          <p>Receba lembretes diários das tarefas pendentes. Configure a frequência e o horário ideal para você e seu parceiro.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="ph ph-chart-bar"></i></div>
          <h3>Produtividade por Membro</h3>
          <p>Acompanhe a taxa de conclusão de cada membro da casa. Veja quem está contribuindo mais com gráficos claros.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="ph ph-qr-code"></i></div>
          <h3>Convite por QR Code</h3>
          <p>Compartilhe o código da sua casa com outros membros via QR Code, link ou email. Convidar é rápido e prático.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="ph ph-calendar-plus"></i></div>
          <h3>Geração Automática</h3>
          <p>Gere tarefas para o mês, semana ou dia baseado nos seus templates. Repita tarefas de períodos anteriores com um clique.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials" id="testimonials">
      <div class="section-header">
        <span class="section-tag"><i class="ph ph-chats"></i> Depoimentos</span>
        <h2>Quem usa, aprova</h2>
        <p>Veja o que outros casais estão dizendo sobre o Casa em Ordem</p>
      </div>
      <div class="testimonials-carousel" id="testimonialsCarousel">
        <div class="testimonial-card">
          <div class="testimonial-stars">
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
          </div>
          <p class="testimonial-text">"Desde que começamos a usar o Casa em Ordem, as brigas por tarefa doméstica acabaram. Sabemos exatamente quem faz o quê e quando."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:#7C3AED">A</div>
            <div>
              <strong>Ana e Carlos</strong>
              <span>Usuários há 6 meses</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
          </div>
          <p class="testimonial-text">"Os templates semanais são incríveis! Montamos nossa rotina de limpeza uma vez e as tarefas são geradas automaticamente toda semana."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:#EA580C">M</div>
            <div>
              <strong>Marina e Pedro</strong>
              <span>Usuários há 3 meses</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-stars">
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
            <i class="ph-fill ph-star"></i>
          </div>
          <p class="testimonial-text">"O relatório de produtividade virou nosso aliado. Dá para ver claramente quem está ajudando mais e ajustar a divisão das tarefas."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:#059669">R</div>
            <div>
              <strong>Rafael e Julia</strong>
              <span>Usuários há 1 ano</span>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-controls">
        <button class="carousel-btn" id="carouselPrev" aria-label="Anterior"><i class="ph ph-caret-left"></i></button>
        <div class="carousel-dots" id="carouselDots"></div>
        <button class="carousel-btn" id="carouselNext" aria-label="Próximo"><i class="ph ph-caret-right"></i></button>
      </div>
    </section>

    <!-- Plans -->
    <section class="plans" id="plans">
      <div class="section-header">
        <span class="section-tag"><i class="ph ph-tag"></i> Planos</span>
        <h2>Escolha o plano ideal para você</h2>
        <p>Comece grátis e faça upgrade quando precisar de mais</p>
      </div>
      <div class="plans-grid">
        <div class="plan-card">
          <div class="plan-badge">Grátis</div>
          <div class="plan-price">R$ 0<span>/mês</span></div>
          <ul class="plan-features">
            <li><i class="ph ph-check"></i> Até 2 membros</li>
            <li><i class="ph ph-check"></i> Templates básicos</li>
            <li><i class="ph ph-check"></i> Notificações diárias</li>
            <li><i class="ph ph-check"></i> Convite por código</li>
            <li><i class="ph ph-x"></i> Membros ilimitados</li>
            <li><i class="ph ph-x"></i> Relatórios avançados</li>
            <li><i class="ph ph-x"></i> Suporte prioritário</li>
          </ul>
          <a href="/login" class="btn btn-primary">Começar grátis</a>
        </div>
        <div class="plan-card plan-featured">
          <div class="plan-popular">Mais Popular</div>
          <div class="plan-badge">Premium</div>
          <div class="plan-price">Em breve<span></span></div>
          <ul class="plan-features">
            <li><i class="ph ph-check"></i> Membros ilimitados</li>
            <li><i class="ph ph-check"></i> Templates avançados</li>
            <li><i class="ph ph-check"></i> Notificações personalizadas</li>
            <li><i class="ph ph-check"></i> Relatórios de produtividade</li>
            <li><i class="ph ph-check"></i> Suporte prioritário</li>
            <li><i class="ph ph-check"></i> Histórico completo</li>
            <li><i class="ph ph-check"></i> Exportação de dados</li>
          </ul>
          <a href="/login" class="btn btn-primary">Lista de espera</a>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-final">
      <div class="cta-content">
        <h2>Pronto para organizar sua casa?</h2>
        <p>Cadastre-se grátis e comece a dividir as tarefas domésticas de forma justa e transparente.</p>
        <a href="/login" class="btn btn-white btn-lg">Começar grátis</a>
      </div>
    </section>
  </main>

  <footer class="landing-footer">
    <div class="footer-container">
      <div class="footer-col">
        <div class="footer-logo"><i class="ph ph-flower-tulip"></i> Casa em Ordem</div>
        <p>Organize as tarefas da sua casa com quem você ama.</p>
      </div>
      <div class="footer-col">
        <h4>Produto</h4>
        <a href="#features">Funcionalidades</a>
        <a href="#plans">Planos</a>
        <a href="/login">Entrar</a>
      </div>
      <div class="footer-col">
        <h4>Suporte</h4>
        <a href="#">Central de ajuda</a>
        <a href="#">Contato</a>
        <a href="#">Status</a>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="#">Privacidade</a>
        <a href="#">Termos</a>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2026 Casa em Ordem. Todos os direitos reservados.
    </div>
  </footer>

  <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
  <script src="/js/landing.js"></script>
</body>
</html>
```

---

### Task 6: Create Landing Page Styles (landing.css)

**Files:**
- Create: `public/css/landing.css`

- [ ] **Step 1: Create landing.css**

```css
@import './tokens.css';

/* Navigation */
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 24px;
  transition: background 0.2s, box-shadow 0.2s;
}

.landing-nav.scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px rgba(124,58,237,0.08);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-logo i {
  font-size: 24px;
  color: var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--primary);
}

.nav-cta {
  padding: 8px 20px;
  background: var(--primary);
  color: #fff !important;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: background 0.2s;
}

.nav-cta:hover {
  background: var(--primary-dark) !important;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
}

.nav-toggle:hover {
  background: var(--primary-light);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--surface);
    flex-direction: column;
    padding: 16px 24px;
    box-shadow: var(--shadow-lg);
    gap: 12px;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a {
    padding: 8px 0;
    width: 100%;
  }

  .nav-toggle {
    display: block;
  }
}

/* Hero */
.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  min-height: 90vh;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 20px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-cta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--border);
}

.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-white {
  background: #fff;
  color: var(--primary-dark);
}

.btn-white:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
}

/* Hero Mockup */
.hero-image {
  display: flex;
  justify-content: center;
}

.hero-mockup {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--border);
}

.mockup-header {
  background: var(--bg);
  padding: 12px 16px;
  display: flex;
  gap: 6px;
  border-bottom: 1px solid var(--border);
}

.mockup-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
}

.mockup-dot:first-child { background: #EF4444; }
.mockup-dot:nth-child(2) { background: #F59E0B; }
.mockup-dot:nth-child(3) { background: #10B981; }

.mockup-body {
  display: flex;
  min-height: 280px;
}

.mockup-sidebar {
  width: 48px;
  background: var(--primary-dark);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.mockup-sidebar .mockup-logo {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
}

.mockup-nav-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: rgba(255,255,255,0.5);
  font-size: 18px;
}

.mockup-nav-item.active {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

.mockup-main {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mockup-date {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.mockup-task {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.mockup-task input[type="checkbox"] {
  accent-color: var(--primary);
}

.mockup-task span:first-of-type {
  flex: 1;
  color: var(--text);
}

.mockup-task input[type="checkbox"]:checked + span {
  text-decoration: line-through;
  opacity: 0.5;
}

.mockup-tag {
  padding: 2px 8px;
  background: var(--primary-light);
  border-radius: 10px;
  font-size: 11px;
  color: var(--primary);
  font-weight: 600;
}

.mockup-task-add {
  padding: 10px 12px;
  border: 1.5px dashed var(--primary-subtle);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--primary-subtle);
  text-align: center;
}

.mockup-widget {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg);
}

.mockup-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
}

.mockup-progress-bar {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.mockup-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 3px;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 100px 24px 60px;
    min-height: auto;
    gap: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-image {
    order: -1;
  }

  .hero-mockup {
    max-width: 340px;
  }
}

/* Stats */
.stats {
  background: var(--primary);
  padding: 48px 24px;
}

.stats-container {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  text-align: center;
}

.stat-item {
  color: #fff;
}

.stat-number {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  opacity: 0.85;
  font-weight: 500;
}

@media (max-width: 640px) {
  .stats-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .stat-number {
    font-size: 36px;
  }
}

/* Section Header */
.section-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 48px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
}

.section-header p {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.6;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.section-tag i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 28px;
  }
}

/* Features */
.features {
  padding: 96px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 32px;
  border: 1px solid var(--border-light);
  transition: all 0.2s;
}

.feature-card:hover {
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-subtle);
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  border-radius: 12px;
  font-size: 24px;
  color: var(--primary);
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* Testimonials */
.testimonials {
  padding: 96px 24px;
  background: var(--bg);
}

.testimonials-carousel {
  max-width: 1000px;
  margin: 0 auto 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  overflow: hidden;
}

.testimonial-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 32px;
  border: 1px solid var(--border-light);
}

.testimonial-stars {
  display: flex;
  gap: 4px;
  color: #F59E0B;
  font-size: 16px;
  margin-bottom: 16px;
}

.testimonial-text {
  font-size: 15px;
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 20px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.testimonial-author strong {
  display: block;
  font-size: 14px;
  color: var(--text);
}

.testimonial-author span {
  font-size: 12px;
  color: var(--text-muted);
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}

.carousel-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.carousel-dots {
  display: flex;
  gap: 6px;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.carousel-dot.active {
  background: var(--primary);
  width: 24px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .testimonials-carousel {
    grid-template-columns: 1fr;
  }
}

/* Plans */
.plans {
  padding: 96px 24px;
  max-width: 900px;
  margin: 0 auto;
}

.plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.plan-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 40px 32px;
  border: 1px solid var(--border-light);
  position: relative;
}

.plan-featured {
  border: 2px solid var(--primary);
  box-shadow: 0 4px 20px rgba(124,58,237,0.15);
}

.plan-popular {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: #fff;
  padding: 4px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.plan-badge {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.plan-price {
  font-size: 48px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 24px;
}

.plan-price span {
  font-size: 16px;
  font-weight: 400;
  color: var(--text-muted);
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text);
}

.plan-features li i {
  font-size: 18px;
  color: var(--success);
  flex-shrink: 0;
}

.plan-features li .ph-x {
  color: var(--text-light);
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}

/* CTA Final */
.cta-final {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  padding: 96px 24px;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
}

.cta-content p {
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  margin-bottom: 32px;
  line-height: 1.6;
}

/* Footer */
.landing-footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 64px 24px 24px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.footer-col p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 280px;
}

.footer-col h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
}

.footer-col a {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: var(--primary);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
  font-size: 13px;
  color: var(--text-light);
  text-align: center;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .cta-content h2 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    grid-template-columns: 1fr;
  }
}
```

---

### Task 7: Create Landing Page JavaScript (landing.js)

**Files:**
- Create: `public/js/landing.js`

- [ ] **Step 1: Create landing.js**

```js
(function() {
  'use strict';

  // Navbar scroll
  const nav = document.getElementById('landingNav');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function() {
    navLinks.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    icon.className = navLinks.classList.contains('open') ? 'ph ph-x' : 'ph ph-list';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.classList.remove('open');
      navToggle.querySelector('i').className = 'ph ph-list';
    });
  });

  // Animated counter
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (!target) return;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (target === 98) {
        element.textContent = current + '%';
      } else {
        element.textContent = current.toLocaleString('pt-BR') + (target === 500 ? '+' : '+');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Intersection Observer for stats
  const statsSection = document.querySelector('.stats');
  let statsAnimated = false;

  if (statsSection) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          document.querySelectorAll('.stat-number').forEach(function(el) {
            animateCounter(el);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  // Carousel
  let currentSlide = 0;
  const carousel = document.getElementById('testimonialsCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (carousel && dotsContainer) {
    const cards = carousel.querySelectorAll('.testimonial-card');
    const totalSlides = Math.max(1, cards.length - 1);

    // Create dots
    for (let i = 0; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function() { goToSlide(i); });
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      currentSlide = Math.max(0, Math.min(index, totalSlides));
      const offset = -(currentSlide * (100 / 2));
      if (window.innerWidth <= 768) {
        carousel.style.transform = 'translateX(' + (-currentSlide * 100) + '%)';
      } else {
        carousel.style.transform = 'translateX(' + offset + '%)';
      }
      carousel.style.transition = 'transform 0.3s ease';

      document.querySelectorAll('.carousel-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goToSlide(currentSlide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goToSlide(currentSlide + 1); });

    // Handle resize
    window.addEventListener('resize', function() {
      goToSlide(currentSlide);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
```

---

### Task 8: Final Integration & Color Migration

**Files:**
- Modify: `public/css/app.css`
- Modify: `public/index.html`

- [ ] **Step 1: Update index.html title and viewport**

Ensure `public/index.html` has:
```html
<title>Casa em Ordem</title>
<meta name="theme-color" content="#7C3AED" />
```

- [ ] **Step 2: Verify all imports in index.html**

After removing the inline `<style>` and `<script>`, the head should have:
```html
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/app.css">
```

And before `</body>`:
```html
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
<script src="/js/app.js"></script>
```

- [ ] **Step 3: Run tests to verify backend**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 4: Manual smoke test**

Run: `npm start`
Visit: `http://localhost:3000`
- Verify landing page loads at `/`
- Verify dashboard loads at `/app`
- Verify login page loads at `/login`
- Verify auth (login/register) works
- Verify responsive layout (resize browser)

---

## Self-Review Checklist

- [ ] **Spec coverage:** All spec sections covered — Hero, Stats, Features, Testimonials, Plans, CTA, Footer, Dashboard redesign, Color palette, Routing
- [ ] **Placeholder scan:** No TODOs, TBDs, or "implement later" in the plan
- [ ] **Type consistency:** Colors match across tokens.css, landing.css, app.css
- [ ] **Missing tasks:** N/A — all tasks are accounted for
