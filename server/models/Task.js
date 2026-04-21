const db = require('../config/database');
const TaskTemplate = require('./TaskTemplate');

class Task {
  static generateFromTemplates(householdId, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
      try {
        const templates = await TaskTemplate.findByHousehold(householdId);
        
        if (templates.length === 0) {
          return resolve({ generated: 0, message: 'Nenhum template encontrado' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const tasksToInsert = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const currentDate = d.toISOString().split('T')[0];
          const dayOfWeek = d.getDay(); // 0 = domingo
          const dayOfMonth = d.getDate();
          const weekOfMonth = Math.ceil(dayOfMonth / 7); // 1-5
          const isFirstHalf = dayOfMonth <= 15; // true = 1ª quincena

          for (const template of templates) {
            let shouldGenerate = false;

            if (template.frequency === 'daily') {
              shouldGenerate = true;
            } else if (template.frequency === 'weekly') {
              // 0=segunda, 6=domingo no JS, mas usamos 0=segunda
              const templateDay = template.day_value;
              shouldGenerate = dayOfWeek === templateDay;
            } else if (template.frequency === 'biweekly') {
              const quincena = isFirstHalf ? 1 : 2;
              shouldGenerate = template.day_value === quincena;
            } else if (template.frequency === 'monthly') {
              shouldGenerate = template.day_value === dayOfMonth;
            }

            if (shouldGenerate) {
              tasksToInsert.push({
                household_id: householdId,
                template_id: template.id,
                description: template.description,
                room: template.room || null,
                assigned_to: template.assigned_to,
                due_date: currentDate,
                completed: 0
              });
            }
          }
        }

        if (tasksToInsert.length === 0) {
          return resolve({ generated: 0, message: 'Nenhuma tarefa gerada para o período' });
        }

        const insertSql = `
          INSERT INTO tasks (household_id, template_id, description, room, assigned_to, due_date, completed)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        let generated = 0;
        for (const task of tasksToInsert) {
          await new Promise((res, rej) => {
            db.run(insertSql, [
              task.household_id, task.template_id, task.description,
              task.room, task.assigned_to, task.due_date, task.completed
            ], function(err) {
              if (err) return rej(err);
              generated++;
              res();
            });
          });
        }

        resolve({ generated, message: `${generated} tarefas geradas` });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findByHousehold(householdId, filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM tasks WHERE household_id = ?';
      const params = [householdId];

      if (filters.date) {
        sql += ' AND due_date = ?';
        params.push(filters.date);
      }

      if (filters.startDate && filters.endDate) {
        sql += ' AND due_date BETWEEN ? AND ?';
        params.push(filters.startDate, filters.endDate);
      }

      if (filters.completed !== undefined) {
        sql += ' AND completed = ?';
        params.push(filters.completed ? 1 : 0);
      }

      if (filters.assignedTo) {
        sql += ' AND assigned_to = ?';
        params.push(filters.assignedTo);
      }

      sql += ' ORDER BY due_date ASC, id ASC';

      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static toggleComplete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const task = await this.findById(id);
        if (!task) {
          return reject(new Error('Tarefa não encontrada'));
        }

        const newStatus = task.completed ? 0 : 1;
        const completedAt = newStatus ? new Date().toISOString() : null;

        const sql = `
          UPDATE tasks 
          SET completed = ?, completed_at = ?
          WHERE id = ?
        `;

        db.run(sql, [newStatus, completedAt, id], function(err) {
          if (err) return reject(err);
          resolve({ 
            id, 
            completed: newStatus,
            completed_at: completedAt
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteByPeriod(householdId, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM tasks 
        WHERE household_id = ? AND due_date BETWEEN ? AND ?
      `;

      db.run(sql, [householdId, startDate, endDate], function(err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      });
    });
  }

  static deleteAll(householdId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tasks WHERE household_id = ?';
      db.run(sql, [householdId], function(err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tasks WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      });
    });
  }

  static getStats(householdId, startDate, endDate) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
        FROM tasks 
        WHERE household_id = ? AND due_date BETWEEN ? AND ?
      `;

      db.get(sql, [householdId, startDate, endDate], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getHistory(householdId, month) {
    return new Promise((resolve, reject) => {
      const [year, mon] = month.split('-');
      const startDate = `${year}-${mon}-01`;
      const lastDay = new Date(year, mon, 0).getDate();
      const endDate = `${year}-${mon}-${lastDay}`;

      const sql = `
        SELECT * FROM tasks 
        WHERE household_id = ? 
          AND due_date BETWEEN ? AND ?
          AND completed = 1
        ORDER BY completed_at DESC
      `;

      db.all(sql, [householdId, startDate, endDate], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static copyFromPeriod(householdId, sourceStart, sourceEnd, targetStart, targetEnd) {
    return new Promise(async (resolve, reject) => {
      try {
        const sourceTasks = await this.findByHousehold(householdId, {
          startDate: sourceStart,
          endDate: sourceEnd
        });

        if (sourceTasks.length === 0) {
          return resolve({ generated: 0, message: 'Nenhuma tarefa no período de origem' });
        }

        const sourceDays = {};
        for (const task of sourceTasks) {
          const dayOfWeek = new Date(task.due_date).getDay();
          if (!sourceDays[dayOfWeek]) sourceDays[dayOfWeek] = [];
          sourceDays[dayOfWeek].push(task);
        }

        const targetDays = {};
        for (let d = new Date(targetStart); d <= new Date(targetEnd); d.setDate(d.getDate() + 1)) {
          const dayOfWeek = d.getDay();
          const dateStr = d.toISOString().split('T')[0];
          if (!targetDays[dayOfWeek]) targetDays[dayOfWeek] = [];
          targetDays[dayOfWeek].push(dateStr);
        }

        let generated = 0;
        const insertSql = `
          INSERT INTO tasks (household_id, template_id, description, assigned_to, due_date, completed)
          VALUES (?, ?, ?, ?, ?, 0)
        `;

        for (const sourceDay of Object.keys(sourceDays)) {
          if (!targetDays[sourceDay]) continue;
          
          const sourceTasksOfDay = sourceDays[sourceDay];
          const targetDatesOfDay = targetDays[sourceDay];

          for (const targetDate of targetDatesOfDay) {
            for (const task of sourceTasksOfDay) {
              await new Promise((res, rej) => {
                db.run(insertSql, [
                  householdId, task.template_id, task.description,
                  task.assigned_to, targetDate
                ], function(err) {
                  if (err) return rej(err);
                  generated++;
                  res();
                });
              });
            }
          }
        }

        resolve({ generated, message: `${generated} tarefas copiadas` });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = Task;
