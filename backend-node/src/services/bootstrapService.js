const { execute, one } = require('../config/db');
const { hashPassword } = require('./authService');

async function ignore(sql) { try { await execute(sql); } catch (_) {} }

async function ensureAdminTables() {
  await execute(`CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150), username VARCHAR(100) UNIQUE, password_hash VARCHAR(255),
    role ENUM('super_admin','admin','editor') DEFAULT 'editor',
    status ENUM('active','inactive') DEFAULT 'active', failed_attempts INT DEFAULT 0,
    lock_count INT DEFAULT 0, locked_until DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await ignore('ALTER TABLE admin_users ADD COLUMN failed_attempts INT DEFAULT 0');
  await ignore('ALTER TABLE admin_users ADD COLUMN lock_count INT DEFAULT 0');
  await ignore('ALTER TABLE admin_users ADD COLUMN locked_until DATETIME NULL');
  await ignore("ALTER TABLE hari_bhakto ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'Connected'");
  await ignore("ALTER TABLE hari_bhakto MODIFY COLUMN status VARCHAR(30) NOT NULL DEFAULT 'Connected'");
  await ignore("UPDATE hari_bhakto SET status='Connected' WHERE status IS NULL OR TRIM(status)='' OR LOWER(TRIM(status)) IN ('new','verified','active')");
  await execute(`CREATE TABLE IF NOT EXISTS content_items (
    id INT PRIMARY KEY AUTO_INCREMENT, module VARCHAR(80), section VARCHAR(120), title VARCHAR(255),
    short_text TEXT, content TEXT, image_url VARCHAR(500), video_url VARCHAR(500), pdf_url VARCHAR(500),
    sort_order INT DEFAULT 0, status ENUM('active','draft','hidden') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  await execute(`CREATE TABLE IF NOT EXISTS page_content (
    id INT PRIMARY KEY AUTO_INCREMENT, page_key VARCHAR(150) UNIQUE, content_data JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  await execute(`CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY, email1 VARCHAR(150), email2 VARCHAR(150), email3 VARCHAR(150),
    bank_details TEXT, upi_id VARCHAR(150), upi_qr VARCHAR(500), donation_categories TEXT
  )`);
  await execute(`INSERT INTO settings (id,email1,email2,email3,donation_categories)
    VALUES (1,'','','','General, Annadan, Gaushala') ON DUPLICATE KEY UPDATE id=id`);
  const existing = await one('SELECT id FROM admin_users WHERE username=? LIMIT 1', ['superadmin']);
  if (!existing) {
    await execute(`INSERT INTO admin_users (name,username,password_hash,role,status) VALUES (?,?,?,?,?)`,
      ['Super Admin', 'superadmin', hashPassword('Master@123'), 'super_admin', 'active']);
  }
}
module.exports = { ensureAdminTables };
