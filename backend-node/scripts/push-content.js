/*
  Pushes website-content.js live to the database, directly - no admin
  panel involved.

  Usage (from the backend-node folder):
    node scripts/push-content.js

  Run this every time you edit website-content.js and want the change
  to go live immediately.
*/

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { pool } = require("../src/config/db");
const websiteContent = require("./website-content");

async function main() {
  await pool.execute(
    `INSERT INTO page_content (page_key, content_data)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE content_data = VALUES(content_data), updated_at = CURRENT_TIMESTAMP`,
    ["Admin Website Data", JSON.stringify(websiteContent)]
  );

  console.log("✓ Website content pushed live successfully.");
  console.log("  Open your website now (hard refresh) to see the changes.");
  process.exit(0);
}

main().catch((error) => {
  console.error("✗ Push failed:", error.message);
  process.exit(1);
});
