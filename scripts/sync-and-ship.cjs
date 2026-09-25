const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const cacheFile = path.join(root, ".firebase", "hosting.ZGlzdA.cache");
const targetDigest = "a7a619fbd782230546e7994503ffaf6c1d5069ded38fe81b48ee344052b23aec";

try {
  // Git loose blob objelerini tara
  const objects = execSync("git rev-list --objects --all", { cwd: root, encoding: "utf8" })
    .split("\n")
    .map(line => line.trim().split(" ")[0])
    .filter(Boolean);

  let found = false;
  for (const obj of objects) {
    try {
      const type = execSync(`git cat-file -t ${obj}`, { cwd: root, encoding: "utf8" }).trim();
      if (type === "blob") {
        const content = execSync(`git cat-file -p ${obj}`, { cwd: root });
        const hash = crypto.createHash("sha256").update(content).digest("hex");
        if (hash === targetDigest) {
          fs.writeFileSync(cacheFile, content);
          console.log("[FOUND & RESTORED] Blob:", obj, "matches target hash:", hash);
          found = true;
          break;
        }
      }
    } catch (_) {}
  }
  if (!found) {
    console.log("[NOT_FOUND] Could not find blob matching targetDigest in git repo.");
  }
} catch (e) {
  console.error("Error:", e.message);
}


