process.env.ASTRO_TELEMETRY_DISABLED = "1";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const backup = path.join(root, ".dist-last-good");

const removeIfExists = (target) => {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
};

try {
  removeIfExists(backup);

  if (fs.existsSync(dist)) {
    fs.cpSync(dist, backup, { recursive: true });
  }

  execSync("node scripts/engine-regression.mjs", {
    stdio: "inherit",
    env: process.env,
    cwd: root
  });

  execSync("npx astro build", {
    stdio: "inherit",
    env: process.env,
    cwd: root
  });

  execSync("node scripts/production-check.cjs", {
    stdio: "inherit",
    env: process.env,
    cwd: root
  });

  execSync("node scripts/seo-ci-gate.cjs", {
    stdio: "inherit",
    env: process.env,
    cwd: root
  });

  execSync("node scripts/mobile-ci-gate.cjs", {
    stdio: "inherit",
    env: process.env,
    cwd: root
  });

  removeIfExists(backup);
} catch (error) {
  console.error("\nBUILD FAILED — restoring last known-good dist/ so a failed build cannot wipe production assets.\n");

  removeIfExists(dist);

  if (fs.existsSync(backup)) {
    fs.renameSync(backup, dist);
  }

  process.exit(error.status || 1);
}
