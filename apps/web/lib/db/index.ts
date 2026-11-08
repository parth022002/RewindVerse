import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(connectionString && connectionString.trim().length > 0);

/**
 * Neon Drizzle instance. Initialized lazily only when DATABASE_URL is present.
 */
export const db = isDatabaseConfigured && connectionString
  ? drizzle(neon(connectionString), { schema })
  : null;

