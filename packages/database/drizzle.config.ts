import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const url =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/ameta";

export default defineConfig({
  dbCredentials: {
    url
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/schema/*.ts"
});
