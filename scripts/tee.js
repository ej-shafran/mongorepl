import nodemon from "nodemon";
import path from "path";
import url from "url";

// "poylfill" __dirname for ESM
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const index = path.join(__dirname, "../src/index.js");
const env = path.join(__dirname, "../.env");
const bin = path.join(__dirname, "../bin/main.js");
const out =
  process.env.TEE_OUT || process.argv[2] || path.join(__dirname, "../out");

nodemon({
  ext: "*",
  env: {
    DISABLE_COLORS: process.env.DISABLE_COLORS ?? "y",
    LOG_PROMPT: process.env.LOG_PROMPT ?? "y",
    DISABLE_WARNINGS: process.env.DISABLE_WARNINGS ?? "y",
  },
  watch: [index, env],
  exec: `node ${bin} | tee ${out}`,
  quiet: true,
});
