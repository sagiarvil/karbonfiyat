process.env.ASTRO_TELEMETRY_DISABLED = "1";
const { execSync } = require("child_process");
execSync("npx astro build", { stdio: "inherit", env: process.env });
