# Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Casa em Ordem from 2-tab layout to sidebar+dashboard layout with visual task cards, members page, and modern aesthetics.

**Architecture:** Vanilla JS SPA with show/hide page sections. Sidebar drives navigation. Dashboard loads widgets + today's tasks. All backend untouched — frontend-only changes to `public/index.html`, `public/css/tokens.css`, `public/css/app.css`, `public/js/app.js`.

**Tech Stack:** Vanilla JS, CSS custom properties, Phosphor Icons, Plus Jakarta Sans

**Prerequisites:** Dark mode, skeleton loading, styled modal, toast with dismiss already implemented.

---

### Task 1: Add Room Color Variables to tokens.css

**Files:**
- Modify: `public/css/tokens.css`

- [ ] **Step 1: Add room color variables before the `[data-theme="dark"]` block**

Add CSS custom properties for each room's color (both light and dark mode variants):

```css
:root {
  /* existing vars ... */

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

[data-theme="dark"] {
  /* existing vars ... */

  /* Room colors (same in dark mode — badges need to pop) */
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
```

- [ ] **Step 2: Verify file loads without errors**

Run: `node -e "require('fs').readFileSync('public/css/tokens.css','utf8')" && echo "OK"`
Expected: OK

- [ ] **Step 3: Commit**

```bash
git add public/css/tokens.css
git commit -m "feat: add room color CSS variables"
```

---

### Task 2: Restructure index.html — New Layout

**Files:**
- Modify: `public/index.html`

- [ ] **Step 1: Replace current .container content with new layout structure**

The new HTML layout replaces everything inside `.container`:

```html
<div class="container">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo"><i class="ph ph-flower-tulip"></i> Casa em Ordem</div>
    </div>
    <nav class="sidebar-nav">
      <button class="sidebar-btn active" data-page="dashboard" onclick="showPage('dashboard')">
        <i class="ph ph-house"></i> Dashboard
      </button>
      <button class="sidebar-btn" data-page="tasks" onclick="showPage('tasks')">
        <i class="ph ph-list-checks"></i> Tarefas
      </button>
      <button class="sidebar-btn" data-page="members" onclick="showPage('members')">
        <i class="ph ph-users"></i> Membros
      </button>
      <button class="sidebar-btn" data-page="config" onclick="showPage('config')">
        <i class="ph ph-gear-six"></i> Config
      </button>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user" id="sidebarUser"><i class="ph ph-crown"></i> Carregando...</div>
      <button class="sidebar-theme" onclick="toggleTheme()">
        <i class="ph ph-moon theme-toggle-icon"></i>
        <span class="theme-toggle-label">Modo escuro</span>
      </button>
      <button class="sidebar-logout" onclick="handleLogout()">
        <i class="ph ph-sign-out"></i> Sair
      </button>
    </div>
  </aside>

  <!-- Main Area -->
  <div class="main-area">
    <!-- Top Bar -->
    <header class="topbar">
      <div class="topbar-left">
        <span class="topbar-title" id="pageTitle">Dashboard</span>
      </div>
      <div class="topbar-right">
        <span class="badge-label">Pendentes</span>
        <span class="badge" id="pendingCount">0</span>
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Alternar tema">
          <i class="ph ph-moon theme-toggle-icon"></i>
        </button>
      </div>
    </header>

    <!-- Page Content -->
    <main class="content">

      <!-- ===================== PAGE: DASHBOARD ===================== -->
      <section class="page active" id="pageDashboard">
        <div class="widgets-row" id="widgetsRow">
          <div class="widget-card" id="widgetPending">
            <div class="widget-label">Pendentes hoje</div>
            <div class="widget-value" id="dashboardPendingCount">—</div>
            <div class="widget-progress-bar">
              <div class="widget-progress-fill" id="dashboardProgressFill" style="width:0%"></div>
            </div>
            <div class="widget-sub" id="dashboardProgressText">0% concluído</div>
          </div>
          <div class="widget-card" id="widgetProductivity">
            <div class="widget-label">Produtividade</div>
            <div class="widget-value" id="dashboardProductivityPct">—</div>
            <div class="widget-sub" id="dashboardProductivityText">Carregando...</div>
          </div>
          <div class="widget-card" id="widgetMembers">
            <div class="widget-label">Membros</div>
            <div class="widget-members-list" id="dashboardMembersList"></div>
          </div>
        </div>

        <div class="section-header">
          <h2 class="section-title">Tarefas de hoje</h2>
        </div>
        <div id="dashboardTasksList"></div>
      </section>

      <!-- ===================== PAGE: TASKS ===================== -->
      <section class="page" id="pageTasks">
        <div class="date-nav-row">
          <button class="date-pill" onclick="setDate(-1)">Ontem</button>
          <button class="date-pill active" onclick="setDate(0)">Hoje</button>
          <button class="date-pill" onclick="setDate(1)">Amanhã</button>
          <button class="date-pill date-pill-icon" onclick="openDatePicker()">
            <i class="ph ph-calendar-blank"></i>
          </button>
          <input type="date" id="taskDate" onchange="loadTasks()" style="display:none">
        </div>
        <div class="progress-row">
          <span class="progress-text" id="progressText">0 de 0 concluídas</span>
          <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>
        </div>
        <div id="tasksList"></div>
        <div class="quick-add-bar">
          <input type="text" id="quickTaskInput" placeholder="Adicionar tarefa..." autocomplete="off">
          <select id="quickTaskRoomSelect">
            <option value="">Cômodo</option>
            <option value="Cozinha">Cozinha</option>
            <option value="Sala de estar">Sala de estar</option>
            <option value="Quarto">Quarto</option>
            <option value="Banheiro social">Banheiro social</option>
            <option value="Banheiro suite">Banheiro suite</option>
            <option value="Suíte">Suíte</option>
            <option value="Varanda">Varanda</option>
            <option value="Área de serviço">Área de serviço</option>
            <option value="Hall">Hall</option>
            <option value="Corredor">Corredor</option>
            <option value="Lavabo">Lavabo</option>
            <option value="Escritório">Escritório</option>
            <option value="Geral">Geral</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="addQuickTaskInline()">
            <span class="spinner"></span>
            <span class="btn-text">+</span>
          </button>
        </div>
      </section>

      <!-- ===================== PAGE: MEMBERS ===================== -->
      <section class="page" id="pageMembers">
        <div class="card">
          <div class="card-title"><i class="ph ph-qr-code"></i> Código da Casa</div>
          <div class="house-code" id="inviteCode">------</div>
          <div class="invite-actions">
            <button class="btn btn-secondary btn-sm" onclick="copyInviteCode()">
              <i class="ph ph-copy"></i> Copiar código
            </button>
            <button class="btn btn-secondary btn-sm" onclick="showInviteEmailForm()">
              <i class="ph ph-envelope"></i> Convidar por email
            </button>
            <button class="btn btn-secondary btn-sm" onclick="regenerateCode()" id="regenerateCodeBtn">
              <i class="ph ph-arrows-clockwise"></i> Novo código
            </button>
          </div>
          <div id="inviteQR" style="text-align:center;margin:16px 0" onclick="copyInviteLink()" title="Clique para copiar link"></div>
          <div id="inviteEmailForm" style="display:none">
            <div style="display:flex;gap:8px;margin-bottom:8px">
              <input type="email" id="inviteEmailInput" placeholder="Email do convidado" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px;background:var(--bg-alt);color:var(--text)">
              <button class="btn btn-primary btn-sm" onclick="sendInviteEmail()">
                <span class="spinner"></span>
                <span class="btn-text">Enviar</span>
              </button>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('inviteEmailForm').style.display='none'">Cancelar</button>
          </div>
          <div id="joinHouseholdSection" style="display:none;padding:16px;background:var(--bg-alt);border:1px solid var(--border);border-radius:12px;margin-bottom:16px">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;text-align:center">
              <i class="ph ph-sign-in"></i> Entrar em uma casa
            </div>
            <div style="display:flex;gap:8px;max-width:320px;margin:0 auto">
              <input type="text" id="joinCodeInput" placeholder="Código" maxlength="6" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px;text-align:center;letter-spacing:4px;font-weight:700;text-transform:uppercase">
              <button class="btn btn-primary btn-sm" onclick="joinHousehold()">
                <span class="spinner"></span>
                <span class="btn-text">Entrar</span>
              </button>
            </div>
            <div id="joinError" style="color:var(--destructive);font-size:13px;text-align:center;margin-top:8px;display:none"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-title"><i class="ph ph-users"></i> Membros</div>
          <div class="members-list" id="membersList"></div>
        </div>
      </section>

      <!-- ===================== PAGE: CONFIG ===================== -->
      <section class="page" id="pageConfig">
        <div class="config-tabs">
          <button class="config-tab-btn active" id="configTabTemplates" onclick="switchConfigTab('templates')">
            <i class="ph ph-clipboard-text"></i> Templates
          </button>
          <button class="config-tab-btn" id="configTabNotif" onclick="switchConfigTab('notif')">
            <i class="ph ph-bell"></i> Notificações
          </button>
          <button class="config-tab-btn" id="configTabGerar" onclick="switchConfigTab('gerar')">
            <i class="ph ph-calendar-plus"></i> Gerar
          </button>
          <button class="config-tab-btn" id="configTabProdut" onclick="switchConfigTab('produt')">
            <i class="ph ph-chart-bar"></i> Produtividade
          </button>
        </div>

        <div class="subtab-content active" id="subtabTemplates">
          <div class="card">
            <div class="card-title"><i class="ph ph-plus"></i> Novo Template</div>
            <div class="form-group">
              <label for="newTaskDesc">Descrição</label>
              <input type="text" id="newTaskDesc" placeholder="Ex: Lavar louça…" autocomplete="off">
            </div>
            <div class="form-group">
              <label for="newTaskRoom">Ambiente</label>
              <select id="newTaskRoom" onchange="toggleNewRoom()">
                <option value="Sala de estar">Sala de estar</option>
                <option value="Lavabo">Lavabo</option>
                <option value="Hall">Hall</option>
                <option value="Corredor">Corredor</option>
                <option value="Varanda">Varanda</option>
                <option value="Suíte">Suíte</option>
                <option value="Escritório">Escritório</option>
                <option value="Quarto">Quarto</option>
                <option value="Banheiro social">Banheiro social</option>
                <option value="Banheiro suite">Banheiro suite</option>
                <option value="Cozinha">Cozinha</option>
                <option value="Área de serviço">Área de serviço</option>
                <option value="Geral">Geral</option>
                <option value="__new__">+ Novo ambiente...</option>
              </select>
            </div>
            <div class="form-group" id="newRoomGroup" style="display:none">
              <label for="newRoomName">Nome do novo ambiente</label>
              <input type="text" id="newRoomName" placeholder="Ex: Garagem">
            </div>
            <div class="form-group">
              <label for="newTaskFreq">Frequência</label>
              <select id="newTaskFreq" onchange="toggleDaySelector()">
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            <div class="form-group" id="dayGroup" style="display:none">
              <label for="newTaskDay">Dia da semana</label>
              <select id="newTaskDay">
                <option value="0">Domingo</option>
                <option value="1">Segunda</option>
                <option value="2">Terça</option>
                <option value="3">Quarta</option>
                <option value="4">Quinta</option>
                <option value="5">Sexta</option>
                <option value="6">Sábado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="newTaskAssigned">Responsável</label>
              <input type="text" id="newTaskAssigned" placeholder="Maria, João…" autocomplete="off">
            </div>
            <button class="btn btn-primary btn-sm" onclick="addTemplate()">
              <span class="spinner"></span>
              <span class="btn-text"><i class="ph ph-plus"></i> Adicionar</span>
            </button>
          </div>
          <div class="card">
            <div class="card-title"><i class="ph ph-list"></i> Templates</div>
            <div id="templatesList"></div>
          </div>
        </div>

        <div class="subtab-content" id="subtabNotif">
          <div class="card">
            <div class="card-title"><i class="ph ph-envelope"></i> Email SMTP</div>
            <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.5">
              <i class="ph ph-info" style="vertical-align:middle;margin-right:4px"></i>
              Usado para notificações e "Esqueci minha senha".
            </p>
            <div class="form-group">
              <label for="smtpEmail">Email SMTP</label>
              <input type="email" id="smtpEmail" placeholder="seu@gmail.com" autocomplete="email">
            </div>
            <div class="form-group">
              <label for="smtpPass">Senha de app</label>
              <input type="password" id="smtpPass" placeholder="Nova senha (deixe vazio para manter)">
            </div>
            <button class="btn btn-primary btn-sm" onclick="saveSmtpConfig()">
              <span class="spinner"></span>
              <span class="btn-text"><i class="ph ph-floppy-disk"></i> Salvar</span>
            </button>
            <p style="font-size:12px;color:var(--text-muted);margin-top:8px">
              Crie uma senha de app em: minha conta Google → Segurança → Senhas de App
            </p>
          </div>
          <div class="card">
            <div class="card-title"><i class="ph ph-bell"></i> Notificações</div>
            <div class="setting-row">
              <span class="setting-label">Email diário</span>
              <label class="toggle-switch">
                <input type="checkbox" id="notifEnabled" onchange="saveNotifSettings()">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label for="notifFreq">Frequência</label>
              <select id="notifFreq" onchange="saveNotifSettings()">
                <option value="daily">1x ao dia</option>
                <option value="every2h">A cada 2h</option>
                <option value="every4h">A cada 4h</option>
                <option value="every6h">A cada 6h</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0" id="notifTimeGroup">
              <label for="notifTime">Horário</label>
              <select id="notifTime" onchange="saveNotifSettings()">
                <option value="08:00">08:00</option>
                <option value="12:00">12:00</option>
                <option value="16:00">16:00</option>
                <option value="20:00">20:00</option>
              </select>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="sendTestEmail()" style="margin-top:16px">
              <i class="ph ph-envelope"></i> Testar email
            </button>
          </div>
        </div>

        <div class="subtab-content" id="subtabGerar">
          <div class="card">
            <div class="card-title"><i class="ph ph-calendar-plus"></i> Gerar Tarefas</div>
            <div class="form-group">
              <label for="generatePeriod">Período</label>
              <select id="generatePeriod">
                <option value="month">Este mês</option>
                <option value="week">Esta semana</option>
                <option value="today">Hoje</option>
              </select>
            </div>
            <button class="btn btn-primary btn-sm" onclick="generateTasks()">
              <span class="spinner"></span>
              <span class="btn-text"><i class="ph ph-plus"></i> Gerar</span>
            </button>
            <div class="divider"></div>
            <div class="form-group">
              <label for="repeatSource">Copiar de</label>
              <select id="repeatSource">
                <option value="month">Mês passado</option>
                <option value="week">Semana passada</option>
                <option value="day">Ontem</option>
              </select>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="repeatTasks()">
              <i class="ph ph-copy"></i> Repetir
            </button>
          </div>
        </div>

        <div class="subtab-content" id="subtabProdut">
          <div class="card">
            <div class="card-title"><i class="ph ph-chart-bar"></i> Produtividade</div>
            <div class="form-group">
              <label for="produtPeriod">Período</label>
              <select id="produtPeriod" onchange="loadProductivity()">
                <option value="week">Esta semana</option>
                <option value="month" selected>Este mês</option>
                <option value="year">Este ano</option>
              </select>
            </div>
            <div id="productivityList"></div>
          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- Bottom Nav (mobile only) -->
  <nav class="bottom-nav" id="bottomNav">
    <button class="bottom-nav-btn active" data-page="dashboard" onclick="showPage('dashboard')">
      <i class="ph ph-house"></i>
      <span>Início</span>
    </button>
    <button class="bottom-nav-btn" data-page="tasks" onclick="showPage('tasks')">
      <i class="ph ph-list-checks"></i>
      <span>Tarefas</span>
    </button>
    <button class="bottom-nav-btn" data-page="members" onclick="showPage('members')">
      <i class="ph ph-users"></i>
      <span>Membros</span>
    </button>
    <button class="bottom-nav-btn" data-page="config" onclick="showPage('config')">
      <i class="ph ph-gear-six"></i>
      <span>Config</span>
    </button>
  </nav>
</div>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer" role="alert" aria-live="assertive" aria-atomic="true"></div>
```

- [ ] **Step 2: Verify HTML structure**

Check that the file contains all 4 page sections (`#pageDashboard`, `#pageTasks`, `#pageMembers`, `#pageConfig`) and sidebar with 4 nav items.

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: restructure HTML for dashboard layout with 4-page sidebar"
```

---

### Task 3: Rewrite app.css — Sidebar + Dashboard + Task Cards

**Files:**
- Modify: `public/css/app.css`

- [ ] **Step 1: Replace the entire app.css content**

Write the complete new CSS file. Key structural changes:

```css
@import './tokens.css';

/* ===================== LAYOUT ===================== */
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}

/* Safe areas */
.topbar {
  padding-top: calc(14px + var(--safe-top, 0px));
  padding-left: calc(24px + var(--safe-left, 0px));
  padding-right: calc(24px + var(--safe-right, 0px));
}

.bottom-nav {
  padding-bottom: calc(8px + var(--safe-bottom, 0px));
  padding-left: calc(8px + var(--safe-left, 0px));
  padding-right: calc(8px + var(--safe-right, 0px));
}

/* ===================== SIDEBAR ===================== */
.sidebar {
  display: none;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    width: 240px;
    min-width: 240px;
    background: var(--bg-alt);
    border-right: 1px solid var(--border);
    min-height: 100vh;
  }

  .sidebar-header {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sidebar-logo i {
    font-size: 22px;
  }

  .sidebar-nav {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sidebar-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: none;
    background: transparent;
    border-radius: 10px;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    width: 100%;
    text-align: left;
  }

  .sidebar-btn:hover {
    background: var(--primary-light);
    color: var(--primary-dark);
  }

  .sidebar-btn.active {
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
  }

  .sidebar-btn i {
    font-size: 20px;
  }

  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
  }

  .sidebar-user {
    font-size: 14px;
    color: var(--text);
    font-weight: 500;
    margin-bottom: 8px;
  }

  .sidebar-theme {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    margin-bottom: 4px;
    transition: color 0.15s;
  }

  .sidebar-theme:hover {
    color: var(--primary);
  }

  .sidebar-logout {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    transition: color 0.15s;
  }

  .sidebar-logout:hover {
    color: var(--destructive);
  }
}

/* ===================== TOP BAR ===================== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.topbar-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 767px) {
  .topbar {
    padding: 12px 16px;
  }
  .topbar-title {
    font-size: 17px;
  }
}

/* ===================== MAIN ===================== */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

@media (max-width: 767px) {
  .content {
    padding: 16px;
    padding-bottom: 80px;
  }
}

/* ===================== PAGE SYSTEM ===================== */
.page {
  display: none;
  animation: fadeIn 0.2s ease;
}

.page.active {
  display: block;
}

/* ===================== WIDGETS ROW ===================== */
.widgets-row {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.widgets-row::-webkit-scrollbar {
  height: 4px;
}

.widgets-row::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

.widget-card {
  flex: 1;
  min-width: 180px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  scroll-snap-align: start;
}

.widget-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.widget-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.widget-sub {
  font-size: 13px;
  color: var(--text-muted);
}

.widget-progress-bar {
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.widget-progress-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--primary);
  transition: width 0.3s ease;
}

.widget-members-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.widget-member-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--primary-light);
  border-radius: 12px;
  font-size: 12px;
  color: var(--primary-dark);
  font-weight: 500;
}

.widget-member-chip i {
  font-size: 12px;
}

@media (max-width: 767px) {
  .widgets-row {
    gap: 12px;
    margin-bottom: 20px;
  }
  .widget-card {
    min-width: 155px;
    padding: 16px;
  }
  .widget-value {
    font-size: 26px;
  }
}

/* ===================== SECTION HEADER ===================== */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

/* ===================== DATE NAV ===================== */
.date-nav-row {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.date-pill {
  padding: 7px 18px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.date-pill:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.date-pill.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.date-pill-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
}

.date-pill-icon i {
  font-size: 16px;
}

/* ===================== PROGRESS ROW ===================== */
.progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.progress-text {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  font-weight: 500;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--primary);
  transition: width 0.3s ease;
}

/* ===================== TASK CARDS ===================== */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.2s;
  animation: fadeIn 0.2s ease;
}

.task-card:hover {
  border-color: var(--primary-subtle);
  box-shadow: 0 2px 8px rgba(124,58,237,0.06);
}

.task-card.completed {
  opacity: 0.5;
}

.task-card.completed .task-card-desc {
  text-decoration: line-through;
}

.task-check {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
  cursor: pointer;
  flex-shrink: 0;
}

.task-card-info {
  flex: 1;
  min-width: 0;
}

.task-card-desc {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.task-card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.room-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
}

.task-assignee {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: var(--primary-light);
  border-radius: 8px;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.task-card-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  opacity: 0;
  transition: opacity 0.15s;
}

.task-card:hover .task-card-actions {
  opacity: 1;
}

@media (max-width: 767px) {
  .task-card-actions {
    opacity: 1;
  }
}

.task-action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.15s;
}

.task-action-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.task-action-btn.delete:hover {
  background: rgba(220,38,38,0.1);
  color: var(--destructive);
}

/* ===================== QUICK ADD ===================== */
.quick-add-bar {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: 12px;
  align-items: center;
}

.quick-add-bar input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--text);
  outline: none;
  padding: 8px 0;
}

.quick-add-bar input::placeholder {
  color: var(--text-light);
}

.quick-add-bar select {
  border: 1px solid var(--border);
  background: var(--bg-alt);
  color: var(--text);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.quick-add-bar .btn {
  width: auto;
  padding: 8px 16px;
  font-size: 16px;
}

@media (max-width: 767px) {
  .quick-add-bar {
    flex-wrap: wrap;
  }
  .quick-add-bar select {
    width: auto;
    flex: 1;
  }
  .quick-add-bar .btn {
    flex-shrink: 0;
  }
}

/* ===================== BULK ACTIONS ===================== */
.bulk-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.bulk-actions .btn {
  padding: 7px 14px;
  font-size: 12px;
  width: auto;
}

/* ===================== COMPLETED HEADER ===================== */
.completed-header {
  margin: 16px 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ===================== MEMBERS PAGE ===================== */
.invite-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 12px 0;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.member-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.member-card-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text);
}

.member-card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.member-card-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 4px 0;
}

.member-card-field .field-label {
  color: var(--text-muted);
}

.member-card-field .field-value {
  font-weight: 500;
  color: var(--text);
}

.member-card-edit {
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: 12px;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

/* ===================== AUTH ===================== */
.auth-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  min-height: 100vh;
  width: 100%;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.auth-subtitle {
  color: var(--text-muted);
  font-size: 15px;
  margin-bottom: 32px;
}

/* ===================== BOTTOM NAV ===================== */
.bottom-nav {
  display: flex;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 6px 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}

.bottom-nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.15s;
}

.bottom-nav-btn i {
  font-size: 22px;
}

.bottom-nav-btn.active {
  color: var(--primary);
}

.bottom-nav-btn span {
  font-size: 10px;
}

/* ===================== FORMS ===================== */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 11px 14px;
  font-size: 14px;
  border: 2px solid var(--border);
  border-radius: 10px;
  background: var(--bg-alt);
  color: var(--text);
  transition: border-color 0.15s, box-shadow 0.15s;
  -webkit-appearance: none;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
}

.form-group input::placeholder {
  color: var(--text-light);
}

.form-group select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23A78BFA' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 40px;
}

/* ===================== BUTTONS ===================== */
.btn {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--primary-light);
  color: var(--text-muted);
}

.btn-secondary:hover {
  background: var(--border);
}

.btn-sm {
  padding: 8px 14px;
  font-size: 13px;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  padding: 8px 14px;
}

.btn-ghost:hover {
  background: var(--primary-light);
  color: var(--primary);
  transform: none;
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn .spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: none;
}

.btn.loading .spinner {
  display: inline-block;
}

.btn.loading .btn-text {
  display: none;
}

.btn-secondary .spinner {
  border-color: rgba(0,0,0,0.1);
  border-top-color: var(--primary);
}

/* ===================== TOGGLE ===================== */
.toggle-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-muted);
}

.toggle-link button {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  display: inline-block;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--border);
  border-radius: 24px;
  transition: 0.2s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.2s;
}

.toggle-switch input:checked + .toggle-slider {
  background: var(--primary);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-switch.small {
  width: 36px;
  height: 20px;
}

.toggle-switch.small .toggle-slider:before {
  height: 14px;
  width: 14px;
}

/* ===================== CARDS ===================== */
.card {
  background: var(--surface);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title i {
  font-size: 18px;
}

/* ===================== HOUSE CODE ===================== */
.house-code {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--primary);
  text-align: center;
  margin: 12px 0;
}

/* ===================== SETTINGS ROW ===================== */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
}

/* ===================== CONFIG TABS ===================== */
.config-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.config-tab-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: var(--primary-light);
  color: var(--text-muted);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.config-tab-btn:hover {
  background: var(--border);
  color: var(--primary-dark);
}

.config-tab-btn.active {
  background: var(--primary);
  color: #fff;
}

.config-tab-btn i {
  font-size: 16px;
}

.subtab-content {
  display: none;
}

.subtab-content.active {
  display: block;
}

/* ===================== TEMPLATES ===================== */
.template-filter-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.template-filter-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.template-filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.template-filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.template-filter-btn .count {
  background: rgba(0,0,0,0.1);
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
}

.template-filter-btn.active .count {
  background: rgba(255,255,255,0.2);
}

.template-group {
  margin-bottom: 20px;
  display: none;
}

.template-group.visible {
  display: block;
}

.template-group-header {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}

.template-room-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.template-room-btn {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  border-radius: 12px;
  cursor: pointer;
}

.template-room-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.template-room-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.template-list-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.template-list-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
}

.template-desc {
  font-size: 14px;
  font-weight: 500;
}

.template-meta {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.room-tag {
  display: inline-block;
  background: var(--primary);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 8px;
}

.template-delete {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  margin-top: 6px;
}

.template-delete:hover {
  background: rgba(220,38,38,0.1);
  color: var(--destructive);
}

.template-list-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  grid-column: 1 / -1;
}

.template-list-pagination .info {
  font-size: 12px;
  color: var(--text-muted);
}

.template-list-pagination .btn-nav {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 8px;
  cursor: pointer;
}

.template-list-pagination .btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===================== PRODUCTIVITY ===================== */
.produt-card {
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 8px;
}

.produt-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
  margin-bottom: 6px;
}

.produt-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.produt-bar {
  height: 8px;
  background: var(--border-light);
  border-radius: 4px;
  overflow: hidden;
}

.produt-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.produt-rate {
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  color: var(--text);
  margin-top: 4px;
}

/* ===================== EMPTY STATE ===================== */
.empty {
  text-align: center;
  padding: 40px 24px;
}

.empty i {
  font-size: 48px;
  color: var(--border);
  margin-bottom: 12px;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
}

/* ===================== THEME TOGGLE (header) ===================== */
.theme-toggle {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--primary-light);
  color: var(--text-muted);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.15s;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: var(--border);
  color: var(--primary);
}

/* ===================== BADGE ===================== */
.badge {
  background: var(--primary);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 10px;
}

.badge-label {
  font-size: 12px;
  color: var(--text-muted);
}

/* ===================== DIVIDER ===================== */
.divider {
  height: 1px;
  background: var(--border);
  margin: 20px 0;
}

/* ===================== TOAST ===================== */
.toast-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 20px;
  width: 100%;
  max-width: 500px;
  pointer-events: none;
}

.toast {
  padding: 12px 44px 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideUp 0.25s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.toast.success { background: var(--primary); }
.toast.error { background: var(--destructive); }

.toast-dismiss {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.15s;
}

/* ===================== MODAL ===================== */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.15s ease;
}

.modal-overlay.active {
  display: flex;
}

.confirm-modal {
  background: var(--surface);
  border-radius: 16px;
  padding: 28px 24px 20px;
  width: 100%;
  max-width: 340px;
  text-align: center;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.15s ease;
}

.confirm-modal-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  font-size: 26px;
}

.confirm-modal-icon.warning { background: var(--accent-light); color: var(--accent); }
.confirm-modal-icon.danger { background: rgba(220,38,38,0.1); color: var(--destructive); }
.confirm-modal-icon.info { background: var(--primary-light); color: var(--primary); }

.confirm-modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.confirm-modal-message {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
  line-height: 1.5;
}

.confirm-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.confirm-modal-actions .btn {
  min-width: 90px;
  padding: 10px 18px;
  font-size: 13px;
}

/* ===================== TASK PICKER MODAL ===================== */
.modal-content {
  background: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.modal-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.task-suggestions {
  max-height: 350px;
  overflow-y: auto;
}

.room-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.room-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 0 4px;
  border-bottom: 1px solid var(--border-light);
}

.room-tasks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.suggestion-item {
  padding: 9px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.suggestion-item:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* ===================== ANIMATIONS ===================== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===================== SCROLL STYLING ===================== */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

/* ===================== RESPONSIVE ===================== */
@media (max-width: 767px) {
  .content {
    padding: 14px;
    padding-bottom: 76px;
  }

  .house-code {
    font-size: 26px;
  }

  .invite-actions {
    gap: 6px;
  }

  .invite-actions .btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}

@media (min-width: 1024px) {
  .content {
    padding: 28px 36px;
  }
}

/* ===================== DARK MODE REFINEMENTS ===================== */
[data-theme="dark"] .sidebar {
  border-right-color: var(--border);
}

[data-theme="dark"] .bottom-nav {
  border-top-color: var(--border);
}

[data-theme="dark"] .date-pill {
  background: var(--surface);
}

[data-theme="dark"] .task-card {
  background: var(--surface);
}

[data-theme="dark"] .member-card {
  background: var(--surface);
}

[data-theme="dark"] .widget-card {
  background: var(--surface);
}
```

- [ ] **Step 2: Verify CSS compiles**

Run: `node -e "require('fs').readFileSync('public/css/app.css','utf8')" && echo "OK"`
Expected: OK

- [ ] **Step 3: Commit**

```bash
git add public/css/app.css
git commit -m "feat: complete CSS rewrite for sidebar+dashboard+task cards"
```

---

### Task 4: Rewrite app.js — Navigation + Dashboard + Room Colors + Inline Quick-Add

**Files:**
- Modify: `public/js/app.js`

- [ ] **Step 1: Add room color mapping after the `API_URL` declaration**

```javascript
const ROOM_COLORS = {
  'Cozinha': '#F97316',
  'Sala de estar': '#8B5CF6',
  'Quarto': '#3B82F6',
  'Banheiro social': '#06B6D4',
  'Banheiro suite': '#06B6D4',
  'Suíte': '#F472B6',
  'Lavabo': '#06B6D4',
  'Varanda': '#84CC16',
  'Área de serviço': '#10B981',
  'Escritório': '#6B7280',
  'Hall': '#EC4899',
  'Corredor': '#EC4899',
  'Geral': '#7C3AED'
};

function getRoomColor(room) {
  return ROOM_COLORS[room] || '#7C3AED';
}
```

- [ ] **Step 2: Add `showPage(page)` function**

This replaces the old `showTab()` function for tasks/config.

```javascript
function showPage(page) {
  const pages = ['dashboard', 'tasks', 'members', 'config'];
  
  // Update sidebar buttons
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  
  // Update bottom nav buttons
  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  
  // Update pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.id === 'page' + page.charAt(0).toUpperCase() + page.slice(1));
  });
  
  // Update title
  const titles = { dashboard: 'Dashboard', tasks: 'Tarefas', members: 'Membros', config: 'Configurações' };
  document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';
  
  // Load data on page switch
  if (page === 'dashboard') loadDashboard();
  if (page === 'tasks') loadTasks();
  if (page === 'members') loadHousehold();
}
```

- [ ] **Step 3: Add `loadDashboard()` function**

Removes old widget code from `loadTasks()` and creates a separate dashboard loader.

```javascript
async function loadDashboard() {
  const token = localStorage.getItem('token');
  
  // Show skeletons
  document.getElementById('dashboardPendingCount').textContent = '—';
  document.getElementById('dashboardProgressFill').style.width = '0%';
  document.getElementById('dashboardProgressText').textContent = 'Carregando...';
  document.getElementById('dashboardProductivityPct').textContent = '—';
  document.getElementById('dashboardProductivityText').textContent = 'Carregando...';
  
  try {
    // Load today's pending count + tasks
    const pendingRes = await fetch(`${API_URL}/api/notifications/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pendingData = await pendingRes.json();
    
    document.getElementById('pendingCount').textContent = pendingData.count;
    document.getElementById('dashboardPendingCount').textContent = pendingData.count;
    
    // Load today's tasks for progress
    const today = new Date().toISOString().split('T')[0];
    const tasksRes = await fetch(`${API_URL}/api/tasks?date=${today}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await tasksRes.json();
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    const total = pending.length + completed.length;
    const rate = total > 0 ? Math.round(completed.length / total * 100) : 0;
    
    document.getElementById('dashboardProgressFill').style.width = rate + '%';
    document.getElementById('dashboardProgressText').textContent = `${completed.length} de ${total} concluídas (${rate}%)`;
    
    // Load productivity
    const statsRes = await fetch(`${API_URL}/api/tasks/stats?period=week`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    const members = statsData.byMember || [];
    
    if (members.length > 0) {
      const totalCompleted = members.reduce((s, m) => s + (m.completed || 0), 0);
      const totalAll = members.reduce((s, m) => s + (m.total || 0), 0);
      const pct = totalAll > 0 ? Math.round(totalCompleted / totalAll * 100) : 0;
      document.getElementById('dashboardProductivityPct').textContent = pct + '%';
      document.getElementById('dashboardProductivityText').textContent = `${totalCompleted} tarefas concluídas`;
    }
    
    // Load members for widget
    const houseRes = await fetch(`${API_URL}/api/household`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const houseData = await houseRes.json();
    if (houseData.members) {
      let mHtml = '';
      for (const m of houseData.members) {
        mHtml += `<span class="widget-member-chip"><i class="ph ph-crown" style="color:var(--primary);font-size:10px"></i> ${m.username}</span>`;
      }
      document.getElementById('dashboardMembersList').innerHTML = mHtml;
    }
    
    // Render today's tasks in dashboard
    renderTaskList(tasks, document.getElementById('dashboardTasksList'), false);
    
  } catch (e) {
    // silent fail
  }
}
```

- [ ] **Step 4: Add `renderTaskList()` function for reusable task rendering**

```javascript
function renderTaskList(tasks, container, showBulk) {
  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  let html = '';

  if (pending.length > 0 && showBulk !== false) {
    html += `
      <div class="bulk-actions">
        <button class="btn btn-secondary btn-sm" onclick="selectAllTasks()">Todas</button>
        <button class="btn btn-primary btn-sm" onclick="bulkToggle()">Feitas</button>
        <button class="btn btn-secondary btn-sm" onclick="bulkDelete()" style="background:rgba(220,38,38,0.1);color:var(--destructive)">Excluir</button>
      </div>`;
  }

  if (pending.length > 0) {
    html += '<div class="task-list">';
    for (const t of pending) html += buildTaskCard(t);
    html += '</div>';
  }

  if (completed.length > 0) {
    html += `<div class="completed-header"><i class="ph ph-check-circle"></i> Concluídas (${completed.length})</div>`;
    html += '<div class="task-list">';
    for (const t of completed) html += buildTaskCard(t);
    html += '</div>';
  }

  if (!html) {
    const dateFormatted = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    html = `
      <div class="empty">
        <i class="ph ph-clipboard-text"></i>
        <div class="empty-title">Nenhuma tarefa</div>
        <div class="empty-text" style="text-transform:capitalize">${dateFormatted}</div>
      </div>`;
  }

  container.innerHTML = html;
}
```

- [ ] **Step 5: Add `buildTaskCard()` function**

Replaces the old `buildTaskRow()` with richer card markup.

```javascript
function buildTaskCard(task) {
  const isCompleted = task.completed;
  const room = task.room || '';
  const roomColor = getRoomColor(room);
  const roomBadge = room
    ? `<span class="room-badge" style="background:${roomColor}18;color:${roomColor}">${room}</span>`
    : '';
  const assigneeBadge = task.assigned_to
    ? `<span class="task-assignee">👤 ${task.assigned_to}</span>`
    : '';

  return `
    <div class="task-card ${isCompleted ? 'completed' : ''}">
      <input type="checkbox" class="task-check" value="${task.id}" ${isCompleted ? 'checked' : ''}>
      <div class="task-card-info" onclick="toggleTask(${task.id})" style="cursor:pointer">
        <div class="task-card-desc">${task.description}</div>
        <div class="task-card-meta">
          ${roomBadge}
          ${assigneeBadge}
        </div>
      </div>
      <div class="task-card-actions">
        <button class="task-action-btn" onclick="deleteTask(${task.id})" aria-label="Excluir">
          <i class="ph ph-trash"></i>
        </button>
      </div>
    </div>`;
}
```

- [ ] **Step 6: Update `loadTasks()` to use new rendering**

Replace the old big `loadTasks()` function with a cleaner version that calls `renderTaskList()`:

Replace the current `loadTasks()` function (the entire function) with:

```javascript
async function loadTasks() {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  const selectedDate = getSelectedDate();
  
  // Update date pills
  const quickBtns = document.querySelectorAll('#pageTasks .date-pill');
  quickBtns.forEach(btn => btn.classList.remove('active'));
  
  const parts = selectedDate.split('-');
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) quickBtns[1].classList.add('active');
  else if (diff === -1) quickBtns[0].classList.add('active');
  else if (diff === 1) quickBtns[2].classList.add('active');
  
  // Show skeleton
  const container = document.getElementById('tasksList');
  container.innerHTML = `
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>`;
  
  try {
    const res = await fetch(`${API_URL}/api/tasks?date=${selectedDate}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await res.json();
    
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    const total = pending.length + completed.length;
    const rate = total > 0 ? Math.round(completed.length / total * 100) : 0;
    
    document.getElementById('progressText').textContent = `${completed.length} de ${total} concluídas`;
    document.getElementById('progressFill').style.width = rate + '%';
    
    renderTaskList(tasks, container, true);
  } catch (e) {
    container.innerHTML = '<div class="empty"><i class="ph ph-warning-circle"></i><div class="empty-title">Erro ao carregar</div></div>';
  }
}
```

- [ ] **Step 7: Add `addQuickTaskInline()` function**

For the new inline quick-add bar in the tasks page.

```javascript
async function addQuickTaskInline() {
  const desc = document.getElementById('quickTaskInput').value.trim();
  if (!desc) return showToast('Digite uma tarefa', 'error');
  
  const room = document.getElementById('quickTaskRoomSelect').value;
  const date = getSelectedDate();
  const token = localStorage.getItem('token');
  
  const btn = document.querySelector('.quick-add-bar .btn-primary');
  setLoading(btn, true);
  
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ description: desc, room: room, due_date: date })
  });
  
  setLoading(btn, false);
  
  if (res.ok) {
    document.getElementById('quickTaskInput').value = '';
    await loadTasks();
    await loadPendingCount();
    showToast('Tarefa adicionada', 'success');
  } else {
    const data = await res.json();
    showToast(data.error || 'Erro', 'error');
  }
}
```

- [ ] **Step 8: Update `getSelectedDate()` to use hidden input**

The date input is now hidden in tasks page:

```javascript
function getSelectedDate() {
  let val = document.getElementById('taskDate').value;
  if (!val) {
    val = new Date().toISOString().split('T')[0];
    document.getElementById('taskDate').value = val;
  }
  return val;
}
```

- [ ] **Step 9: Update `setDate()` to work with new structure**

```javascript
function setDate(delta) {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  document.getElementById('taskDate').value = `${y}-${m}-${day}`;
  loadTasks();
}
```

- [ ] **Step 10: Remove old widget code from `loadTasks()`**

Since `loadTasks()` was rewritten, the old widget generation code is removed. The `renderTaskList()` replaces the old HTML generation.

- [ ] **Step 11: Update `initApp()` to load dashboard first**

```javascript
async function initApp() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('dashboard').classList.add('active');
  showPage('dashboard');
  loadTheme();
  updateThemeIcons();
  await Promise.all([loadTemplates(), loadPendingCount()]);
}
```

- [ ] **Step 12: Update the IIFE to call `showPage('dashboard')` on init**

The bottom of app.js, the existing `loadTheme()` and `updateThemeIcons()` calls are already there. Just ensure `showPage('dashboard')` is called when the app initializes with a valid token. Add it inside `initApp()`.

- [ ] **Step 13: Update `loadHousehold()` to work with members page**

The function is already mostly correct. Update how it populates — the `membersList` div is now inside `#pageMembers`. Update:

In `loadHousehold()`, the line that populates member data `document.getElementById('membersList').innerHTML = html;` now targets the members page. This is already correct since the id didn't change.

Add skeleton loading and ensure the join/invite sections are properly shown on the members page.

- [ ] **Step 14: Commit**

```bash
git add public/js/app.js
git commit -m "feat: rewrite JS with page system, dashboard, task cards, inline quick-add"
```

---

### Task 5: Verify App Works

**Files:**
- N/A

- [ ] **Step 1: Start server**

Run: `npm start`
Expected: Server starts on port 3000

- [ ] **Step 2: Open in browser**

Verify:
- Sidebar shows 4 items (Dashboard, Tarefas, Membros, Config)
- Dashboard loads with widgets and today's tasks
- Tasks page shows date pills and progress bar
- Members page shows invite code and member list
- Config page shows sub-tabs
- Mobile bottom-nav works
- Dark mode toggle works
- Task cards show room colors
- Quick-add inline works
- Toast + confirm modal still work

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: Same results as before (28 pass, 1 pre-existing fail)

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "fix: polish after redesign verification"
```
