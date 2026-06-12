const app = require('./app');
const schedule = require('node-schedule');
const NotificationService = require('./services/notification');

const PORT = process.env.PORT || 3000;

// Agendamento de notificações diárias às 16:00
const notificationRule = new schedule.RecurrenceRule();
notificationRule.hour = 16;
notificationRule.minute = 0;

const dailyJob = schedule.scheduleJob(notificationRule, async () => {
  console.log('⏰ Executando notificação diária das 16h...');
  await NotificationService.sendDailyEmailAll();
});

console.log('⏰ Agendador de notificações configurado para 16:00 diário');

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🏠 CASA EM ORDEM - Fase 1 Setup     ║
  ║   Servidor rodando em:                ║
  ║   http://localhost:${PORT}                 ║
  ╚════════════════════════════════════════╝
  `);
});
