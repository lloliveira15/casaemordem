const nodemailer = require('nodemailer');
const https = require('https');
const Task = require('../models/Task');
const Household = require('../models/Household');
const db = require('../config/database');

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
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  static isEmailConfigured() {
    const provider = process.env.EMAIL_PROVIDER || 'smtp';
    if (provider === 'resend') {
      return !!process.env.RESEND_API_KEY;
    }
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  }

  static async sendEmail({ to, subject, text }) {
    const provider = process.env.EMAIL_PROVIDER || 'smtp';
    if (provider === 'resend') {
      return this._sendViaResend({ to, subject, text });
    }
    return this._sendViaSmtp({ to, subject, text });
  }

  static async _sendViaSmtp({ to, subject, text }) {
    const transporter = this.getTransporter();
    const from = process.env.SMTP_USER;
    const info = await transporter.sendMail({ from, to, subject, text });
    return { sent: true, messageId: info.messageId };
  }

  static async _sendViaResend({ to, subject, text }) {
    return new Promise((resolve, reject) => {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
      const data = JSON.stringify({ from, to, subject, text });

      const options = {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        },
        timeout: 15000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ sent: true, messageId: JSON.parse(body).id });
          } else {
            reject(new Error(`Resend API error ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Connection timeout')); });
      req.write(data);
      req.end();
    });
  }

  static async sendPasswordResetEmail(email, resetToken) {
    try {
      if (!this.isEmailConfigured()) {
        return { sent: 0, reason: 'Email não configurado no servidor' };
      }

      const resetLink = `${process.env.RESET_URL || 'http://localhost:3000'}?reset=${resetToken}`;

      const subject = '🏠 Casa em Ordem - Redefinir senha';
      const text = `Olá,\n\nVocê solicitou a redefinição da sua senha no Casa em Ordem.\n\nClique no link abaixo para criar uma nova senha:\n${resetLink}\n\nEste link é válido por 1 hora.\n\nSe você não solicitou, ignore este email.`;

      await this.sendEmail({ to: email, subject, text });
      return { sent: 1 };
    } catch (error) {
      console.error('📧 Erro ao enviar email de reset:', error);
      return { sent: 0, reason: error.message };
    }
  }

  static async sendDailyEmail(householdId) {
    try {
      if (!this.isEmailConfigured()) {
        console.log('📧 Email não configurado');
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

      const sql = `SELECT u.email, u.username FROM users u WHERE u.household_id = ?`;
      const members = await new Promise((resolve, reject) => {
        db.all(sql, [householdId], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      const taskList = tasks.map(t => `- ${t.description}`).join('\n');
      const subject = `🏠 Casa em Ordem - Você tem ${tasks.length} tarefa(s) para hoje!`;
      const text = `Olá!\n\nVocê tem ${tasks.length} tarefa(s) pendente(s) para hoje:\n\n${taskList}\n\nAcesse o app para marcar como concluídas.\n\n🏠 Casa em Ordem`;

      const emails = members.map(m => m.email);
      const info = await this.sendEmail({
        to: emails,
        subject,
        text
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

  static async sendInviteEmail(toEmail, inviteCode, senderName) {
    try {
      if (!this.isEmailConfigured()) {
        return { sent: 0, reason: 'Email não configurado no servidor' };
      }

      const inviteLink = `${process.env.RESET_URL || 'http://localhost:3000'}?invite=${inviteCode}`;

      const subject = `🏠 Casa em Ordem - Convite para ${senderName}`;
      const text = `Olá!\n\n${senderName} te convidou para entrar no Casa em Ordem!\n\nUse o código abaixo no app para entrar:\n\n${inviteCode}\n\nOu acesse o link:\n${inviteLink}\n\n🏠 Casa em Ordem`;

      await this.sendEmail({ to: toEmail, subject, text });
      return { sent: 1 };
    } catch (error) {
      console.error('📧 Erro ao enviar convite:', error.message);
      return { sent: 0, error: error.message };
    }
  }
}

module.exports = NotificationService;
