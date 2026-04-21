require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const schedule = require('node-schedule');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const householdRoutes = require('./routes/households');
const templateRoutes = require('./routes/templates');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notifications');
const NotificationService = require('./services/notification');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas
app.use('/auth', authRoutes);
app.use('/api/household', householdRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Agendamento de notificações diárias às 16:00
const notificationRule = new schedule.RecurrenceRule();
notificationRule.hour = 16;
notificationRule.minute = 0;

const dailyJob = schedule.scheduleJob(notificationRule, async () => {
  console.log('⏰ Executando notificação diária das 16h...');
  await NotificationService.sendDailyEmailAll();
});

console.log('⏰ Agendador de notificações configurado para 16:00 diário');

// Rota raiz (servir index.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Casa em Ordem rodando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🏠 CASA EM ORDEM - Fase 1 Setup     ║
  ║   Servidor rodando em:                ║
  ║   http://localhost:${PORT}                 ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;
