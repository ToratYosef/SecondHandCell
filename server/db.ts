import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const databaseFile = databaseUrl.replace(/^file:/, "");

export const sqlite = new Database(databaseFile);
export const db = drizzle(sqlite, { schema });
