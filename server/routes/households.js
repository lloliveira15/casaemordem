const express = require('express');
const router = express.Router();
const Household = require('../models/Household');
const authMiddleware = require('../middleware/auth');

// GET /api/household - Get current user's household info
router.get('/', authMiddleware, async (req, res) => {
  try {
    const household = await Household.findByUserId(req.user.userId);
    
    if (!household) {
      return res.json({ hasHousehold: false });
    }
    
    const members = await Household.getMembers(household.id);
    
    res.json({
      hasHousehold: true,
      household: {
        id: household.id,
        name: household.name,
        invite_code: household.invite_code,
        admin_id: household.admin_id,
        created_at: household.created_at
      },
      members: members.map(m => ({
        id: m.id,
        username: m.username,
        role: m.role,
        joined_at: m.joined_at
      })),
      isAdmin: household.admin_id === req.user.userId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/household - Create a new household (for first user)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const existing = await Household.findByUserId(req.user.userId);
    
    if (existing) {
      return res.status(400).json({ error: 'Você já pertence a uma casa' });
    }
    
    const { name } = req.body;
    const household = await Household.create(req.user.userId, name || null);
    
    res.status(201).json({
      message: 'Casa criada com sucesso',
      household: {
        id: household.id,
        name: household.name,
        invite_code: household.invite_code
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/household/generate-code - Generate new invite code
router.post('/generate-code', authMiddleware, async (req, res) => {
  try {
    const household = await Household.findByUserId(req.user.userId);
    
    if (!household) {
      return res.status(404).json({ error: 'Você não tem uma casa' });
    }
    
    if (household.admin_id !== req.user.userId) {
      return res.status(403).json({ error: 'Apenas o administrador pode gerar código' });
    }
    
    const result = await Household.regenerateCode(household.id);
    
    res.json({
      message: 'Código regenerado',
      invite_code: result.invite_code
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/household/join - Join existing household with invite code
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { invite_code } = req.body;
    
    if (!invite_code) {
      return res.status(400).json({ error: 'Código de convite é obrigatório' });
    }
    
    const existing = await Household.findByUserId(req.user.userId);
    
    if (existing) {
      return res.status(400).json({ error: 'Você já pertence a uma casa' });
    }
    
    const household = await Household.findByInviteCode(invite_code.toUpperCase());
    
    if (!household) {
      return res.status(404).json({ error: 'Código de convite inválido' });
    }
    
    await Household.join(household.id, req.user.userId);
    
    const members = await Household.getMembers(household.id);
    
    res.json({
      message: 'Você entrou na casa com sucesso',
      household: {
        id: household.id,
        name: household.name,
        invite_code: household.invite_code
      },
      members: members.map(m => ({
        id: m.id,
        username: m.username,
        role: m.role
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
