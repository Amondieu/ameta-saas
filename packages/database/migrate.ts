import "dotenv/config";

import { migrate } from "drizzle-orm/postgres-js/migrator";

import { createLogger } from "@repo/telemetry";

import { db, sql } from "./src/index.js";

const logger = createLogger("database:migrate");

await migrate(db, { migrationsFolder: "./drizzle" });
logger.info("Database migrations applied");

await sql.end();
