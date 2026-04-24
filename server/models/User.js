const bcrypt = require('bcryptjs');
const db = require('../config/database');

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

class User {
  // Criar novo usuário
  static create(username, email, password) {
    return new Promise((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return reject(err);

        const sql = `
          INSERT INTO users (username, email, password_hash)
          VALUES (?, ?, ?)
        `;

        db.run(sql, [username, email, hashedPassword], function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              reject(new Error('Usuário ou email já existem'));
            } else {
              reject(err);
            }
          } else {
            const userId = this.lastID;

            const inviteCode = generateInviteCode();
            const householdName = `${username}'s Casa`;
            const createHousehold = `
              INSERT INTO households (name, admin_id, invite_code)
              VALUES (?, ?, ?)
            `;

            db.run(createHousehold, [householdName, userId, inviteCode], function(err) {
              if (err) {
                console.error('Erro ao criar household:', err);
                resolve({ id: userId, username, email });
              } else {
                const householdId = this.lastID;

                const linkUser = `
                  UPDATE users SET household_id = ?, role = 'admin' WHERE id = ?
                `;
                db.run(linkUser, [householdId, userId], (err) => {
                  if (err) {
                    console.error('Erro ao associar usuário ao household:', err);
                  }
                  resolve({ id: userId, username, email, household_id: householdId });
                });
              }
            });
          }
        });
      });
    });
  }

  // Buscar usuário por email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Buscar usuário por username
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Buscar usuário por ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Verificar senha
  static verifyPassword(password, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, isValid) => {
        if (err) reject(err);
        else resolve(isValid);
      });
    });
  }

  // Atualizar senha
  static updatePassword(userId, newPassword) {
    return new Promise((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
        if (err) return reject(err);
        
        const sql = 'UPDATE users SET password_hash = ? WHERE id = ?';
        db.run(sql, [hashedPassword, userId], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }
}

module.exports = User;
