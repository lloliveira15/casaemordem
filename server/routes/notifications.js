const express = require('express');
const router = express.Router();
const NotificationService = require('../services/notification');
const Household = require('../models/Household');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const getHousehold = async (req, res, next) => {
  const household = await Household.findByUserId(req.user.userId);
  if (!household) {
    return res.status(404).json({ error: 'Você não tem uma casa' });
  }
  req.householdId = household.id;
  next();
};

// GET /api/notifications/pending - Get today's pending tasks
router.get('/pending', authMiddleware, getHousehold, async (req, res) => {
  try {
    const tasks = await NotificationService.getPendingTasks(req.householdId);
    res.json({
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications/send-test - Send test email
router.post('/send-test', authMiddleware, getHousehold, async (req, res) => {
  try {
    const result = await NotificationService.sendDailyEmail(req.householdId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/settings - Get notification settings
router.get('/settings', authMiddleware, getHousehold, async (req, res) => {
  try {
    const db = require('../config/database');
    const sql = 'SELECT * FROM notification_settings WHERE household_id = ?';
    const settings = await new Promise((resolve, reject) => {
      db.get(sql, [req.householdId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!settings) {
      return res.json({
        email_enabled: true,
        reminder_time: '16:00'
      });
    }

    res.json({
      email_enabled: settings.email_enabled,
      reminder_time: settings.reminder_time
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notifications/settings - Update notification settings
router.put('/settings', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { email_enabled, reminder_time } = req.body;
    const db = require('../config/database');

    const sql = `
      INSERT OR REPLACE INTO notification_settings (household_id, email_enabled, reminder_time)
      VALUES (?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      db.run(sql, [req.householdId, email_enabled ? 1 : 0, reminder_time || '16:00'], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Configurações salvas' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
