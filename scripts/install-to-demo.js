const fs = require("fs");
const path = require("path");

// Read schema.json
const schemaPath = path.join(__dirname, "../schema.json");
if (!fs.existsSync(schemaPath)) {
  console.error("schema.json not found! Please run 'node scripts/create-schema.js' first.");
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

// Install files to demo directory
const demoDir = path.join(__dirname, "../demo");

schema.files.forEach((file) => {
  const targetPath = path.join(demoDir, file.path);
  const targetDir = path.dirname(targetPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Write file content
  fs.writeFileSync(targetPath, file.content);
  console.log(`✓ Installed ${file.path}`);
});

console.log("\n✅ All components installed to demo directory!");
console.log("\nNote: Make sure your demo's tsconfig.json has the correct path aliases configured.");

