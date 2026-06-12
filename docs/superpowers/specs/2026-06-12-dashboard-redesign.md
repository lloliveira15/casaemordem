# Casa em Ordem — Redesign de Layout e Usabilidade

## 1. Visão Geral

Redesign completo do frontend do app Casa em Ordem. Migrar de um layout de 2 abas (Tarefas + Config) para uma estrutura com sidebar completa, dashboard como landing page, navegação rica, e cards de tarefas visuais.

## 2. Estrutura de Layout

### 2.1 Sidebar (Desktop) — 240px

- Fundo levemente mais escuro que o conteúdo (`--bg-alt` ou tom específico)
- 4 itens de navegação com ícone + label:
  - 📊 Dashboard (`ph-house`) — landing padrão
  - 📋 Tarefas (`ph-list-checks`) — visão completa de tarefas
  - 👥 Membros (`ph-users`) — gerenciamento de membros
  - ⚙️ Config (`ph-gear-six`) — templates, notificações, SMTP, produtividade, gerar tarefas
- Item ativo destacado (bg diferente + cor primária)
- Footer: nome do usuário + tema toggle + logout
- Em mobile: sidebar vira bottom nav (4 itens)

### 2.2 Header

- Reduzido, apenas logotipo + pendências rápidas + tema toggle
- Sem navegação no header (tudo na sidebar/bottom nav)

### 2.3 Dashboard (Landing Page)

- Widgets em linha horizontal (scroll em mobile, grid em desktop):
  1. **Pendentes hoje** — número grande + barra de progresso + label
  2. **Produtividade** — % de conclusão do período + nome do líder
  3. **Membros** — chips com nomes + botão "Convidar"
- Abaixo: **Tarefas do dia** — mesma task list da aba Tarefas, mas filtrada para hoje
- Widgets têm fundo branco, cantos arredondados (12px), sombra suave

### 2.4 Página de Tarefas

- Date pills: Ontem | Hoje | Amanhã | 📅 date picker
- Barra de progresso do dia (concluídas / total)
- Task cards:
  - Checkbox arredondado à esquerda
  - Descrição em negrito
  - Room tag com cor única por cômodo (ex: Cozinha=#F97316, Quarto=#3B82F6, Sala=#8B5CF6, Banheiro=#06B6D4)
  - Assignee badge
  - Ação de completar no checkbox
  - Ação de excluir aparece no hover (desktop) ou swipe (mobile)
- Tarefas concluídas: opacidade reduzida + strike + transição suave
- Bulk actions: "Selecionar todas", "Concluir selecionadas", "Excluir selecionadas"
- Quick-add inline no final da lista: input + select de cômodo + botão "+"
- Ao completar: animação sutil de transição
- Estados vazios: ilustração + "Nenhuma tarefa para hoje"

### 2.5 Página de Membros

- Cards de membros (design atual melhorado com cores consistentes)
- Código de convite em destaque + QR code + botões copiar/enviar email
- Entrar em casa (input de código + botão)
- Header com título "Membros" + botão "Convidar"

### 2.6 Página de Config

- Sub-abas estilo pills (mantém estrutura atual mas com visual refinado):
  - **Templates** — formulário de criar + lista paginada com filtro de frequência/ambiente
  - **Notificações** — SMTP + config de email diário + toggle frequência + test email
  - **Gerar Tarefas** — período + gerar + repetir período anterior
  - **Produtividade** — seletor de período + cards de membros com barra de progresso
- Cards com padding e espaçamento refinados (consistente com novo design)
- Conteúdo funcionalmente idêntico ao atual, apenas com visual renovado

### 2.7 Mobile

- Bottom nav: Dashboard | Tarefas | Membros | Config
- Widgets do Dashboard em scroll horizontal
- Task cards ocupam largura total
- Quick-add como FAB (floating action button) ou barra fixa inferior
- Sidebar vira bottom sheet se necessário (para logout/tema no mobile)

## 3. Sistema de Cores

### 3.1 Cores dos Cômodos (color tags)

| Cômodo | Cor | Uso |
|--------|-----|-----|
| Cozinha | #F97316 (orange) | Badge, borda sutil do card |
| Quarto | #3B82F6 (blue) | Badge |
| Sala | #8B5CF6 (purple) | Badge |
| Banheiro | #06B6D4 (cyan) | Badge |
| Área de Serviço | #10B981 (emerald) | Badge |
| Varanda | #84CC16 (lime) | Badge |
| Escritório | #6B7280 (gray) | Badge |
| Hall/Corredor | #EC4899 (pink) | Badge |
| Geral | #7C3AED (primary) | Badge |
| Suíte | #F472B6 (rose) | Badge |

Cada room tag é um badge pequeno (pill) com bg 15% opacidade + texto na cor.

### 3.2 Tema

Manter tema roxo atual como base, com dark mode (já implementado).

## 4. Interações

- **Navegação**: Troca de páginas via sidebar/bottom nav — mostra/esconde seções (sem router)
- **Completar tarefa**: Checkbox → toggle via API → animação de fade
- **Excluir**: Confirm modal (já implementado) → remoção da lista
- **Quick-add**: Input inline → Enter ou botão → POST → recarrega lista
- **Widgets**: Dados carregados com skeleton shimmer (já implementado)
- **Drawer de config**: Sub-abas em pills, sem navegação extra
- **Toast**: Notificações de ação (já implementado com dismiss)

## 5. Estados

- **Loading**: Skeleton cards (já implementado)
- **Empty**: Ilustração + texto + ação (ex: "Nenhuma tarefa. Crie uma!")
- **Error**: Toast com mensagem (já implementado)
- **Offline**: O app não tem suporte offline — manter comportamento atual (erro na API)

## 6. Não Escopo (para esta versão)

- Drag & drop de tarefas
- Notificações push
- Suporte offline / PWA
- Multi-idioma
- Exportar dados

## 7. Mudanças Técnicas

### 7.1 HTML (`public/index.html`)

- Reestruturar seções em 4 páginas: `dashboard`, `tasks`, `members`, `config`
- Sidebar com 4 botões + footer
- Página de membros separada (remover da config)
- Widgets do dashboard em container horizontal
- Date pills: Ontem | Hoje | Amanhã | 📅
- Task cards com room tags coloridas

### 7.2 CSS (`public/css/app.css`)

- Sidebar 240px com itens estilizados
- Dashboard grid com widgets horizontais
- Task cards com room color tags
- Date pills no topo
- Página de membros dedicada
- Transições suaves entre páginas
- Scroll horizontal para widgets mobile

### 7.3 JS (`public/js/app.js`)

- Função `showPage(page)` para trocar entre dashboard/tasks/members/config
- Load inicial carrega dashboard por padrão
- `loadDashboard()` para carregar widgets + tarefas do dia
- Separar lógica de membros em sua própria função
- Ajustar date pills para navegação rápida
- Room colors mapping para os badges

### 7.4 Tokens (`public/css/tokens.css`)

- Adicionar variáveis de cor para cada cômodo
- Manter dark mode existente

## 8. Testes

- Mesma suite de testes (28 passando, 1 falha pré-existente)
- Testes lógicos (pagination, filters) não são afetados
- Testes de API continuam válidos (backend não muda)
