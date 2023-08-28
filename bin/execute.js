import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";
import url from "url";
import util from "util";

// "poylfill" __dirname for ESM
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// setup `.env` file
dotenv.config();

const DEFAULT_URL = "mongodb://localhost:27017";

const mongoUrl = process.env.MONGODB_URL ?? DEFAULT_URL;

const client = new MongoClient(mongoUrl);

globalThis.ObjectId = ObjectId;
globalThis.db = client.db(process.env.MONGODB_DBNAME);

/**
 * Check if an environment variable has been set to a `true`-like value
 *
 * @param {string} varName the name of the field within `process.env` to check
 *
 * @example
 * // checks if `process.env.HELLO_WORLD` is `"true"`, `"yes"`, etc.
 * const isHelloWorld = envTrue("HELLO_WORLD");
 */
function envTrue(varName) {
  const envVar = process.env[varName];

  return (
    envVar && ["true", "yes", "1", "on", "y"].includes(envVar.toLowerCase())
  );
}

const logPrompt = envTrue("LOG_PROMPT");
const colors = !envTrue("DISABLE_COLORS");

const inspect = (/** @type {string} */ arg) =>
  console.log(util.inspect(arg, { depth: null, colors }));

const contents = await fs.readFile(
  path.join(__dirname, "../src/index.js"),
  "utf-8",
);

try {
  if (logPrompt) {
    console.log("--------------- PROMPT ---------------\n");
    console.log(contents);
    console.log();
    console.log("--------------- RESULT ---------------\n");
  }

  const result = await eval(contents);
  inspect(result);

  console.log();
} catch (error) {
  console.error(error);
}

await client.close();
