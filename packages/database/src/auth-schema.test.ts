import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { account, session, user, verification } from "./schema/auth.js";

describe("auth schema", () => {
  it("uses singular Better Auth table names", () => {
    expect(getTableName(user)).toBe("user");
    expect(getTableName(session)).toBe("session");
    expect(getTableName(account)).toBe("account");
    expect(getTableName(verification)).toBe("verification");
  });
});
