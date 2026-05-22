import { afterAll, describe, expect, it } from "vitest";

import { sql } from "../client.js";

describe("database schema integration", () => {
  afterAll(async () => {
    await sql.end();
  });

  it("creates the Better Auth tables in Postgres", async () => {
    const rows = await sql<{ table_name: string }[]>`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name in ('user', 'session', 'account', 'verification')
    `;

    expect(rows.map((row) => row.table_name).sort()).toEqual([
      "account",
      "session",
      "user",
      "verification"
    ]);
  });
});
