import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const DEFAULT_URL = "mongodb://localhost:27017";

const mongoUrl = process.env.MONGODB_URL ?? DEFAULT_URL;

const client = new MongoClient(mongoUrl);

globalThis.db = client.db(process.env.MONGODB_DBNAME);

async function main() {
  const contents = await fs.readFile(
    path.join(__dirname, "../src/index.js"),
    "utf-8",
  );

  try {
    const result = await eval(contents);
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  await client.close();
}

main();
