import nodemon from "nodemon";
import path from "path";
import url from "url";

// "poylfill" __dirname for ESM
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const index = path.join(__dirname, "../src/index.js");
const env = path.join(__dirname, "../.env");
const bin = path.join(__dirname, "../bin/main.js");

nodemon({
  ext: "*",
  watch: [index, env],
  exec: `node ${bin}`,
  quiet: true,
});

nodemon.on("start", () => {
  console.clear();
});

nodemon.once("start", () => {
  console.log("Type `rs` to rerun at any time.\n\n");
});
