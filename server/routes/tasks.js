const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Household = require('../models/Household');
const authMiddleware = require('../middleware/auth');

// Returns a date as YYYY-MM-DD in the process timezone (America/Sao_Paulo)
const toLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getHousehold = async (req, res, next) => {
  const household = await Household.findByUserId(req.user.userId);
  if (!household) {
    return res.status(404).json({ error: 'Você não tem uma casa' });
  }
  req.householdId = household.id;
  next();
};

// POST /api/tasks - Create quick task
router.post('/', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { description, room, assigned_to, due_date } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    const date = due_date || toLocalDateString(new Date());
    const sql = `
      INSERT INTO tasks (household_id, description, room, assigned_to, due_date, completed)
      VALUES (?, ?, ?, ?, ?, 0)
    `;

    const db = require('../config/database');
    db.run(sql, [req.householdId, description.trim(), room || null, assigned_to || null, date], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, description, room, assigned_to, due_date: date, completed: 0 });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getStartEndDates = (period) => {
  const now = new Date();
  let startDate, endDate;

  if (period === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    startDate = new Date(year, month, 1);
    endDate = new Date(year, month + 1, 0);
  } else if (period === 'week') {
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate = new Date(now);
    startDate.setDate(now.getDate() - diff);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else if (period === 'day') {
    startDate = new Date(now);
    endDate = new Date(now);
  }

  return {
    start: toLocalDateString(startDate),
    end: toLocalDateString(endDate)
  };
};

// GET /api/tasks - List tasks
router.get('/', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { date, startDate, endDate, completed, assignedTo } = req.query;
    
    const filters = {};
    if (date) filters.date = date;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }
    if (completed !== undefined) filters.completed = completed === 'true';
    if (assignedTo) filters.assignedTo = assignedTo;

    const tasks = await Task.findByHousehold(req.householdId, filters);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks/generate - Generate tasks from templates
router.post('/generate', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { startDate, endDate, period } = req.body;

    let start, end;
    
    if (startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      const dates = getStartEndDates(period || 'month');
      start = dates.start;
      end = dates.end;
    }

    const result = await Task.generateFromTemplates(req.householdId, start, end);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks/repeat - Repeat tasks from previous period
router.post('/repeat', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { sourcePeriod, targetPeriod } = req.body;

    let sourceStart, sourceEnd, targetStart, targetEnd;
    const now = new Date();

    if (sourcePeriod === 'month') {
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      sourceStart = toLocalDateString(prevMonth);
      sourceEnd = toLocalDateString(prevEnd);
    } else if (sourcePeriod === 'week') {
      sourceStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      sourceStart.setDate(sourceStart.getDate() - sourceStart.getDay() + 1);
      sourceEnd = new Date(sourceStart);
      sourceEnd.setDate(sourceStart.getDate() + 6);
      sourceStart = toLocalDateString(sourceStart);
      sourceEnd = toLocalDateString(sourceEnd);
    } else if (sourcePeriod === 'day') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      sourceStart = sourceEnd = toLocalDateString(yesterday);
    }

    if (targetPeriod === 'month') {
      const year = now.getFullYear();
      const month = now.getMonth();
      targetStart = toLocalDateString(new Date(year, month, 1));
      targetEnd = toLocalDateString(new Date(year, month + 1, 0));
    } else if (targetPeriod === 'week') {
      targetStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      targetStart.setDate(targetStart.getDate() - targetStart.getDay() + 1);
      targetEnd = new Date(targetStart);
      targetEnd.setDate(targetStart.getDate() + 6);
      targetStart = toLocalDateString(targetStart);
      targetEnd = toLocalDateString(targetEnd);
    } else if (targetPeriod === 'day') {
      targetStart = targetEnd = toLocalDateString(now);
    }

    const result = await Task.copyFromPeriod(req.householdId, sourceStart, sourceEnd, targetStart, targetEnd);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/tasks/:id/toggle - Toggle task completion
router.put('/:id/toggle', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (task.household_id !== req.householdId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    const result = await Task.toggleComplete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/clear - Clear tasks
router.delete('/clear', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { startDate, endDate, period } = req.body;

    if (startDate && endDate) {
      const result = await Task.deleteByPeriod(req.householdId, startDate, endDate);
      res.json({ message: `${result.deleted} tarefas removidas` });
    } else {
      const result = await Task.deleteAll(req.householdId);
      res.json({ message: `${result.deleted} tarefas removidas` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete single task
router.delete('/:id', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    if (task.household_id !== req.householdId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }
    
    await Task.delete(id);
    res.json({ message: 'Tarefa excluída' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/stats - Get stats
router.get('/stats', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;

    let start, end;
    if (startDate && endDate) {
      start = startDate;
      end = endDate;
    } else {
      const dates = getStartEndDates(period || 'month');
      start = dates.start;
      end = dates.end;
    }

    const stats = await Task.getStats(req.householdId, start, end);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/history - Get completed tasks history
router.get('/history', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      const now = new Date();
      const year = now.getFullYear();
      const mon = String(now.getMonth() + 1).padStart(2, '0');
      month = `${year}-${mon}`;
    }

    const tasks = await Task.getHistory(req.householdId, month);
    
    const stats = {
      total: tasks.length,
      byAssignedTo: {},
      byDayOfWeek: {},
      completedDates: []
    };

    for (const task of tasks) {
      if (task.assigned_to) {
        stats.byAssignedTo[task.assigned_to] = (stats.byAssignedTo[task.assigned_to] || 0) + 1;
      }
      
      const date = new Date(task.due_date + 'T00:00:00');
      const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][date.getDay()];
      stats.byDayOfWeek[dayName] = (stats.byDayOfWeek[dayName] || 0) + 1;

      if (!stats.completedDates.includes(task.due_date)) {
        stats.completedDates.push(task.due_date);
      }
    }

    res.json({ tasks, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;