const nodemailer = require('nodemailer');
const Task = require('../models/Task');
const Household = require('../models/Household');
const db = require('../config/database');

// Returns today's date as YYYY-MM-DD in the process timezone (America/Sao_Paulo)
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

class NotificationService {
  static getTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  static async sendDailyEmail(householdId) {
    try {
      const transporter = this.getTransporter();
      
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('📧 Email não configurado (SMTP_USER/SMTP_PASS)');
        return { sent: 0, reason: 'Email não configurado' };
      }

      const today = getLocalDateString();
      
      const tasks = await Task.findByHousehold(householdId, {
        date: today,
        completed: false
      });

      if (tasks.length === 0) {
        console.log('📧 Sem tarefas pendentes para hoje');
        return { sent: 0, reason: 'Sem tarefas pendentes' };
      }

      const sql = `
        SELECT u.email, u.username FROM users u
        WHERE u.household_id = ?
      `;
      
      const members = await new Promise((resolve, reject) => {
        db.all(sql, [householdId], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      const taskList = tasks.map(t => `- ${t.description}`).join('\n');
      const subject = `📋 Você tem ${tasks.length} tarefa(s) para hoje!`;
      const text = `
Olá!

Você tem ${tasks.length} tarefa(s) pendente(s) para hoje:

${taskList}

Acesse o app para marcar como concluídas.

🏠 Casa em Ordem
      `.trim();

      const emails = members.map(m => m.email);
      
      const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: emails,
        subject: subject,
        text: text
      });

      console.log(`📧 Email enviado para ${emails.join(', ')}: ${info.messageId}`);
      return { sent: emails.length, messageId: info.messageId };
    } catch (error) {
      console.error('📧 Erro ao enviar email:', error.message);
      return { sent: 0, error: error.message };
    }
  }

  static async sendDailyEmailAll() {
    console.log('📧 Enviando emails diários...');
    
    const sql = 'SELECT DISTINCT household_id FROM users WHERE household_id IS NOT NULL';
    const households = await new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    let totalSent = 0;
    for (const h of households) {
      const result = await this.sendDailyEmail(h.household_id);
      if (result.sent > 0) totalSent++;
    }

    console.log(`📧 Emails enviados para ${totalSent} casas`);
    return { households: households.length, sent: totalSent };
  }

  static async getPendingTasks(householdId) {
    const today = getLocalDateString();
    return await Task.findByHousehold(householdId, {
      date: today,
      completed: false
    });
  }
}

module.exports = NotificationService;
