# Casa em Ordem

Gerenciador de tarefas domésticas para casais e famílias.

## Funcionalidades

- **Gestão de Tarefas**: Crie, conclua e exclua tarefas domésticas
- **Modelos de Tarefas**: Defina templates para gerar tarefas automaticamente
- **Ambientes**: Organize tarefas por cômodo da casa
- **Notificações por Email**: Receba lembretes diários das tarefas pendentes
- **Código de Invite**: Convide membros da família para a mesma casa

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Auth**: JWT

## Instalação

```bash
npm install
npm start
```

O servidor inicia em `http://localhost:3000`.

## API Endpoints

### Auth
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Usuário atual

### Tasks
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id/toggle` - Marcar como feita
- `DELETE /api/tasks/:id` - Excluir tarefa

### Templates
- `GET /api/templates` - Listar templates
- `POST /api/templates` - Criar template
- `DELETE /api/templates/:id` - Excluir template

### Household
- `GET /api/household` - Dados da casa
- `POST /api/household/generate-code` - Gerar novo código

### Notifications
- `GET /api/notifications/pending` - Tarefas pendentes
- `GET /api/notifications/settings` - Configurações
- `PUT /api/notifications/settings` - Atualizar configurações