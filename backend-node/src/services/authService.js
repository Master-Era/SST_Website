const crypto = require('crypto');
const { adminSecret, passwordSalt } = require('../config/env');
const { one } = require('../config/db');
const AppError = require('../utils/appError');

function hashPassword(password) {
  const digest = crypto.createHash('sha256').update(`${passwordSalt}:${password}`, 'utf8').digest('hex');
  return `sha256:${digest}`;
}

function verifyPassword(password, stored = '') {
  let expected;
  if (stored.startsWith('plain:')) expected = `plain:${password}`;
  else if (stored.startsWith('sha256:')) expected = hashPassword(password);
  else return false;
  const a = Buffer.from(stored);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function signToken(username, role) {
  const expires = Math.floor(Date.now() / 1000) + (12 * 60 * 60);
  const payload = `${username}|${role}|${expires}`;
  const signature = crypto.createHmac('sha256', adminSecret).update(payload).digest('hex');
  return `${payload}|${signature}`;
}

async function verifyToken(token) {
  try {
    const [username, role, expiresText, signature] = String(token || '').split('|');
    if (!username || !role || !expiresText || !signature) throw new Error('invalid');
    const payload = `${username}|${role}|${expiresText}`;
    const expected = crypto.createHmac('sha256', adminSecret).update(payload).digest('hex');
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('invalid');
    if (Number(expiresText) < Math.floor(Date.now() / 1000)) throw new Error('expired');
    const user = await one('SELECT id, name, username, role, status FROM admin_users WHERE username = ? LIMIT 1', [username]);
    if (!user || user.status !== 'active') throw new Error('inactive');
    return user;
  } catch {
    throw new AppError(401, 'Login required');
  }
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };
