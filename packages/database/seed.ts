import "dotenv/config";

import { createLogger } from "@repo/telemetry";

import { sql } from "./src/index.js";

const logger = createLogger("database:seed");

await sql`select 1`;
logger.info("Database seed completed (no seed data yet)");

await sql.end();
