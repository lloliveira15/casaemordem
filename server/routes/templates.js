const express = require('express');
const router = express.Router();
const TaskTemplate = require('../models/TaskTemplate');
const Household = require('../models/Household');
const authMiddleware = require('../middleware/auth');

// Middleware to get household
const getHousehold = async (req, res, next) => {
  const household = await Household.findByUserId(req.user.userId);
  if (!household) {
    return res.status(404).json({ error: 'Você não tem uma casa' });
  }
  req.householdId = household.id;
  next();
};

// GET /api/templates - List all templates
router.get('/', authMiddleware, getHousehold, async (req, res) => {
  try {
    const templates = await TaskTemplate.findByHousehold(req.householdId);
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/templates - Create template
router.post('/', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { description, room, assigned_to, frequency, day_value } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly'];
    const freq = frequency || 'daily';
    if (!validFrequencies.includes(freq)) {
      return res.status(400).json({ error: 'Frequência inválida' });
    }

    const template = await TaskTemplate.create(req.householdId, {
      description: description.trim(),
      room: room || 'Geral',
      assigned_to,
      frequency: freq,
      day_value: day_value || 0
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/templates/:id - Update template
router.put('/:id', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, assigned_to, frequency, day_value, is_active } = req.body;

    const existing = await TaskTemplate.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    if (existing.household_id !== req.householdId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    const updated = await TaskTemplate.update(id, {
      description,
      assigned_to,
      frequency,
      day_value,
      is_active
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/templates/:id - Delete template
router.delete('/:id', authMiddleware, getHousehold, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await TaskTemplate.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    if (existing.household_id !== req.householdId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await TaskTemplate.delete(id);

    res.json({ message: 'Template removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
