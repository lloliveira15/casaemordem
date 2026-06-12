const API_URL = '';

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

// Theme management
function loadTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-toggle-icon').forEach(el => {
    el.className = isDark ? 'ph ph-sun theme-toggle-icon' : 'ph ph-moon theme-toggle-icon';
  });
  document.querySelectorAll('.theme-toggle-label').forEach(el => {
    el.textContent = isDark ? 'Modo claro' : 'Modo escuro';
  });
}

// Loading state helper
function setLoading(btnEl, isLoading) {
  if (!btnEl) return;
  if (isLoading) {
    btnEl.classList.add('loading');
    btnEl.disabled = true;
  } else {
    btnEl.classList.remove('loading');
    btnEl.disabled = false;
  }
}

function showAuth(tab) {
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('forgotForm').style.display = tab === 'forgot' ? 'block' : 'none';
  document.getElementById('resetForm').style.display = tab === 'reset' ? 'block' : 'none';
}

function showForgotPassword() {
  showAuth('forgot');
}

async function handleForgotPassword() {
  const email = document.getElementById('forgotEmail').value;
  if (!email) return showToast('Digite seu email', 'error');
  
  const btn = document.querySelector('#forgotForm .btn-primary');
  setLoading(btn, true);
  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    
    if (res.ok) {
      showToast(data.message, 'success');
      showAuth('login');
    } else {
      showToast(data.error, 'error');
    }
  } catch (e) {
    showToast('Erro ao solicitar redefinição', 'error');
  } finally {
    setLoading(btn, false);
  }
}

async function handleResetPassword() {
  const password = document.getElementById('resetPassword').value;
  const confirm = document.getElementById('resetConfirm').value;

  if (!password || !confirm) return showToast('Preencha todos os campos', 'error');
  if (password.length < 6) return showToast('Senha deve ter no mínimo 6 caracteres', 'error');
  if (password !== confirm) return showToast('Senhas não conferem', 'error');

  const params = new URLSearchParams(window.location.search);
  const token = params.get('reset');
  if (!token) {
    showToast('Link inválido ou expirado', 'error');
    return;
  }

  const btn = document.querySelector('#resetForm .btn-primary');
  setLoading(btn, true);
  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: password })
    });
    const data = await res.json();

    if (res.ok) {
      showToast('Senha redefinida com sucesso! Faça login.', 'success');
      window.history.replaceState({}, '', window.location.pathname);
      showAuth('login');
    } else {
      showToast(data.error, 'error');
    }
  } catch (e) {
    showToast('Erro ao redefinir senha', 'error');
  } finally {
    setLoading(btn, false);
  }
}

function showPage(page) {
  const pages = ['dashboard', 'tasks', 'members', 'config'];
  
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  
  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  
  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.id === 'page' + page.charAt(0).toUpperCase() + page.slice(1));
  });
  
  const titles = { dashboard: 'Dashboard', tasks: 'Tarefas', members: 'Membros', config: 'Configurações' };
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = titles[page] || 'Dashboard';
  
  if (page === 'dashboard') loadDashboard();
  if (page === 'tasks') loadTasks();
  if (page === 'members') loadHousehold();
}

async function loadDashboard() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const pendingEl = document.getElementById('dashboardPendingCount');
  const progressFill = document.getElementById('dashboardProgressFill');
  const progressText = document.getElementById('dashboardProgressText');
  const prodPct = document.getElementById('dashboardProductivityPct');
  const prodText = document.getElementById('dashboardProductivityText');
  const membersList = document.getElementById('dashboardMembersList');

  if (pendingEl) pendingEl.textContent = '—';
  if (progressFill) progressFill.style.width = '0%';
  if (progressText) progressText.textContent = 'Carregando...';
  if (prodPct) prodPct.textContent = '—';
  if (prodText) prodText.textContent = 'Carregando...';

  try {
    const pendingRes = await fetch(`${API_URL}/api/notifications/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pendingData = await pendingRes.json();
    document.getElementById('pendingCount').textContent = pendingData.count;
    if (pendingEl) pendingEl.textContent = pendingData.count;

    const today = new Date().toISOString().split('T')[0];
    const tasksRes = await fetch(`${API_URL}/api/tasks?date=${today}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await tasksRes.json();
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    const total = pending.length + completed.length;
    const rate = total > 0 ? Math.round(completed.length / total * 100) : 0;

    if (progressFill) progressFill.style.width = rate + '%';
    if (progressText) progressText.textContent = `${completed.length} de ${total} concluídas (${rate}%)`;

    const statsRes = await fetch(`${API_URL}/api/tasks/stats?period=week`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    const members = statsData.byMember || [];

    if (members.length > 0 && prodPct) {
      const totalCompleted = members.reduce((s, m) => s + (m.completed || 0), 0);
      const totalAll = members.reduce((s, m) => s + (m.total || 0), 0);
      const pct = totalAll > 0 ? Math.round(totalCompleted / totalAll * 100) : 0;
      prodPct.textContent = pct + '%';
      if (prodText) prodText.textContent = `${totalCompleted} tarefas concluídas`;
    }

    const houseRes = await fetch(`${API_URL}/api/household`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const houseData = await houseRes.json();
    if (houseData.members && membersList) {
      let mHtml = '';
      for (const m of houseData.members) {
        mHtml += `<span class="widget-member-chip"><i class="ph ph-crown" style="color:var(--primary);font-size:10px"></i> ${m.username}</span>`;
      }
      membersList.innerHTML = mHtml;
    }

    const dashboardContainer = document.getElementById('dashboardTasksList');
    if (dashboardContainer) renderTaskList(tasks, dashboardContainer, false);

  } catch (e) {
    // silent fail
  }
}

function switchConfigTab(tab) {
  const tabs = ['casa', 'templates', 'notif', 'gerar', 'produt'];
  tabs.forEach(t => {
    const btn = document.getElementById('configTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const content = document.getElementById('subtab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn && content) {
      btn.classList.toggle('active', tab === t);
      content.classList.toggle('active', tab === t);
    }
  });
  if (tab === 'produt') loadProductivity();
}

async function loadProductivity() {
  const token = localStorage.getItem('token');
  const period = document.getElementById('produtPeriod').value;
  
  const res = await fetch(`${API_URL}/api/tasks/stats?period=${period}`, { 
    headers: { 'Authorization': `Bearer ${token}` } 
  });
  const data = await res.json();
  
  const members = data.byMember || [];
  if (members.length === 0) {
    document.getElementById('productivityList').innerHTML = '<div class="empty-text">Sem dados</div>';
    return;
  }
  
  let html = '';
  for (const m of members) {
    const rate = m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0;
    const barColor = rate >= 70 ? 'var(--primary)' : rate >= 40 ? 'var(--progress-secondary)' : 'var(--primary-subtle)';
    
    html += `<div class="produt-card">
      <div class="produt-name">${m.username || 'Não atribuído'}</div>
      <div class="produt-stats">
        <span>${m.completed || 0} concluídas</span>
        <span>${m.pending || 0} pendentes</span>
      </div>
      <div class="produt-bar">
        <div class="produt-bar-fill" style="width:${rate}%;background:${barColor}"></div>
      </div>
      <div class="produt-rate">${rate}%</div>
    </div>`;
  }
  
  document.getElementById('productivityList').innerHTML = html;

  // Update widget productivity
  const widgetProd = document.getElementById('widgetProductivity');
  if (widgetProd && members.length > 0) {
    let wHtml = '';
    for (const m of members) {
      const rate = m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0;
      const barColor = rate >= 70 ? 'var(--primary)' : rate >= 40 ? 'var(--progress-secondary)' : 'var(--primary-subtle)';
      wHtml += `
        <div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span style="color:var(--primary-dark)">${m.username || 'N/A'}</span><span style="color:var(--primary);font-weight:600">${rate}%</span></div>
          <div style="height:6px;background:var(--border-light);border-radius:3px;overflow:hidden"><div style="height:100%;width:${rate}%;background:${barColor};border-radius:3px"></div></div>
        </div>`;
    }
    widgetProd.innerHTML = wHtml;
  }
}

async function handleRegister() {
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const phone = document.getElementById('regPhone').value;
  const invite_code = document.getElementById('regInvite').value.trim().toUpperCase();
  const body = { username, email, password, phone };
  if (invite_code) body.invite_code = invite_code;
  const btn = document.querySelector('#registerForm .btn-primary');
  setLoading(btn, true);
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('token', data.token);
    initApp();
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    setLoading(btn, false);
  }
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const btn = document.querySelector('#loginForm .btn-primary');
  setLoading(btn, true);
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('token', data.token);
    initApp();
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    setLoading(btn, false);
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  location.reload();
}

async function initApp() {
  document.getElementById('authSection').style.display = 'none';
  const dashboard = document.getElementById('dashboard');
  if (dashboard) dashboard.classList.add('active');
  showPage('dashboard');
  loadTheme();
  updateThemeIcons();
  await Promise.all([loadTemplates(), loadPendingCount()]);
}

async function loadHousehold() {
  const token = localStorage.getItem('token');

  // Show skeleton for members
  document.getElementById('membersList').innerHTML = `
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>`;

  const res = await fetch(`${API_URL}/api/household`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  if (data.hasHousehold) {
    document.getElementById('inviteCode').textContent = data.household.invite_code;
    generateInviteQR(data.household.invite_code);
    let html = '<div class="members-header"><span>Cadastro de membros</span></div>';
    
    if (data.isAdmin) {
      html += `<button class="btn btn-secondary btn-sm" onclick="showInviteForm()" style="margin-bottom:16px">
        <i class="ph ph-user-plus"></i> Convidar membro
      </button>`;
    }
    
    // Seção para editar próprio perfil
    const currentUser = data.members.find(m => m.id === data.currentUserId);
    // Populate sidebar user
    const sidebarUser = document.getElementById('sidebarUser');
    if (sidebarUser && currentUser) {
      sidebarUser.innerHTML = `<i class="ph ph-crown"></i> ${currentUser.username}`;
    }
    if (currentUser) {
      const phone = currentUser.phone || '';
      const phoneDisplay = currentUser.phone ? currentUser.phone : '—';
      const emailDisplay = currentUser.email || '—';
      
      html += `<div class="member-card" id="memberCard${currentUser.id}">
        <div class="member-card-header">
          <span class="member-card-name">${currentUser.username} (Você)</span>
          <button class="btn-edit" onclick="editMember(${currentUser.id})" title="Editar">
            <i class="ph ph-pencil-simple"></i>
          </button>
        </div>
        <div class="member-card-body" id="memberBody${currentUser.id}">
          <div class="member-card-field">
            <span class="field-label">Email</span>
            <span class="field-value">${emailDisplay}</span>
          </div>
          <div class="member-card-field">
            <span class="field-label">Telefone</span>
            <span class="field-value" id="phoneDisplay${currentUser.id}">${phoneDisplay}</span>
          </div>
          <div class="member-card-field">
            <span class="field-label">Notificações</span>
            <span class="field-value">${currentUser.notifications_enabled ? 'Ativadas' : 'Desativadas'}</span>
          </div>
        </div>
        <div class="member-card-edit" id="memberEdit${currentUser.id}" style="display:none">
          <div class="form-group">
            <label>Nome</label>
            <input type="text" id="editName${currentUser.id}" value="${currentUser.username}">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="editEmail${currentUser.id}" value="${currentUser.email || ''}">
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" id="editPhone${currentUser.id}" value="${phone}" placeholder="(11) 99999-9999">
          </div>
          <div class="edit-actions">
            <button class="btn btn-secondary btn-sm" onclick="cancelEdit(${currentUser.id})">Cancelar</button>
            <button class="btn btn-primary btn-sm" onclick="saveMember(${currentUser.id})">Salvar</button>
          </div>
        </div>
      </div>`;
    }
    
    // Demais membros
    for (const m of data.members) {
      continue;
    }
    
    let outros = data.members.filter(m => m.id !== data.currentUserId);
    for (const m of outros) {
      const crown = m.role === 'admin' ? '<i class="ph-fill ph-crown"></i>' : '';
      const phone = m.phone || '';
      const phoneDisplay = m.phone ? m.phone : '—';
      const emailDisplay = m.email || '—';
      
      const canEdit = data.isAdmin && m.role !== 'admin';
      
      html += `<div class="member-card" id="memberCard${m.id}">
        <div class="member-card-header">
          <span class="member-card-name">${m.username} ${crown}</span>
          ${canEdit ? `
            <button class="btn-edit" onclick="editMember(${m.id})" title="Editar">
              <i class="ph ph-pencil-simple"></i>
            </button>
          ` : ''}
        </div>
        <div class="member-card-body" id="memberBody${m.id}">
          <div class="member-card-field">
            <span class="field-label">Email</span>
            <span class="field-value">${emailDisplay}</span>
          </div>
          <div class="member-card-field">
            <span class="field-label">Telefone</span>
            <span class="field-value" id="phoneDisplay${m.id}">${phoneDisplay}</span>
          </div>
          <div class="member-card-field">
            <span class="field-label">Notificações</span>
            ${canEdit ? `
              <label class="toggle-switch small">
                <input type="checkbox" ${m.notifications_enabled ? 'checked' : ''} 
                  onchange="toggleMemberNotification(${m.id}, this.checked)">
                <span class="toggle-slider"></span>
              </label>
            ` : `<span class="field-value">${m.notifications_enabled ? 'Ativadas' : 'Desativadas'}</span>`}
          </div>
        </div>
        <div class="member-card-edit" id="memberEdit${m.id}" style="display:none">
          <div class="form-group">
            <label>Nome</label>
            <input type="text" id="editName${m.id}" value="${m.username}">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="editEmail${m.id}" value="${m.email || ''}">
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" id="editPhone${m.id}" value="${phone}" placeholder="(11) 99999-9999">
          </div>
          <div class="edit-actions">
            <button class="btn btn-secondary btn-sm" onclick="cancelEdit(${m.id})">Cancelar</button>
            <button class="btn btn-primary btn-sm" onclick="saveMember(${m.id})">Salvar</button>
          </div>
        </div>
      </div>`;
    }
    document.getElementById('membersList').innerHTML = html;
    document.getElementById('householdActions').style.display = 'flex';
    document.getElementById('inviteQR').style.display = 'block';
    document.getElementById('regenerateCodeBtn').style.display = 'inline-flex';
    document.getElementById('joinHouseholdSection').style.display = 'none';
  } else {
    document.getElementById('inviteCode').textContent = '------';
    document.getElementById('inviteQR').innerHTML = '';
    document.getElementById('inviteQR').style.display = 'none';
    document.getElementById('householdActions').style.display = 'none';
    document.getElementById('regenerateCodeBtn').style.display = 'none';
    document.getElementById('membersList').innerHTML = '<div class="members-header"><span>Você não tem uma casa</span></div>';
    document.getElementById('joinHouseholdSection').style.display = 'block';
  }
  // Populate widget members
  const widgetMembers = document.getElementById('widgetMembers');
  if (widgetMembers && data.members) {
    let mHtml = '';
    for (const m of data.members) {
      const crown = m.role === 'admin' ? '<i class="ph ph-crown"></i> ' : '';
      mHtml += `<span class="widget-member-tag">${crown}${m.username}</span>`;
    }
    mHtml += `<button class="widget-member-add" onclick="showInviteForm()">+ Convidar</button>`;
    widgetMembers.innerHTML = mHtml;
  }
}

async function toggleMemberNotification(memberId, enabled) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/household/members/${memberId}/notifications`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ enabled })
  });
  if (res.ok) {
    showToast(enabled ? 'Notificações ativadas' : 'Notificações desativadas', 'success');
  }
}

function editMember(memberId) {
  document.getElementById('memberBody' + memberId).style.display = 'none';
  document.getElementById('memberEdit' + memberId).style.display = 'block';
}

function cancelEdit(memberId) {
  document.getElementById('memberBody' + memberId).style.display = 'block';
  document.getElementById('memberEdit' + memberId).style.display = 'none';
}

async function saveMember(memberId) {
  const token = localStorage.getItem('token');
  const username = document.getElementById('editName' + memberId).value;
  const email = document.getElementById('editEmail' + memberId).value;
  const phone = document.getElementById('editPhone' + memberId).value;
  const notifications_enabled = document.querySelector('#memberEdit' + memberId + ' input[type="checkbox"]')?.checked;
  
  const res = await fetch(`${API_URL}/api/household/members/${memberId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ username, email, phone, notifications_enabled })
  });
  
  if (res.ok) {
    showToast('Membro atualizado', 'success');
    loadHousehold();
  } else {
    const data = await res.json();
    showToast(data.error || 'Erro ao atualizar', 'error');
  }
}

function showInviteForm() {
  const code = document.getElementById('inviteCode').textContent;
  const link = window.location.origin + '?invite=' + encodeURIComponent(code);
  const msg = `Compartilhe o QR Code ou o link abaixo com o membro:<br><br>
    <strong style="font-size:18px;color:var(--primary)">${link}</strong><br><br>
    Ou use o código: <strong style="font-size:18px;color:var(--primary);letter-spacing:4px">${code}</strong>`;
  showAlertModal(msg, { title: 'Convidar membro', type: 'info', btnText: 'OK' });
}

function copyInviteCode() {
  const code = document.getElementById('inviteCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Código copiado!', 'success');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Código copiado!', 'success');
  });
}

function copyInviteLink() {
  const code = document.getElementById('inviteCode').textContent;
  const link = window.location.origin + '?invite=' + encodeURIComponent(code);
  navigator.clipboard.writeText(link).then(() => {
    showToast('Link copiado!', 'success');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = link;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Link copiado!', 'success');
  });
}

function showInviteEmailForm() {
  const form = document.getElementById('inviteEmailForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
  if (form.style.display === 'block') {
    document.getElementById('inviteEmailInput').focus();
  }
}

async function sendInviteEmail() {
  const token = localStorage.getItem('token');
  const email = document.getElementById('inviteEmailInput').value.trim();
  if (!email) {
    showToast('Digite um email', 'error');
    return;
  }
  const btn = document.querySelector('#inviteEmailForm .btn-primary');
  setLoading(btn, true);
  const res = await fetch(`${API_URL}/api/household/send-invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  setLoading(btn, false);
  if (res.ok) {
    showToast('Convite enviado!', 'success');
    document.getElementById('inviteEmailForm').style.display = 'none';
    document.getElementById('inviteEmailInput').value = '';
  } else {
    showToast(data.error || 'Erro ao enviar convite', 'error');
  }
}

async function joinHousehold() {
  const token = localStorage.getItem('token');
  const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
  const errEl = document.getElementById('joinError');
  if (!code) {
    errEl.textContent = 'Digite um código de convite';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';
  const btn = document.querySelector('#joinHouseholdSection .btn-primary');
  setLoading(btn, true);
  const res = await fetch(`${API_URL}/api/household/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ invite_code: code })
  });
  const data = await res.json();
  setLoading(btn, false);
  if (res.ok) {
    showToast('Você entrou na casa!', 'success');
    document.getElementById('joinCodeInput').value = '';
    loadHousehold();
  } else {
    errEl.textContent = data.error || 'Erro ao entrar na casa';
    errEl.style.display = 'block';
  }
}

async function regenerateCode() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/household/generate-code`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (res.ok) {
    document.getElementById('inviteCode').textContent = data.invite_code;
    generateInviteQR(data.invite_code);
    showToast('Novo código gerado!', 'success');
  }
}

function generateInviteQR(code) {
  const container = document.getElementById('inviteQR');
  container.innerHTML = '';
  const url = window.location.origin + '?invite=' + encodeURIComponent(code);
  const img = document.createElement('img');
  img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + encodeURIComponent(url);
  img.alt = 'QR Code para convidar';
  img.style.width = '160px';
  img.style.height = '160px';
  img.style.borderRadius = '8px';
  img.loading = 'lazy';
  container.appendChild(img);
}

const PAGE_SIZE = 12;
const templatePagination = {};
const templateAllData = {};

async function loadTemplates() {
  const token = localStorage.getItem('token');

  // Show skeleton while loading
  document.getElementById('templatesList').innerHTML = `
    <div class="skeleton skeleton-text" style="width:200px;height:30px;margin-bottom:16px"></div>
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>`;

  const res = await fetch(`${API_URL}/api/templates`, { headers: { 'Authorization': `Bearer ${token}` } });
  const templates = await res.json();

  const freqLabels = { daily: 'Diária', weekly: 'Semanal', biweekly: 'Quinzenal', monthly: 'Mensal' };
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const groups = {
    daily: templates.filter(t => t.frequency === 'daily'),
    weekly: templates.filter(t => t.frequency === 'weekly'),
    biweekly: templates.filter(t => t.frequency === 'biweekly'),
    monthly: templates.filter(t => t.frequency === 'monthly')
  };

  templateAllData.daily = groups.daily;
  templateAllData.weekly = groups.weekly;
  templateAllData.biweekly = groups.biweekly;
  templateAllData.monthly = groups.monthly;

  let html = '<div class="template-filter-tabs">';
  for (const freq of ['daily', 'weekly', 'biweekly', 'monthly']) {
    if (groups[freq].length === 0) continue;
    html += `<button class="template-filter-btn active" onclick="filterTemplates('${freq}')" id="filter${freq}">${freqLabels[freq]}<span class="count">${groups[freq].length}</span></button>`;
  }
  html += '</div>';

  for (const freq of ['daily', 'weekly', 'biweekly', 'monthly']) {
    const items = groups[freq];
    if (items.length === 0) continue;

    const rooms = [...new Set(items.map(t => t.room).filter(Boolean))];
    
    templatePagination[freq] = { page: 0, room: null };
    
    html += `<div class="template-group visible" id="group${freq}">
      <div class="template-group-header">${freqLabels[freq]}</div>`;
      
    if (rooms.length > 0) {
      html += '<div class="template-room-tabs" id="rooms' + freq + '">';
      html += `<button class="template-room-btn active" onclick="filterTemplatesByRoom('${freq}', null)" id="room${freq}all">Todos (${items.length})</button>`;
      for (const room of rooms) {
        const count = items.filter(t => t.room === room).length;
        const safeId = room.replace(/[^a-zA-Z0-9]/g, '_');
        html += `<button class="template-room-btn" onclick="filterTemplatesByRoom('${freq}', '${room.replace(/'/g, "\\'")}')" id="room${freq}${safeId}">${room} (${count})</button>`;
      }
      html += '</div>';
    }

    html += `<div class="template-list-view" id="view${freq}"></div></div>`;
  }

  document.getElementById('templatesList').innerHTML = templates.length ? html : '<div class="empty-text" style="padding:16px 0">Nenhum template</div>';
  
  setTimeout(() => {
    ['daily', 'weekly', 'biweekly', 'monthly'].forEach(freq => {
      if (groups[freq].length > 0) renderTemplateFilteredPage(freq);
    });
  }, 0);
}

function filterTemplatesByRoom(freq, room) {
  const pag = templatePagination[freq];
  if (!pag) return;

  document.querySelectorAll('#rooms' + freq + ' .template-room-btn').forEach(btn => btn.classList.remove('active'));

  if (room === null) {
    const btnAll = document.getElementById('room' + freq + 'all');
    if (btnAll) btnAll.classList.add('active');
  } else {
    const btnId = 'room' + freq + room.replace(/[^a-zA-Z0-9]/g, '_');
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add('active');
  }

  pag.room = room;
  pag.page = 0;

  renderTemplateFilteredPage(freq);
}

function renderTemplateFilteredPage(freq) {
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const pag = templatePagination[freq];
  const allItems = templateAllData[freq];
  const filtered = allItems.filter(t => pag.room === null || t.room === pag.room);
  const sorted = filtered.sort((a, b) => {
    if (freq === 'weekly' && a.day_value !== b.day_value) return a.day_value - b.day_value;
    if (freq === 'monthly' && a.day_value !== b.day_value) return a.day_value - b.day_value;
    return 0;
  });

  pag.total = sorted.length;
  const start = pag.page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, sorted.length);

  let html = '';
  for (let i = start; i < end; i++) {
    const t = sorted[i];
    const dayLabel = (t.frequency === 'weekly' && t.day_value != null) ? dayNames[t.day_value] :
                (t.frequency === 'monthly' && t.day_value != null) ? t.day_value + 'º dia' : '';
    const roomTag = t.room ? `<span class="room-tag">${t.room}</span>` : '';
    html += `
      <div class="template-list-item">
        <div class="template-desc">${t.description}</div>
        <div class="template-meta">${roomTag}${dayLabel ? ' · ' + dayLabel : ''}${t.assigned_to ? ' · ' + t.assigned_to : ''}</div>
        <button class="template-delete" onclick="deleteTemplate(${t.id})" style="margin-top:8px">
          <i class="ph ph-trash"></i>
        </button>
      </div>`;
  }

  if (sorted.length > PAGE_SIZE) {
    const hasPrev = pag.page > 0;
    const hasNext = end < sorted.length;
    html += `</div>
    <div class="template-list-pagination">
      <button class="btn-nav" onclick="prevTemplates('${freq}')" id="prev${freq}" ${hasPrev ? '' : 'disabled'}>&larr; Anterior</button>
      <span class="info" id="info${freq}">${start + 1}-${end} de ${sorted.length}</span>
      <button class="btn-nav" onclick="nextTemplates('${freq}')" id="next${freq}" ${hasNext ? '' : 'disabled'}>Próxima &rarr;</button>
    </div>`;
  }

  const view = document.getElementById('view' + freq);
  if (view) view.innerHTML = html;
}

function nextTemplates(freq) {
  const pag = templatePagination[freq];
  if (!pag) return;
  const filtered = templateAllData[freq].filter(t => pag.room === null || t.room === pag.room);
  const maxPage = Math.floor((filtered.length - 1) / PAGE_SIZE);
  if (pag.page < maxPage) {
    pag.page++;
    renderTemplateFilteredPage(freq);
  }
}

function prevTemplates(freq) {
  const pag = templatePagination[freq];
  if (!pag || pag.page <= 0) return;
  pag.page--;
  renderTemplateFilteredPage(freq);
}

function filterTemplates(freq) {
  document.querySelectorAll('.template-filter-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById('filter' + freq);
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.template-group').forEach(g => g.classList.remove('visible'));
  const group = document.getElementById('group' + freq);
  if (group) group.classList.add('visible');
  if (templatePagination[freq]) {
    templatePagination[freq].page = 0;
    templatePagination[freq].room = null;
    renderTemplateFilteredPage(freq);
  }
}

function toggleDaySelector() {
  const freq = document.getElementById('newTaskFreq').value;
  document.getElementById('dayGroup').style.display = freq === 'weekly' ? 'block' : 'none';
}

function toggleNewRoom() {
  const roomSelect = document.getElementById('newTaskRoom');
  const newRoomGroup = document.getElementById('newRoomGroup');
  if (roomSelect.value === '__new__') {
    newRoomGroup.style.display = 'block';
    document.getElementById('newRoomName').focus();
  } else {
    newRoomGroup.style.display = 'none';
  }
}

async function addTemplate() {
  const token = localStorage.getItem('token');
  const desc = document.getElementById('newTaskDesc').value.trim();
  let room = document.getElementById('newTaskRoom').value;
  const newRoomName = document.getElementById('newRoomName').value.trim();
  
  if (room === '__new__') {
    if (!newRoomName) return showToast('Digite o nome do ambiente', 'error');
    room = newRoomName;
    const select = document.getElementById('newTaskRoom');
    const option = document.createElement('option');
    option.value = room;
    option.text = room;
    select.insertBefore(option, select.querySelector('option[value="__new__"]'));
    document.getElementById('newRoomName').value = '';
    select.value = room;
    document.getElementById('newRoomGroup').style.display = 'none';
  }
  
  const freq = document.getElementById('newTaskFreq').value;
  const assigned = document.getElementById('newTaskAssigned').value.trim();
  const dayValue = freq === 'weekly' ? parseInt(document.getElementById('newTaskDay').value) : null;
  if (!desc) return showToast('Digite a descrição', 'error');

  const btn = document.querySelector('#subtabTemplates .btn-primary');
  setLoading(btn, true);
  const res = await fetch(`${API_URL}/api/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ description: desc, room: room, frequency: freq, assigned_to: assigned || null, day_value: dayValue })
  });
  setLoading(btn, false);
  if (res.ok) {
    document.getElementById('newTaskDesc').value = '';
    document.getElementById('newTaskAssigned').value = '';
    await loadTemplates();
    showToast('Template adicionado', 'success');
  }
}

async function deleteTemplate(id) {
  showConfirmModal('Tem certeza que deseja remover este template?', async () => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/templates/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    await loadTemplates();
    showToast('Template removido', 'success');
  }, { title: 'Remover template', confirmText: 'Remover', type: 'danger' });
}

async function loadPendingCount() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/notifications/pending`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  document.getElementById('pendingCount').textContent = data.count;
}

function getSelectedDate() {
  const input = document.getElementById('taskDate');
  let val = input ? input.value : '';
  if (!val) {
    val = new Date().toISOString().split('T')[0];
    if (input) input.value = val;
  }
  return val;
}

function changeDate(delta) {
  const input = document.getElementById('taskDate');
  if (!input) return;
  const parts = input.value.split('-');
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  input.value = `${y}-${m}-${day}`;
  loadTasks();
}

function setDate(delta) {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  document.getElementById('taskDate').value = `${y}-${m}-${day}`;
  loadTasks();
}

function openDatePicker() {
  document.getElementById('taskDate').showPicker();
}

function renderTaskList(tasks, container, showBulk) {
  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  let html = '';

  if (pending.length > 0 && showBulk !== false) {
    html += `
      <div class="bulk-actions">
        <button class="btn btn-secondary btn-sm" onclick="selectAllTasks()">Todas</button>
        <button class="btn btn-primary btn-sm" onclick="bulkToggle()">Feitas</button>
        <button class="btn btn-secondary btn-sm" onclick="bulkDelete()">Excluir</button>
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
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    html = `
      <div class="empty">
        <i class="ph ph-clipboard-text"></i>
        <div class="empty-title">Nenhuma tarefa</div>
        <div class="empty-text" style="text-transform:capitalize">${dateFormatted}</div>
      </div>`;
  }

  container.innerHTML = html;
}

function buildTaskCard(task) {
  const isCompleted = task.completed;
  const room = task.room || '';
  const roomColor = getRoomColor(room);
  const roomBadge = room
    ? `<span class="room-badge" style="background:${roomColor}18;color:${roomColor}">${room}</span>`
    : '';
  const assigneeBadge = task.assigned_to
    ? `<span class="task-assignee">${task.assigned_to}</span>`
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

async function loadTasks() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const selectedDate = getSelectedDate();

  const datePills = document.querySelectorAll('#pageTasks .date-pill');
  datePills.forEach(btn => btn.classList.remove('active'));

  const parts = selectedDate.split('-');
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));

  if (diff === 0 && datePills[1]) datePills[1].classList.add('active');
  else if (diff === -1 && datePills[0]) datePills[0].classList.add('active');
  else if (diff === 1 && datePills[2]) datePills[2].classList.add('active');

  const container = document.getElementById('tasksList');
  if (!container) return;
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

    const progressTextEl = document.getElementById('progressText');
    const progressFillEl = document.getElementById('progressFill');
    if (progressTextEl) progressTextEl.textContent = `${completed.length} de ${total} concluídas`;
    if (progressFillEl) progressFillEl.style.width = rate + '%';

    renderTaskList(tasks, container, true);
  } catch (e) {
    container.innerHTML = '<div class="empty"><i class="ph ph-warning-circle"></i><div class="empty-title">Erro ao carregar</div></div>';
  }
}

function selectAllTasks() {
  const checkboxes = document.querySelectorAll('.task-check');
  const all = Array.from(checkboxes).every(cb => cb.checked);
  checkboxes.forEach(cb => cb.checked = !all);
}

function getSelected() {
  return Array.from(document.querySelectorAll('.task-check:checked')).map(cb => cb.value);
}

async function bulkToggle() {
  const ids = getSelected();
  if (!ids.length) return showToast('Selecione tarefas', 'error');
  const token = localStorage.getItem('token');
  for (const id of ids) {
    await fetch(`${API_URL}/api/tasks/${id}/toggle`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
  }
  await Promise.all([loadTasks(), loadPendingCount()]);
  showToast(`${ids.length} concluída(s)`, 'success');
}

async function bulkDelete() {
  const ids = getSelected();
  if (!ids.length) return showToast('Selecione tarefas', 'error');
  showConfirmModal(`Excluir ${ids.length} tarefa(s)?`, async () => {
    const token = localStorage.getItem('token');
    for (const id of ids) {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    }
    await Promise.all([loadTasks(), loadPendingCount()]);
    showToast(`${ids.length} excluída(s)`, 'success');
  }, { title: 'Excluir tarefas', confirmText: 'Excluir', type: 'danger' });
}

async function deleteTask(id) {
  showConfirmModal('Excluir esta tarefa?', async () => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    await Promise.all([loadTasks(), loadPendingCount()]);
  }, { title: 'Excluir tarefa', confirmText: 'Excluir', type: 'danger', cancelText: 'Cancelar' });
}

async function toggleTask(id) {
  const token = localStorage.getItem('token');
  await fetch(`${API_URL}/api/tasks/${id}/toggle`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
  await loadTasks();
  await loadPendingCount();
}

async function addQuickTaskInline() {
  const input = document.getElementById('quickTaskInput');
  const desc = input ? input.value.trim() : '';
  if (!desc) return showToast('Digite uma tarefa', 'error');

  const roomSelect = document.getElementById('quickTaskRoomSelect');
  const room = roomSelect ? roomSelect.value : '';
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
    if (input) input.value = '';
    await loadTasks();
    await loadPendingCount();
    showToast('Tarefa adicionada', 'success');
  } else {
    const data = await res.json();
    showToast(data.error || 'Erro', 'error');
  }
}

async function generateTasks() {
  const token = localStorage.getItem('token');
  const period = document.getElementById('generatePeriod').value;
  const btn = document.querySelector('#subtabGerar .btn-primary');
  setLoading(btn, true);
  const res = await fetch(`${API_URL}/api/tasks/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ period })
  });
  const data = await res.json();
  setLoading(btn, false);
  if (res.ok) {
    showToast(data.message, 'success');
    showPage('tasks');
    await Promise.all([loadTasks(), loadPendingCount()]);
  }
}

async function repeatTasks() {
  const token = localStorage.getItem('token');
  const source = document.getElementById('repeatSource').value;
  const res = await fetch(`${API_URL}/api/tasks/repeat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ sourcePeriod: source, targetPeriod: source })
  });
  const data = await res.json();
  if (res.ok) {
    showToast(data.message, 'success');
    showPage('tasks');
    await Promise.all([loadTasks(), loadPendingCount()]);
  }
}

async function loadNotifSettings() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/notifications/settings`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  document.getElementById('notifEnabled').checked = data.email_enabled !== false;
  document.getElementById('notifTime').value = data.reminder_time || '16:00';
  if (data.reminder_freq) {
    document.getElementById('notifFreq').value = data.reminder_freq;
    toggleNotifTimeGroup(data.reminder_freq);
  }
  // Pre-fill SMTP email from .env
  const smtpRes = await fetch(`${API_URL}/api/admin/smtp`, { headers: { 'Authorization': `Bearer ${token}` } });
  const smtpData = await smtpRes.json();
  if (smtpData.smtp_user) {
    document.getElementById('smtpEmail').value = smtpData.smtp_user;
  }
}

function toggleNotifTimeGroup(freq) {
  const timeGroup = document.getElementById('notifTimeGroup');
  if (timeGroup) {
    timeGroup.style.display = freq === 'daily' ? 'block' : 'none';
  }
}

async function saveNotifSettings() {
  const token = localStorage.getItem('token');
  const enabled = document.getElementById('notifEnabled').checked;
  const freq = document.getElementById('notifFreq').value;
  const time = document.getElementById('notifTime').value;
  
  toggleNotifTimeGroup(freq);
  
  await fetch(`${API_URL}/api/notifications/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ email_enabled: enabled, reminder_time: time, reminder_freq: freq })
  });
}

async function sendTestEmail() {
  const smtpEmail = document.getElementById('smtpEmail').value;
  const smtpPass = document.getElementById('smtpPass').value;
  
  if (smtpEmail) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/admin/smtp`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ smtp_user: smtpEmail, smtp_pass: smtpPass || undefined })
    });
    const data = await res.json();
    if (res.ok) {
      showToast('Credenciais salvas! Enviando teste...', 'success');
      setTimeout(sendTestEmailReal, 1000);
      return;
    } else {
      showToast(data.error || 'Erro ao salvar', 'error');
      return;
    }
  }
  
  sendTestEmailReal();
}

async function sendTestEmailReal() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/notifications/send-test`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  if (data.sent > 0) showToast('Email enviado!', 'success');
  else showToast(data.reason || 'Erro', 'error');
}

async function saveSmtpConfig() {
  const smtpEmail = document.getElementById('smtpEmail').value;
  const smtpPass = document.getElementById('smtpPass').value;
  
  if (!smtpEmail) {
    showToast('Preencha o email SMTP', 'error');
    return;
  }
  
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/admin/smtp`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ smtp_user: smtpEmail, smtp_pass: smtpPass || undefined })
  });
  const data = await res.json();
  
  if (res.ok) {
    showToast('Credenciais salvas!', 'success');
  } else {
    showToast(data.error || 'Erro ao salvar', 'error');
  }
}

// Confirmation Modal
function showConfirmModal(message, onConfirm, options = {}) {
  const existing = document.getElementById('confirmModalOverlay');
  if (existing) existing.remove();

  const type = options.type || 'warning';
  const confirmText = options.confirmText || 'Confirmar';
  const cancelText = options.cancelText || 'Cancelar';
  const title = options.title || 'Confirmar ação';

  const iconMap = {
    warning: '<i class="ph ph-warning"></i>',
    danger: '<i class="ph ph-trash"></i>',
    info: '<i class="ph ph-info"></i>'
  };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.id = 'confirmModalOverlay';
  overlay.style.animation = 'fadeIn 0.15s ease';
  overlay.innerHTML = `
    <div class="confirm-modal" onclick="event.stopPropagation()">
      <div class="confirm-modal-icon ${type}">${iconMap[type] || iconMap.warning}</div>
      <div class="confirm-modal-title">${title}</div>
      <div class="confirm-modal-message">${message}</div>
      <div class="confirm-modal-actions">
        <button class="btn btn-secondary btn-sm" id="confirmCancelBtn">${cancelText}</button>
        <button class="btn btn-primary btn-sm" id="confirmOkBtn" style="background:${type === 'danger' ? 'var(--destructive)' : 'var(--primary)'}">${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('confirmCancelBtn').onclick = () => overlay.remove();
  document.getElementById('confirmOkBtn').onclick = () => {
    overlay.remove();
    if (typeof onConfirm === 'function') onConfirm();
  };
  overlay.onclick = () => overlay.remove();

  document.getElementById('confirmOkBtn').focus();
}

function showAlertModal(message, options = {}) {
  const title = options.title || 'Atenção';
  const btnText = options.btnText || 'OK';
  const type = options.type || 'info';

  const existing = document.getElementById('confirmModalOverlay');
  if (existing) existing.remove();

  const iconMap = {
    info: '<i class="ph ph-info"></i>',
    warning: '<i class="ph ph-warning"></i>',
    danger: '<i class="ph ph-warning-circle"></i>'
  };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.id = 'confirmModalOverlay';
  overlay.style.animation = 'fadeIn 0.15s ease';
  overlay.innerHTML = `
    <div class="confirm-modal" onclick="event.stopPropagation()">
      <div class="confirm-modal-icon ${type}">${iconMap[type] || iconMap.info}</div>
      <div class="confirm-modal-message" style="font-size:15px">${message}</div>
      <div class="confirm-modal-actions">
        <button class="btn btn-primary btn-sm" id="alertOkBtn">${btnText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('alertOkBtn').onclick = () => overlay.remove();
  document.getElementById('alertOkBtn').focus();
  overlay.onclick = () => overlay.remove();
}

// Task Picker Modal
const defaultTasks = {
  'Sala de estar': ['Aspirar sofá', 'Limpar tv', 'Organizar revista', 'Limpar lustre', 'Passar pano nos móveis'],
  'Lavabo': ['Limpar pia', 'Limpar espelho', 'Trocar toalha', 'Reabastecer papel higiênico'],
  'Hall': ['Limpar piso', 'Limpar quadro', 'Verificar correio', 'Organizar sapato'],
  'Corredor': ['Aspirar piso', 'Limpar quadro', 'Organizar calçados'],
  'Varanda': ['Varrer piso', 'Limpar vidro', 'Regar plantas', 'Limpar grade'],
  'Suíte': ['Trocar lençóis', 'Organizar guarda-roupa', 'Limpar espelho', 'Arrumar cama'],
  'Escritório': ['Organizar mesa', 'Limpar computador', 'Arquivar documentos', 'Limpar estante'],
  'Quarto': ['Arrumar cama', 'Trocar lençóis', 'Organizar guarda-roupa', 'Aspirar piso', 'Limpar espelho'],
  'Banheiro social': ['Limpar vaso', 'Limpar pia', 'Limpar espelho', 'Trocar toalha', 'Reabastecer papel higiênico'],
  'Banheiro suite': ['Limpar vaso', 'Limpar pia', 'Limpar box', 'Trocar toalha', 'Reabastecer papel higiênico'],
  'Cozinha': ['Lavar louça', 'Limpar fogão', 'Limpar geladeira', 'Organizar despensa', 'Limpar piso'],
  'Área de serviço': ['Lavar roupa', 'Secar roupa', 'Passar ferro', 'Organizar produtos'],
  'Geral': ['Tirar lixo', 'Regar plantas', 'Alimentar bichos', 'Dar água fresca', 'Verificar contas']
};

function openTaskPicker() {
  const suggestionsEl = document.getElementById('taskSuggestions');

  let html = '<div class="room-group">';
  
  for (const [room, tasks] of Object.entries(defaultTasks)) {
    html += `<div class="room-title">${room}</div>`;
    html += `<div class="room-tasks">`;
    for (const task of tasks) {
      html += `<div class="suggestion-item" onclick="addFromPicker('${task.replace(/'/g, "\\'")}', '${room}', getSelectedDate())">${task}</div>`;
    }
    html += `</div>`;
  }
  html += '</div>';
  suggestionsEl.innerHTML = html;
  document.getElementById('taskPickerModal').style.display = 'flex';
}

function closeTaskPicker() {
  document.getElementById('taskPickerModal').style.display = 'none';
}

async function addQuickTask() {
  const desc = document.getElementById('quickTask').value.trim();
  if (!desc) return showToast('Digite uma tarefa', 'error');
  const room = document.getElementById('quickTaskRoom').value;
  const dueDate = getSelectedDate();
  const btn = document.querySelector('#taskPickerModal .btn-primary');
  setLoading(btn, true);
  await addFromPicker(desc, room, dueDate);
  setLoading(btn, false);
  document.getElementById('quickTask').value = '';
}

async function addFromPicker(desc, room, dueDate) {
  const token = localStorage.getItem('token');
  const date = dueDate || new Date().toISOString().split('T')[0];
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ description: desc, room: room, due_date: date })
  });
  if (res.ok) {
    closeTaskPicker();
    await loadTasks();
    await loadPendingCount();
    showToast('Tarefa adicionada', 'success');
  }
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  const icon = type === 'error' ? '<i class="ph ph-warning-circle"></i>' : type === 'success' ? '<i class="ph ph-check-circle"></i>' : '';
  toast.innerHTML = `${icon} <span>${msg}</span>
    <button class="toast-dismiss" onclick="this.parentElement.remove()" aria-label="Fechar">
      <i class="ph ph-x"></i>
    </button>`;
  container.appendChild(toast);
  const timeout = setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
  toast.addEventListener('click', () => { clearTimeout(timeout); });
}

(async () => {
  loadTheme();
  updateThemeIcons();

  const params = new URLSearchParams(window.location.search);
  if (params.get('reset')) {
    document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
    showAuth('reset');
    return;
  }

  document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];

  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) initApp();
      else localStorage.removeItem('token');
    } catch (e) {
      localStorage.removeItem('token');
    }
  }
})();
