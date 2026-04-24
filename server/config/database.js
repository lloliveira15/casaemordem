const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || '/app/data/db.sqlite3';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('✅ Conectado ao SQLite:', dbPath);
  }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela de lares/casas
  db.run(`
    CREATE TABLE IF NOT EXISTS households (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      admin_id INTEGER NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(admin_id) REFERENCES users(id)
    )
  `);

  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      household_id INTEGER,
      role TEXT DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(household_id) REFERENCES households(id)
    )
  `);

  // Tabela de templates de tarefas
  db.run(`
    CREATE TABLE IF NOT EXISTS task_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      room TEXT DEFAULT 'Geral',
      assigned_to TEXT,
      frequency TEXT DEFAULT 'daily',
      day_value INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(household_id) REFERENCES households(id)
    )
  `);

  // Tentar adicionar coluna room (ignora erro se já existir)
  db.run('ALTER TABLE task_templates ADD COLUMN room TEXT', () => {});

  // Tabela de tarefas instanciadas
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id INTEGER NOT NULL,
      template_id INTEGER,
      description TEXT NOT NULL,
      room TEXT,
      assigned_to TEXT,
      due_date DATE NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_by INTEGER,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(household_id) REFERENCES households(id),
      FOREIGN KEY(template_id) REFERENCES task_templates(id),
      FOREIGN KEY(completed_by) REFERENCES users(id)
    )
  `);

  // Adicionar coluna room se não existir
  db.run('ALTER TABLE tasks ADD COLUMN room TEXT', () => {});

  // Tabela de membros da casa
  db.run(`
    CREATE TABLE IF NOT EXISTS household_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(household_id) REFERENCES households(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Tabela de eventos avulsos
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      description TEXT NOT NULL,
      event_date_time DATETIME NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_by INTEGER,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(household_id) REFERENCES households(id),
      FOREIGN KEY(created_by) REFERENCES users(id),
      FOREIGN KEY(completed_by) REFERENCES users(id)
    )
  `);

  // Tabela de configurações de notificações
  db.run(`
    CREATE TABLE IF NOT EXISTS notification_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id INTEGER NOT NULL UNIQUE,
      email_enabled INTEGER DEFAULT 1,
      reminder_time TEXT DEFAULT '16:00',
      reminder_freq TEXT DEFAULT 'daily',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(household_id) REFERENCES households(id)
    )
  `);

  // Adicionar coluna reminder_freq se não existir
  db.run('ALTER TABLE notification_settings ADD COLUMN reminder_freq TEXT', () => {});

  console.log('📊 Tabelas verificadas/criadas com sucesso');
});

module.exports = db;
