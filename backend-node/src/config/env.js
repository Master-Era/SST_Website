const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminSecret: process.env.ADMIN_SECRET || 'shreeji-samipya-admin-secret',
  passwordSalt: process.env.ADMIN_PASSWORD_SALT || 'shreeji-samipya',
  uploadMaxMb: Number(process.env.UPLOAD_MAX_MB || 100),
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    user: process.env.SMTP_USER || 'hariitsolution07@gmail.com',
    pass: process.env.SMTP_PASS || 'bvaznnfkhfxgzegz',
    from: process.env.SMTP_FROM || 'hariitsolution07@gmail.com',
    notifyTo: process.env.NOTIFICATION_EMAIL || 'hariitsolution07@gmail.com',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shreeji_trust_db',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    dateStrings: true,
    decimalNumbers: true,
  },
};
