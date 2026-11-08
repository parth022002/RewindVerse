import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

/**
 * Workspaces table for team and user trace organization.
 */
export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Traces table storing metadata, manifest, and optional S3/R2 pointer.
 */
export const traces = pgTable("traces", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id),
  runId: text("run_id").notNull(),
  name: text("name").notNull(),
  manifestJson: jsonb("manifest_json").notNull(),
  s3Key: text("s3_key"),
  totalSteps: integer("total_steps").notNull(),
  finalLoss: text("final_loss"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Share tokens for secure, unguessable read-only public sharing.
 */
export const shareTokens = pgTable("share_tokens", {
  token: text("token").primaryKey(),
  traceId: text("trace_id").notNull().references(() => traces.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(true).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

