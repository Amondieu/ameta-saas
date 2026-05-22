import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { tenant, tenantMembership } from "./schema/tenancy.js";

describe("tenancy schema", () => {
  it("uses explicit tenant table names", () => {
    expect(getTableName(tenant)).toBe("tenant");
    expect(getTableName(tenantMembership)).toBe("tenant_membership");
  });
});
