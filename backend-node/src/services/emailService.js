const nodemailer = require('nodemailer');
const { one } = require('../config/db');
const { smtp } = require('../config/env');

let transporter;

function getTransporter() {
  if (!smtp.host || !smtp.user || !smtp.pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }

  return transporter;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character]));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

async function getRecipients() {
  const settings = await one('SELECT email1,email2,email3 FROM settings WHERE id=1');

  return [settings?.email1, settings?.email2, settings?.email3, smtp.notifyTo]
    .flatMap((value) => String(value || '').split(','))
    .map((value) => value.trim())
    .filter(isValidEmail)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function buildEmailHtml(heading, fields) {
  const rows = Object.entries(fields || {})
    .map(([label, value]) => `
      <tr>
        <td style="width:34%;padding:11px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700;color:#334155;vertical-align:top">
          ${escapeHtml(label)}
        </td>
        <td style="padding:11px 12px;border:1px solid #e2e8f0;color:#0f172a;white-space:pre-wrap">
          ${escapeHtml(value || '-')}
        </td>
      </tr>`)
    .join('');

  return `
    <div style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:720px;margin:0 auto;overflow:hidden;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;box-shadow:0 12px 35px rgba(15,23,42,.08)">
        <div style="padding:24px;background:linear-gradient(135deg,#7c2d12,#ea580c);color:#ffffff">
          <div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.85">Website Notification</div>
          <h2 style="margin:8px 0 6px;font-size:24px">Shreeji Samipya Trust</h2>
          <p style="margin:0;line-height:1.6;opacity:.92">${escapeHtml(heading)}</p>
        </div>
        <div style="padding:24px">
          <table style="width:100%;border-collapse:collapse">${rows}</table>
          <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.6">
            This notification was generated automatically by the Shreeji Samipya Trust website.
          </p>
        </div>
      </div>
    </div>`;
}

async function sendAdminNotification({ subject, heading, fields, replyTo }) {
  try {
    const mailer = getTransporter();
    const recipients = await getRecipients();

    if (!mailer) {
      console.warn('[email] SMTP is not configured. Submission was saved, but notification was not sent.');
      return { sent: false, reason: 'smtp_not_configured' };
    }

    if (!recipients.length) {
      console.warn('[email] No valid notification recipient is configured. Submission was saved.');
      return { sent: false, reason: 'recipient_not_configured' };
    }

    const safeReplyTo = isValidEmail(replyTo) ? replyTo : undefined;
    const text = [heading, '', ...Object.entries(fields || {}).map(([key, value]) => `${key}: ${value || '-'}`)].join('\n');

    const info = await mailer.sendMail({
      from: smtp.from || `Shreeji Samipya Website <${smtp.user}>`,
      to: recipients,
      replyTo: safeReplyTo,
      subject,
      text,
      html: buildEmailHtml(heading, fields),
    });

    console.log(`[email] Notification sent: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('[email] Notification failed:', error.message);
    return { sent: false, reason: 'send_failed', error: error.message };
  }
}

async function verifyEmailConfiguration() {
  const mailer = getTransporter();
  if (!mailer) return { configured: false };

  try {
    await mailer.verify();
    console.log('[email] SMTP connection verified successfully.');
    return { configured: true, verified: true };
  } catch (error) {
    console.error('[email] SMTP verification failed:', error.message);
    return { configured: true, verified: false, error: error.message };
  }
}

module.exports = {
  sendAdminNotification,
  verifyEmailConfiguration,
};
