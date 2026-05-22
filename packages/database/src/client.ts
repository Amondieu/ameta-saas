import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { createLogger } from "@repo/telemetry";

import { schema } from "./schema/index.js";

const logger = createLogger("database");
const connectionString =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/ameta";

export const sql = postgres(connectionString, {
  onnotice: (notice) => logger.debug({ notice }, "Postgres notice")
});

export const db = drizzle(sql, { schema });
