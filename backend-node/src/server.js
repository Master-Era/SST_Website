const path = require("path");
const dotenv = require("dotenv");

const envResult = dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

if (envResult.error) {
  console.error("[env] .env load failed:", envResult.error.message);
} else {
  console.log("[env] Environment file loaded.");
}

const app = require("./app");
const { port } = require("./config/env");
const { testConnection } = require("./config/db");
const {
  ensureAdminTables,
} = require("./services/bootstrapService");

console.log("[debug] Express app type:", typeof app);
console.log(
  "[debug] app.listen type:",
  typeof app?.listen
);

(async () => {
  try {
    await testConnection();
    await ensureAdminTables();

    app.listen(port, () => {
      console.log(
        `Node.js API running on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(
      "Backend startup failed:",
      error.message
    );
    process.exit(1);
  }
})();