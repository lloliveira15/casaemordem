const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Household = require('../models/Household');
const JwtUtil = require('../utils/jwt');
const NotificationService = require('../services/notification');
const db = require('../config/database');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, invite_code } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email e password são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const newUser = await User.create(username, email, password, phone);

    if (invite_code) {
      const household = await Household.findByInviteCode(invite_code.toUpperCase());
      if (household) {
        await Household.join(household.id, newUser.id);
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM household_members WHERE user_id = ? AND household_id != ?', [newUser.id, household.id], (err) => err ? reject(err) : resolve());
        });
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM households WHERE id != ? AND admin_id = ?', [household.id, newUser.id], (err) => err ? reject(err) : resolve());
        });
      }
    }

    const token = JwtUtil.generateToken(newUser.id, newUser.username);

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: { id: newUser.id, username: newUser.username, email: newUser.email, phone: newUser.phone },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = JwtUtil.generateToken(user.id, user.username);

    res.json({
      message: 'Login realizado com sucesso',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/logout (apenas remove token no client)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout realizado. Remova o token do localStorage.' });
});

// POST /auth/forgot-password - Solicitar redefinição de senha
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      // Não revelar se o email existe
      return res.json({ message: 'Se o email existir, você receberá um link para redefinir a senha' });
    }

    // Gerar token de redefinição (válido por 1 hora)
    const resetToken = JwtUtil.generateToken(user.id, user.username, { type: 'reset' }, 3600);
    
    // Enviar email
    const result = await NotificationService.sendPasswordResetEmail(email, resetToken);
    
    if (result.sent > 0) {
      res.json({ message: 'Email de redefinição enviado! Verifique sua caixa de entrada.' });
    } else {
      res.json({ 
        message: 'Se o email existir, você receberá um link para redefinir a senha',
        debug_token: resetToken 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/reset-password - Redefinir senha com token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar token
    const decoded = JwtUtil.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token expirado ou inválido' });
    }

    if (decoded.type !== 'reset') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Atualizar senha
    await User.updatePassword(decoded.userId, newPassword);
    
    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /auth/me - Get current user from token
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Sem token' });
  }

  const token = JwtUtil.extractTokenFromHeader(authHeader);
  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const decoded = JwtUtil.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token expirado' });
  }

  res.json({
    user: { id: decoded.userId, username: decoded.username }
  });
});

// PUT /auth/profile - Update current user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Sem token' });
    }

    const token = JwtUtil.extractTokenFromHeader(authHeader);
    const decoded = JwtUtil.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const { username, phone } = req.body;
    await User.updateProfile(decoded.userId, username, phone);

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
