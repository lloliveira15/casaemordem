const db = require('../config/database');

class TaskTemplate {
  static create(householdId, data) {
    return new Promise((resolve, reject) => {
      const { description, room, assigned_to, frequency, day_value } = data;
      const roomValue = room || 'Geral';
      
      const sql = `
        INSERT INTO task_templates (household_id, description, assigned_to, frequency, day_value, room)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.run(sql, [householdId, description, assigned_to || null, frequency || 'daily', day_value || 0, roomValue], function(err) {
        if (err) return reject(err);
        resolve({ 
          id: this.lastID, 
          household_id: householdId, 
          description, 
          room: room || 'Geral',
          assigned_to: assigned_to || null,
          frequency: frequency || 'daily',
          day_value: day_value || 0,
          is_active: 1
        });
      });
    });
  }

  static findByHousehold(householdId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM task_templates 
        WHERE household_id = ? AND is_active = 1
        ORDER BY frequency, day_value, description
      `;
      db.all(sql, [householdId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM task_templates WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { description, assigned_to, frequency, day_value, is_active } = data;
      
      const sql = `
        UPDATE task_templates 
        SET description = COALESCE(?, description),
            assigned_to = COALESCE(?, assigned_to),
            frequency = COALESCE(?, frequency),
            day_value = COALESCE(?, day_value),
            is_active = COALESCE(?, is_active)
        WHERE id = ?
      `;
      
      db.run(sql, [description, assigned_to, frequency, day_value, is_active, id], function(err) {
        if (err) return reject(err);
        resolve({ id, ...data });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE task_templates SET is_active = 0 WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) return reject(err);
        resolve({ id, deleted: true });
      });
    });
  }

  static getActiveByFrequency(householdId, frequency) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM task_templates 
        WHERE household_id = ? AND frequency = ? AND is_active = 1
      `;
      db.all(sql, [householdId, frequency], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = TaskTemplate;
