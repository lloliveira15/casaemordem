process.env.TZ = 'America/Sao_Paulo';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const householdRoutes = require('./routes/households');
const templateRoutes = require('./routes/templates');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/api/household', householdRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Rota raiz (servir index.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Casa em Ordem rodando!' });
});

// Rota para salvar config SMTP (admin)
app.put('/api/admin/smtp', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Sem token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const JwtUtil = require('./utils/jwt');
  const decoded = JwtUtil.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const { smtp_user, smtp_pass } = req.body;
  
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '..', '.env');
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(/^SMTP_USER=.*$/m, `SMTP_USER=${smtp_user}`);
  if (smtp_pass) {
    envContent = envContent.replace(/^SMTP_PASS=.*$/m, `SMTP_PASS=${smtp_pass}`);
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  process.env.SMTP_USER = smtp_user;
  if (smtp_pass) {
    process.env.SMTP_PASS = smtp_pass;
  }
  
  res.json({ message: 'Credenciais salvas!' });
});

// Rota para obter config SMTP atual (admin)
app.get('/api/admin/smtp', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Sem token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const JwtUtil = require('./utils/jwt');
  const decoded = JwtUtil.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  res.json({
    smtp_user: process.env.SMTP_USER || ''
  });
});

module.exports = app;
