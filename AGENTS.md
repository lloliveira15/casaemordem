# Casa em Ordem

Task management app for couples with email notifications, Brazilian Portuguese UI.

## Commands

```bash
npm start       # node server/index.js
npm run dev     # server + browser-sync live reload (concurrently)
npm test        # jest --coverage
npm run test:watch  # jest --watch
```

## Architecture

- **Entry**: `server/index.js` — loads `app.js`, sets up `node-schedule` daily email at 16:00 BRT, then listens
- **`server/app.js`** — Express app exported for testing (reused by `server/index.js`)
- **Root `index.js`** — standalone in-memory version (not used in production)
- **Database**: SQLite at `DB_PATH` (default `./db.sqlite3`). 7 tables: `households`, `users`, `task_templates`, `tasks`, `household_members`, `events`, `notification_settings`
- **Timezone**: `America/Sao_Paulo` (set in `server/app.js:1` before any other code)
- **Auth**: JWT via `server/utils/jwt.js`, middleware at `server/middleware/auth.js`
- **Email**: dual provider — SMTP (nodemailer, default) or Resend API (set `EMAIL_PROVIDER=resend`)
- **Static files**: `public/` served from Express, all client logic in `public/index.html` (vanilla JS)

## Tests

```bash
npm test              # jest --coverage
npm run test:watch    # jest --watch
```

- **Test files**: `tests/api.test.js` (supertest integration) + `tests/logic.test.js` (pure JS unit)
- **Test config**: `jest.config.js` — node env, matches `**/tests/**/*.test.js`, coverage excludes `server/index.js` and `server/config/`
- **Integration tests** set `DB_PATH=:memory:` and `JWT_SECRET=test-secret` at top, then require the app
- **Coverage directory**: `coverage/` (gitignored)

## Environment

Required in `.env`:
- `JWT_SECRET` — auth secret
- `DB_PATH` — SQLite path (default: `./db.sqlite3`)
- `PORT` — server port (default: 3000)
- `NODE_ENV=production` — set in `.env`
- `RESET_URL` — used for password reset / invite links in emails
- `SMTP_*` or `EMAIL_PROVIDER=resend` + `RESEND_API_KEY` — email config

## Key Files

- `server/app.js` — Express app setup, route wiring, SMTP admin endpoints
- `server/index.js` — Server start with node-schedule scheduler
- `server/config/database.js` — SQLite init + all table creation
- `server/routes/auth.js` — register, login, forgot/reset password, profile
- `server/routes/tasks.js` — CRUD, generate from templates, repeat, stats, history
- `server/routes/templates.js` — CRUD for task templates
- `server/routes/households.js` — household CRUD, invite/join, member management
- `server/routes/notifications.js` — pending tasks, settings, test email
- `server/services/notification.js` — SMTP + Resend email, daily digest, invite, password reset
- `server/models/*.js` — data access layer (callback-based, promisified manually)

## Notes

- Uses CommonJS (`"type": "commonjs"`)
- No lint/typecheck scripts
- Procfile for Heroku: `web: npm start`
- `server.log` in .gitignore (runtime logging)
