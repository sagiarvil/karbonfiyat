const { execSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

function run(cmd, desc) {
  console.log(`\n[RUNNING] ${desc}: ${cmd}`);
  try {
    const out = execSync(cmd, { cwd: root, encoding: "utf8", stdio: "inherit", env: process.env });
    console.log(`[SUCCESS] ${desc}`);
    return out;
  } catch (err) {
    console.error(`[ERROR] ${desc} failed:`, err.message);
    return null;
  }
}

console.log("=== KARBONFIYAT PRODUCTION SHIP & SYNC PIPELINE ===");

// 1. Git Add
run("git add -A", "Staging all files");

// 2. Git Commit
run('git commit -m "feat(suite): CBAM XML motoru, LCA teknoloji katsayilari, RSS/Atom feed ve SEO optimizasyonlari"', "Git Commit");

// 3. Git Push
run("git push origin main", "Git Push to origin main");

// 4. Firebase Deploy
run("npx firebase deploy --only hosting:karbonfiyat", "Firebase Hosting Deploy");

console.log("\n=== PIPELINE EXECUTION FINISHED ===");
