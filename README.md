# Casa em Ordem

Gerenciador de tarefas domésticas para casais e famílias.

## Funcionalidades

- **Gestão de Tarefas**: Crie, conclua e exclua tarefas domésticas
- **Modelos de Tarefas**: Defina templates para gerar tarefas automaticamente
- **Ambientes**: Organize tarefas por cômodo da casa
- **Notificações por Email**: Receba lembretes diários das tarefas pendentes
- **Código de Convite**: Convide membros da família para a mesma casa

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (email/password)
- **Email**: Resend API
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Deploy**: Vercel

## Instalação

```bash
cp .env.local.example .env.local  # configure suas chaves
npm install
npm run dev
```

O servidor inicia em `http://localhost:3000`.
