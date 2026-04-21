const db = require('../config/database');

class Household {
  static generateInviteCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static create(adminId, name = null) {
    return new Promise((resolve, reject) => {
      const inviteCode = this.generateInviteCode();
      
      db.run(
        'INSERT INTO households (admin_id, name, invite_code) VALUES (?, ?, ?)',
        [adminId, name, inviteCode],
        function(err) {
          if (err) return reject(err);
          
          const householdId = this.lastID;
          
          db.run(
            'INSERT INTO household_members (household_id, user_id, role) VALUES (?, ?, ?)',
            [householdId, adminId, 'admin'],
            function(err2) {
              if (err2) return reject(err2);
              
              db.run(
                'UPDATE users SET household_id = ?, role = ? WHERE id = ?',
                [householdId, 'admin', adminId],
                function(err3) {
                  if (err3) return reject(err3);
                  resolve({ id: householdId, name, admin_id: adminId, invite_code: inviteCode });
                }
              );
            }
          );
        }
      );
    });
  }

  static findByInviteCode(code) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM households WHERE invite_code = ?';
      db.get(sql, [code], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM households WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static join(householdId, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO household_members (household_id, user_id, role) VALUES (?, ?, ?)',
        [householdId, userId, 'member'],
        function(err) {
          if (err) return reject(err);
          
          db.run(
            'UPDATE users SET household_id = ?, role = ? WHERE id = ?',
            [householdId, 'member', userId],
            function(err2) {
              if (err2) return reject(err2);
              resolve({ household_id: householdId, user_id: userId });
            }
          );
        }
      );
    });
  }

  static getMembers(householdId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT u.id, u.username, u.email, hm.role, hm.joined_at
        FROM users u
        JOIN household_members hm ON u.id = hm.user_id
        WHERE hm.household_id = ?
      `;
      db.all(sql, [householdId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static regenerateCode(householdId) {
    return new Promise((resolve, reject) => {
      const newCode = this.generateInviteCode();
      db.run(
        'UPDATE households SET invite_code = ? WHERE id = ?',
        [newCode, householdId],
        function(err) {
          if (err) return reject(err);
          resolve({ invite_code: newCode });
        }
      );
    });
  }

  static findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM households WHERE id = (SELECT household_id FROM users WHERE id = ?)';
      db.get(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = Household;
