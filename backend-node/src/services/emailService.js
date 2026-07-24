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
      auth: { user: smtp.user, pass: smtp.pass },
    });
  }
  return transporter;
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char]));
}

async function getRecipients() {
  const settings = await one('SELECT email1,email2,email3 FROM settings WHERE id=1');
  return [settings?.email1, settings?.email2, settings?.email3, smtp.notifyTo]
    .flatMap((value) => String(value || '').split(','))
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

async function sendAdminNotification({ subject, heading, fields }) {
  try {
    const mailer = getTransporter();
    const recipients = await getRecipients();
    if (!mailer || !recipients.length) {
      console.warn('[email] SMTP or notification recipient is not configured; submission saved without email.');
      return { sent: false };
    }
    const rows = Object.entries(fields || {}).map(([label, value]) => `<tr><td style="padding:9px;border:1px solid #e2e8f0;font-weight:700">${esc(label)}</td><td style="padding:9px;border:1px solid #e2e8f0">${esc(value)}</td></tr>`).join('');
    await mailer.sendMail({
      from: smtp.from || smtp.user,
      to: recipients.join(','),
      subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden"><div style="padding:22px;background:#0f4fd1;color:white"><h2 style="margin:0">Shreeji Samipya Trust</h2><p style="margin:6px 0 0">${esc(heading)}</p></div><div style="padding:22px"><table style="width:100%;border-collapse:collapse">${rows}</table><p style="color:#64748b;font-size:12px;margin-top:18px">This email was sent automatically from the website.</p></div></div>`,
    });
    return { sent: true };
  } catch (error) {
    console.error('[email] Notification failed:', error.message);
    return { sent: false, error: error.message };
  }
}

module.exports = { sendAdminNotification };
