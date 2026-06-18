# Todo Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Casa em Ordem todo app with malva/lilac color palette, responsive desktop sidebar layout, and improved task card design.

**Architecture:** Single-page application (all code in `public/index.html`). Replace CSS custom properties for colors, restructure HTML for sidebar/bottom-nav responsive layout, and add new CSS for widgets. All JS logic stays untouched.

**Tech Stack:** Vanilla JS, CSS custom properties, Phosphor Icons, CSS Grid/Flexbox

---

### Task 1: Replace color palette (CSS custom properties)

**Files:**
- Modify: `public/index.html:17-28`

- [ ] **Replace `:root` CSS variables**

Replace the existing `:root` block (lines 17-28) with the malva palette:

```css
:root {
  --primary: #9b6b9d;
  --primary-dark: #5c3d5e;
  --primary-light: #f5eff5;
  --primary-muted: #8b6b8d;
  --primary-subtle: #b89bb8;
  --border: #e8dce8;
  --border-light: #f0e8f0;
  --bg: #f9f5f9;
  --surface: #ffffff;
  --text: #3d2d3f;
  --text-muted: #6b4b6d;
  --dashed: #d5b8d5;
  --progress-secondary: #c4aac4;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 14px;
  --shadow: 0 1px 3px rgba(91,61,94,0.08);
  --shadow-hover: 0 2px 8px rgba(91,61,94,0.12);
}
```

- [ ] **Remove duplicate CSS** — delete the duplicated `*` block (lines 31-35), duplicate `body` (lines 58-63), and duplicate `.container` (lines 65-70) styles. Keep only the first occurrence of each.

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: replace color palette with malva/lilac theme"
```

---

### Task 2: Base layout — container, body, sidebar (desktop) + bottom nav (mobile)

**Files:**
- Modify: `public/index.html:37-76` (body/container styles)
- Modify: `public/index.html:124-199` (header/nav HTML + CSS)

- [ ] **Update body and container styles**

Replace existing body/container CSS (around lines 37-76):

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  min-height: 100vh;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

/* Desktop: sidebar layout */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
```

- [ ] **Rewrite header HTML to be simpler (mobile + desktop compatible)**

Replace the `<header class="header">` block (lines 1366-1374):

```html
<header class="header">
  <div class="header-left">
    <span class="logo">🌸 Casa em Ordem</span>
  </div>
  <div style="display:flex;align-items:center;gap:12px">
    <span class="badge-label">Pendentes hoje</span>
    <span class="badge" id="pendingCount">0</span>
  </div>
</header>
```

- [ ] **Update header CSS**

Replace the `.header` CSS block (lines 124-132):

```css
.header {
  background: var(--surface);
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-dark);
}

.badge {
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 10px;
}

.badge-label {
  font-size: 12px;
  color: var(--primary-muted);
}
```

- [ ] **Replace nav with sidebar HTML (desktop) + keep mobile nav**

Replace the `<nav class="nav">` block (lines 1377-1390) and add sidebar + bottom nav:

```html
<!-- Desktop Sidebar -->
<aside class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-logo">🌸 Casa em Ordem</div>
    <div class="sidebar-tagline">Gerencie sua casa</div>
  </div>
  <nav class="sidebar-nav">
    <button class="sidebar-btn active" id="sideTasks" onclick="showTab('tasks')">
      <i class="ph ph-list-checks"></i> Tarefas
    </button>
    <button class="sidebar-btn" id="sideConfig" onclick="showTab('config')">
      <i class="ph ph-gear-six"></i> Configurações
    </button>
  </nav>
  <div class="sidebar-footer">
    <div class="sidebar-user" id="sidebarUser">👑 Carregando...</div>
    <button class="sidebar-logout" onclick="handleLogout()">
      <i class="ph ph-sign-out"></i> Sair
    </button>
  </div>
</aside>

<!-- Mobile Bottom Nav -->
<nav class="bottom-nav" id="bottomNav">
  <button class="bottom-nav-btn active" id="mobTasks" onclick="showTab('tasks')">
    <i class="ph ph-list-checks"></i>
    <span>Tarefas</span>
  </button>
  <button class="bottom-nav-btn" id="mobConfig" onclick="showTab('config')">
    <i class="ph ph-gear-six"></i>
    <span>Config</span>
  </button>
  <button class="bottom-nav-btn" onclick="handleLogout()">
    <i class="ph ph-sign-out"></i>
    <span>Sair</span>
  </button>
</nav>
```

- [ ] **Add sidebar and bottom nav CSS**

Add after the header CSS block:

```css
/* Sidebar (desktop only) */
.sidebar {
  display: none;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    width: 220px;
    min-width: 220px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    min-height: 100vh;
  }

  .sidebar-header {
    padding: 24px 20px 16px;
    border-bottom: 1px solid var(--border-light);
  }

  .sidebar-logo {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-dark);
  }

  .sidebar-tagline {
    font-size: 12px;
    color: var(--primary-muted);
    margin-top: 2px;
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
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
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
    border-top: 1px solid var(--border-light);
  }

  .sidebar-user {
    font-size: 14px;
    color: var(--primary-dark);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .sidebar-logout {
    background: none;
    border: none;
    color: var(--primary-subtle);
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
  }

  .sidebar-logout:hover {
    color: var(--primary);
  }
}

/* Bottom Nav (mobile only) */
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
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--primary-muted);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.bottom-nav-btn i {
  font-size: 20px;
}

.bottom-nav-btn.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}
```

- [ ] **Update `.app-section` to work with sidebar**

Update `.app-section` CSS (around lines 112-121):

```css
.app-section {
  display: none;
  flex: 1;
  min-height: 100vh;
}

.app-section.active {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .app-section.active {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
}
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: add sidebar (desktop) and bottom nav (mobile)"
```

---

### Task 3: Content area layout — responsive grid

**Files:**
- Modify: `public/index.html:201-216` (content CSS)

- [ ] **Update content area CSS**

Replace the `.content` block (lines 201-216):

```css
.content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .content {
    padding: 28px 32px;
  }
}

/* Dashboard grid layout */
.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 28px;
    align-content: start;
  }
}
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: responsive dashboard grid for desktop 2-column layout"
```

---

### Task 4: Task items redesign + date navigation

**Files:**
- Modify: `public/index.html` — task item CSS (lines 596-683) and date nav CSS (lines 218-283)

- [ ] **Update date navigation CSS**

Replace the `.date-nav` block (lines 218-283):

```css
.date-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--surface);
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: 14px;
}

.date-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--primary-muted);
  transition: all 0.2s;
}

.date-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary);
}

.date-nav input[type="date"] {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  text-align: center;
}

.quick-dates {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 14px;
}

.quick-date {
  padding: 5px 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.quick-date:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.quick-date.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
```

- [ ] **Update task list CSS**

Replace the task-list CSS block (lines 596-683):

```css
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: all 0.2s;
}

.task-item:hover {
  box-shadow: var(--shadow-hover);
}

.task-item.completed {
  opacity: 0.55;
}

.task-item.completed .task-desc {
  text-decoration: line-through;
}

.task-check {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
  cursor: pointer;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-desc {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.task-desc .task-room {
  color: var(--primary-muted);
  font-weight: 400;
  font-size: 13px;
}

.task-meta {
  font-size: 12px;
  color: var(--primary-muted);
  margin-top: 2px;
}

.task-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.task-assignee {
  padding: 3px 10px;
  background: var(--primary-light);
  border-radius: 12px;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.task-action {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 16px;
}

.task-action:hover {
  color: #fff;
}

.task-action.done:hover {
  background: var(--primary);
}

.task-action.delete:hover {
  background: #d9534f;
}
```

- [ ] **Update `buildTaskRow` function to use new HTML structure**

Replace the `buildTaskRow` function (lines 2399-2413):

```javascript
function buildTaskRow(task, isCompleted) {
  const room = task.room || '';
  const roomHtml = room ? `<span class="task-room"> · ${room}</span>` : '';
  const assigneeHtml = task.assigned_to ? `<span class="task-assignee">${task.assigned_to}</span>` : '';
  return `
    <div class="task-item ${isCompleted ? 'completed' : ''}">
      <input type="checkbox" class="task-check" value="${task.id}" ${isCompleted ? 'checked' : ''}>
      <div class="task-info" onclick="toggleTask(${task.id})" style="cursor:pointer;flex:1">
        <div class="task-desc">${task.description}${roomHtml}</div>
        <div class="task-meta">${task.assigned_to || 'Todos'}</div>
      </div>
      <div class="task-actions">
        ${assigneeHtml}
        ${!isCompleted ? `<button class="task-action done" onclick="toggleTask(${task.id})" aria-label="Concluir">✓</button>` : ''}
        <button class="task-action delete" onclick="deleteTask(${task.id})" aria-label="Excluir"><i class="ph ph-trash"></i></button>
      </div>
    </div>
  `;
}
```

- [ ] **Update the add task button**

Replace the add task button in the tasks panel (around line 1414):

```html
<button class="btn-add-task" onclick="openTaskPicker()">
  <i class="ph ph-plus"></i>
  Adicionar tarefa
</button>
```

Add CSS for `.btn-add-task`:

```css
.btn-add-task {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px dashed var(--dashed);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.btn-add-task:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}
```

- [ ] **Update bulk actions CSS**

Replace bulk actions (around lines 686-695):

```css
.bulk-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.bulk-actions .btn {
  padding: 8px 14px;
  font-size: 12px;
}
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: redesign task items and date navigation with malva theme"
```

---

### Task 5: Completed tasks header + widgets (desktop right column)

**Files:**
- Modify: `public/index.html` — update `loadTasks` function to use new HTML structure for widgets

- [ ] **Update completed tasks header CSS**

Add after task-list CSS:

```css
.completed-header {
  margin: 16px 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
```

- [ ] **Add widget CSS for desktop right column**

Add after the content CSS:

```css
/* Desktop widgets */
.widget {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 18px;
  border: 1px solid var(--border);
  margin-bottom: 14px;
}

.widget-title {
  font-size: 12px;
  color: var(--primary-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 10px;
}

.widget-pending-count {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 4px 0;
}

.widget-progress-bar {
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  margin-bottom: 4px;
  overflow: hidden;
}

.widget-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.widget-progress-fill.primary {
  background: var(--primary);
}

.widget-progress-fill.secondary {
  background: var(--progress-secondary);
}

.widget-member-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: var(--primary-light);
  border-radius: 14px;
  font-size: 12px;
  color: var(--primary-dark);
  font-weight: 500;
}

.widget-member-add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: 1.5px dashed var(--border);
  border-radius: 14px;
  font-size: 12px;
  color: var(--primary-subtle);
  font-weight: 500;
  background: transparent;
  cursor: pointer;
}
```

- [ ] **Update `loadTasks` to add widget container on desktop**

Modify the `loadTasks` function to wrap task content in a grid and add widgets. Replace the HTML building in `loadTasks` (around lines 2361-2396):

```javascript
async function loadTasks() {
  const token = localStorage.getItem('token');
  const selectedDate = getSelectedDate();
  
  const quickBtns = document.querySelectorAll('.quick-date');
  quickBtns.forEach(btn => btn.classList.remove('active'));
  
  const parts = selectedDate.split('-');
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) quickBtns[1].classList.add('active');
  else if (diff === -1) quickBtns[0].classList.add('active');
  else if (diff === 1) quickBtns[2].classList.add('active');

  const res = await fetch(`${API_URL}/api/tasks?date=${selectedDate}`, { headers: { 'Authorization': `Bearer ${token}` } });
  const tasks = await res.json();
  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);
  
  let taskHtml = '';
  
  if (pending.length > 0) {
    taskHtml += `
      <div class="bulk-actions">
        <button class="btn btn-secondary btn-sm" onclick="selectAllTasks()">Todas</button>
        <button class="btn btn-primary btn-sm" onclick="bulkToggle()" style="background:var(--primary)">Feitas</button>
        <button class="btn btn-secondary btn-sm" onclick="bulkDelete()" style="background:#d9534f;color:#fff">Excluir</button>
      </div>
      <div class="task-list">
    `;
    for (const t of pending) taskHtml += buildTaskRow(t, false);
    taskHtml += '</div>';
  }
  if (completed.length > 0) {
    taskHtml += `
      <div class="completed-header">✅ Concluídas (${completed.length})</div>
      <div class="task-list">
    `;
    for (const t of completed) taskHtml += buildTaskRow(t, true);
    taskHtml += '</div>';
  }
  if (!taskHtml) {
    const dateFormatted = new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    taskHtml = `
      <div class="empty">
        <i class="ph ph-clipboard-text"></i>
        <div class="empty-title">Nenhuma tarefa</div>
        <div class="empty-text" style="text-transform:capitalize">${dateFormatted}</div>
      </div>
    `;
  }
  
  // Build widgets (desktop only - hidden on mobile via CSS)
  const widgetsHtml = `
    <div class="widget">
      <div class="widget-title">⏳ Pendentes hoje</div>
      <div class="widget-pending-count">${pending.length}</div>
      <div class="widget-progress-bar">
        <div class="widget-progress-fill primary" style="width:${completed.length + pending.length > 0 ? Math.round(completed.length / (completed.length + pending.length) * 100) : 0}%"></div>
      </div>
    </div>
    <div class="widget">
      <div class="widget-title">📊 Produtividade</div>
      <div id="widgetProductivity">Carregando...</div>
    </div>
    <div class="widget">
      <div class="widget-title">👥 Membros</div>
      <div id="widgetMembers" style="display:flex;gap:8px;flex-wrap:wrap">Carregando...</div>
    </div>
  `;
  
  // Full HTML with grid
  const fullHtml = `
    <div class="dashboard-grid">
      <div>${taskHtml}</div>
      <div class="widget-column">${widgetsHtml}</div>
    </div>
  `;
  
  document.getElementById('tasksList').innerHTML = fullHtml;
}
```

- [ ] **Add `widget-column` CSS for mobile**

Add CSS:

```css
@media (max-width: 767px) {
  .widget-column {
    display: none;
  }
}
```

- [ ] **Update `loadHousehold` to populate widgets**

Add to `loadHousehold` function, after building `membersList`, populate the widget members. Around line 2005:

```javascript
// Populate widget members
const widgetMembers = document.getElementById('widgetMembers');
if (widgetMembers && data.members) {
  let mHtml = '';
  for (const m of data.members) {
    const crown = m.role === 'admin' ? '👑 ' : '';
    mHtml += `<span class="widget-member-tag">${crown}${m.username}</span>`;
  }
  mHtml += `<button class="widget-member-add" onclick="showInviteForm()">+ Convidar</button>`;
  widgetMembers.innerHTML = mHtml;
}
```

- [ ] **Update `loadPendingCount` to also refresh widgets**

Refresh widget pending count in `loadPendingCount`:

```javascript
async function loadPendingCount() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/notifications/pending`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  document.getElementById('pendingCount').textContent = data.count;
  // Also update badge in header
  const badge = document.getElementById('pendingCount');
  if (badge) badge.textContent = data.count;
}
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: add desktop widgets and responsive dashboard grid"
```

---

### Task 6: Config section — apply new colors

**Files:**
- Modify: `public/index.html` — CSS for config tabs (lines 1021-1264)

- [ ] **Update config tabs CSS**

Replace the `config-tabs` CSS block (lines 1022-1056):

```css
.config-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.config-tab-btn {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: var(--primary-light);
  color: var(--text-muted);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
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
```

- [ ] **Update template filter tabs CSS**

Replace template-filter-tabs block (lines 1194-1234):

```css
.template-filter-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
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
```

- [ ] **Update template room tabs CSS**

Replace template-room-tabs block (lines 1236-1264):

```css
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
```

- [ ] **Update toggle switch CSS** (already uses `var(--blue)` — replace with `var(--primary)`)

Replace `var(--blue)` in `.toggle-switch input:checked + .toggle-slider` (line 830):

```css
.toggle-switch input:checked + .toggle-slider {
  background: var(--primary);
}
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: apply malva palette to config section and sub-tabs"
```

---

### Task 7: Buttons, cards, modals, and remaining components

**Files:**
- Modify: `public/index.html` — buttons (lines 362-419), cards (lines 294-316), modals (lines 879-948), auth (lines 78-109)

- [ ] **Update button CSS**

Replace the `.btn-primary` and `.btn-secondary` blocks (lines 386-402):

```css
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
```

- [ ] **Update card CSS** (lines 294-316):

```css
.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-muted);
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
```

- [ ] **Update auth section CSS** (lines 78-109):

Replace `.auth-card`, `.auth-title`, `.auth-subtitle`:

```css
.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.auth-subtitle {
  color: var(--primary-muted);
  font-size: 15px;
  margin-bottom: 32px;
}
```

- [ ] **Update modal CSS**

Replace modal-content (lines 895-903):

```css
.modal-content {
  background: var(--surface);
  border-radius: var(--radius);
  width: 100%;
  max-width: 450px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

Replace modal-header (lines 906-917):

```css
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-dark);
}
```

- [ ] **Update form input focus** (line 351):

```css
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(155, 107, 157, 0.1);
}
```

- [ ] **Update toggle-link and room-tag** (lines 428-435, 748-757):

Replace `color: var(--blue)` in toggle-link:

```css
.toggle-link button {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
}
```

Replace `.room-tag`:

```css
.room-tag {
  display: inline-block;
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}
```

- [ ] **Update suggestion item hover** (line 994):

```css
.suggestion-item:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
```

- [ ] **Update house code** (lines 438-445):

```css
.house-code {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--primary);
  text-align: center;
  margin: 16px 0;
}
```

- [ ] **Update `.member` CSS** — replace `var(--amber)` with `var(--primary)` (line 473):

```css
.member i {
  color: var(--primary);
  font-size: 14px;
}
```

- [ ] **Update `:focus-visible`** (line 416):

```css
.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

- [ ] **Update `theme-color` meta** (line 6):

```html
<meta name="theme-color" content="#9b6b9d" />
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: apply malva palette to buttons, modals, auth, and all components"
```

---

### Task 8: Fix showTab to toggle sidebar + bottom nav, update sidebar user

**Files:**
- Modify: `public/index.html` — `showTab` function (lines 1771-1777)

- [ ] **Update `showTab` to toggle sidebar and bottom nav buttons**

```javascript
function showTab(tab) {
  // Toggle nav buttons
  document.getElementById('navTasks').classList.toggle('active', tab === 'tasks');
  document.getElementById('navConfig').classList.toggle('active', tab === 'config');
  document.getElementById('sideTasks').classList.toggle('active', tab === 'tasks');
  document.getElementById('sideConfig').classList.toggle('active', tab === 'config');
  document.getElementById('mobTasks').classList.toggle('active', tab === 'tasks');
  document.getElementById('mobConfig').classList.toggle('active', tab === 'config');
  
  // Toggle panels
  document.getElementById('tasksPanel').classList.toggle('active', tab === 'tasks');
  document.getElementById('configPanel').classList.toggle('active', tab === 'config');
  
  if (tab === 'tasks') loadTasks();
}
```

- [ ] **Update `loadHousehold` to populate sidebar user**

In `loadHousehold`, after finding currentUser:

```javascript
// Populate sidebar user
const sidebarUser = document.getElementById('sidebarUser');
if (sidebarUser && currentUser) {
  sidebarUser.textContent = `👑 ${currentUser.username}`;
}
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "fix: sync sidebar/bottom-nav active states and show username"
```

---

### Task 9: Visual polish — empty states, productivity widget, transitions

**Files:**
- Modify: `public/index.html`

- [ ] **Update empty state icon color** (line 704):

```css
.empty i {
  font-size: 56px;
  color: var(--border);
  margin-bottom: 16px;
}
```

- [ ] **Update productivity card styles** (lines 1152-1192):

```css
.produt-card {
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px;
  margin-bottom: 8px;
}

.produt-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--primary-dark);
  margin-bottom: 6px;
}

.produt-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--primary-muted);
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
}
```

- [ ] **Update `loadProductivity` bar colors**

Replace the barColor logic (line 1810) to use malva shades:

```javascript
const barColor = rate >= 70 ? 'var(--primary)' : rate >= 40 ? 'var(--progress-secondary)' : 'var(--primary-subtle)';
```

- [ ] **Update member card styles** (lines 510-517):

```css
.member-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: var(--shadow);
}
```

- [ ] **Toast container stays** — only update toast colors (line 864):

```css
.toast.success { background: var(--primary); }
.toast.error { background: #d9534f; }
```

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "feat: polish empty states, productivity, and member cards"
```

---

### Task 10: Final review — check all `var(--blue)` references are replaced

**Files:**
- Modify: `public/index.html`

- [ ] **Find and replace any remaining `var(--blue)` references**

Search for `var(--blue)` and `var(--blue-dark)` in the file. All should be replaced with malva equivalents. Also check for `var(--emerald)` and `var(--rose)` — keep emerald for success, rose for error, or replace with primary/subtle as appropriate.

- [ ] **Verify no `var(--blue)` remains**

Run: `rg "var\(--blue\)" public/index.html`
Expected: no matches

- [ ] **Commit**

```bash
git add public/index.html && git commit -m "chore: replace remaining blue references with malva palette"
```
