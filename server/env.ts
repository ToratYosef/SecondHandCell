import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

let envLoaded = false;

function loadEnvFile() {
  if (envLoaded) return;
  envLoaded = true;

  const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
  const envPath = path.join(projectRoot, ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const contents = readFileSync(envPath, "utf-8");
  for (const line of contents.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) continue;
    const key = line.slice(0, equalsIndex).trim();
    if (!key) continue;
    let value = line.slice(equalsIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const envSchema = z.object({
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  SHIPENGINE_KEY: z.string().optional(),
  SHIPENGINE_FROM_NAME: z.string().optional(),
  SHIPENGINE_FROM_COMPANY: z.string().optional(),
  SHIPENGINE_FROM_ADDRESS1: z.string().optional(),
  SHIPENGINE_FROM_ADDRESS2: z.string().optional(),
  SHIPENGINE_FROM_CITY: z.string().optional(),
  SHIPENGINE_FROM_STATE: z.string().optional(),
  SHIPENGINE_FROM_POSTAL: z.string().optional(),
  SHIPENGINE_FROM_PHONE: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export function requireEnv(key: keyof typeof env) {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
