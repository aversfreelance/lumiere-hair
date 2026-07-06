import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDb(): NeonHttpDatabase<typeof schema> | null {
  if (!hasDatabase()) return null;

  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export async function withDb<T>(
  fn: (db: NeonHttpDatabase<typeof schema>) => Promise<T>,
  fallback: T,
  timeoutMs = 4000
): Promise<T> {
  const db = getDb();
  if (!db) return fallback;

  try {
    return await Promise.race([
      fn(db),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), timeoutMs)
      ),
    ]);
  } catch (error) {
    console.error("Database query failed:", error);
    return fallback;
  }
}

/** @deprecated Use getDb() or withDb() instead */
export const db = {
  get select() {
    const instance = getDb();
    if (!instance) throw new Error("DATABASE_URL is not set");
    return instance.select.bind(instance);
  },
  get insert() {
    const instance = getDb();
    if (!instance) throw new Error("DATABASE_URL is not set");
    return instance.insert.bind(instance);
  },
  get update() {
    const instance = getDb();
    if (!instance) throw new Error("DATABASE_URL is not set");
    return instance.update.bind(instance);
  },
  get delete() {
    const instance = getDb();
    if (!instance) throw new Error("DATABASE_URL is not set");
    return instance.delete.bind(instance);
  },
};
