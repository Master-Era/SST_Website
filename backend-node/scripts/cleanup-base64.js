/*
  One-off cleanup script.

  Some rows in page_content ended up with entire images embedded as giant
  base64 "data:image/..." strings (from an old admin-panel bug where a
  failed upload silently saved the raw file into the database instead of
  showing an error). This is what caused the public content API to crash
  with a MySQL "Out of sort memory" error.

  This script walks every row's JSON, and for ANY string value that is a
  base64 data URL (no matter how deeply nested - single field, inside an
  array, inside a nested object), it clears just that value to an empty
  string. Every other field (titles, text, real "/uploads/..." image
  URLs) is left completely untouched.

  After running this, please re-open the admin panel and re-upload the
  real images for any section that now shows a blank/missing image.

  Usage (from the backend-node folder on the server):
    node scripts/cleanup-base64.js
*/

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { pool } = require("../src/config/db");

function isBase64DataUrl(value) {
  return (
    typeof value === "string" &&
    (value.startsWith("data:image") || value.startsWith("data:application"))
  );
}

function stripBase64(value) {
  if (isBase64DataUrl(value)) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(stripBase64);
  }
  if (value && typeof value === "object") {
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = stripBase64(value[key]);
    }
    return result;
  }
  return value;
}

async function main() {
  const [rows] = await pool.query(
    "SELECT id, page_key, content_data FROM page_content"
  );

  console.log(`Checking ${rows.length} row(s)...\n`);

  for (const row of rows) {
    let data;
    try {
      data =
        typeof row.content_data === "string"
          ? JSON.parse(row.content_data)
          : row.content_data;
    } catch (error) {
      console.log(`- SKIPPED "${row.page_key}": could not parse JSON (${error.message})`);
      continue;
    }

    const before = JSON.stringify(data);
    const cleaned = stripBase64(data);
    const after = JSON.stringify(cleaned);

    if (before !== after) {
      await pool.execute(
        "UPDATE page_content SET content_data = ? WHERE id = ?",
        [after, row.id]
      );
      console.log(
        `✓ CLEANED "${row.page_key}": ${before.length} bytes -> ${after.length} bytes`
      );
    } else {
      console.log(`  no change needed for "${row.page_key}" (${before.length} bytes)`);
    }
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Cleanup script failed:", error);
  process.exit(1);
});
