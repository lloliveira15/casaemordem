# Casa em Ordem

Task management app for couples with email notifications.

## Commands

```bash
npm start       # Run server (server/index.js)
npm run dev     # Alias for start
```

## Architecture

- **Entry**: `server/index.js` (package.json main)
- **Root `index.js`**: Standalone in-memory version (not used in production)
- **Database**: SQLite at `./db.sqlite3`
- **Static files**: `public/index.html`

## Key Files

- `server/config/database.js` - SQLite setup
- `server/routes/auth.js` - Auth endpoints
- `server/middleware/auth.js` - JWT verification
- `server/models/User.js` - User model
- `server/utils/jwt.js` - JWT utilities

## Environment

Required in `.env`:
- `JWT_SECRET` - Auth secret
- `DB_PATH` - SQLite path (default: `./db.sqlite3`)
- `PORT` - Server port (default: 3000)
- `SMTP_*` - Email config for nodemailer

## Notes

- No tests configured (`npm test` is a stub)
- No lint/typecheck scripts
- Uses CommonJS (`"type": "commonjs"`)
