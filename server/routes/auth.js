const express = require('express');
const router = express.Router();
const User = require('../models/User');
const JwtUtil = require('../utils/jwt');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validações básicas
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email e password são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Criar usuário
    const newUser = await User.create(username, email, password);

    // Gerar token
    const token = JwtUtil.generateToken(newUser.id, newUser.username);

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
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
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
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

module.exports = router;
